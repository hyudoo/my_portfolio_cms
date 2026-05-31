'use client';

import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { FileIcon, ImageIcon, Loader2, Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { fileRequest } from '@/requests/file.request';
import { FileEntity } from '@/types/entities/file.entity';

type UploadItem = {
  id: string;
  file: File;
  progress: number;
  error?: string;
  entity?: FileEntity;
};

type UploadInputSingleProps = {
  mode?: 'single';
  value?: FileEntity;
  onChange?: (value: FileEntity | undefined) => void;
};

type UploadInputMultipleProps = {
  mode: 'multiple';
  value?: FileEntity[];
  onChange?: (value: FileEntity[]) => void;
};

type UploadInputBaseProps = {
  accept?: string;
  maxSizeMB?: number;
  isPublic?: boolean;
  className?: string;
  disabled?: boolean;
};

export type UploadInputProps = UploadInputBaseProps & (UploadInputSingleProps | UploadInputMultipleProps);

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;

function isImageFile(name: string) {
  return IMAGE_EXTS.test(name);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadInput({
  mode = 'single',
  accept,
  maxSizeMB = 100,
  isPublic = false,
  value,
  onChange,
  className,
  disabled,
}: UploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = useCallback(
    async (file: File, itemId: string): Promise<FileEntity> => {
      const { presignedUrl, s3Key } = await fileRequest.getPresignedUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        isPublic,
      });

      // Upload directly to S3 — must use plain axios, not the api instance,
      // because the api instance adds auth headers that S3 presigned URLs reject.
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploading((prev) => prev.map((u) => (u.id === itemId ? { ...u, progress } : u)));
          }
        },
      });

      const { file: entity } = await fileRequest.saveMetadata({
        name: file.name,
        s3Key,
        size: file.size,
        isPublic,
      });

      return entity;
    },
    [isPublic],
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      const oversized = files.filter((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized.length > 0) {
        notify.error(`Tệp vượt quá giới hạn ${maxSizeMB}MB`);
        return;
      }

      const items: UploadItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
      }));

      setUploading((prev) => (mode === 'single' ? items : [...prev, ...items]));

      // In single mode auto-delete the existing file before replacing
      if (mode === 'single' && value) {
        const existing = value as FileEntity;
        fileRequest.delete({ ids: [existing.id] }).catch(() => null);
        (onChange as (v: FileEntity | undefined) => void)?.(undefined);
      }

      // Capture existing values once before the loop so sequential uploads accumulate correctly
      const existingEntities = mode === 'multiple' ? ((value as FileEntity[]) ?? []) : [];
      const newEntities: FileEntity[] = [];

      for (const item of items) {
        try {
          const entity = await uploadFile(item.file, item.id);
          newEntities.push(entity);

          setUploading((prev) => prev.map((u) => (u.id === item.id ? { ...u, entity, progress: 100 } : u)));

          if (mode === 'single') {
            (onChange as (v: FileEntity | undefined) => void)?.(entity);
          } else {
            (onChange as (v: FileEntity[]) => void)?.([...existingEntities, ...newEntities]);
          }
        } catch {
          notify.error(`Tải lên thất bại: ${item.file.name}`);
          setUploading((prev) => prev.map((u) => (u.id === item.id ? { ...u, error: 'Tải lên thất bại' } : u)));
        }
      }

      // Remove finished/errored items from the uploading list after a short delay
      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => !u.entity && !u.error));
      }, 1200);
    },
    [mode, maxSizeMB, isPublic, value, onChange, uploadFile],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFiles(Array.from(e.target.files));
        e.target.value = '';
      }
    },
    [handleFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled && e.dataTransfer.files.length) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    },
    [disabled, handleFiles],
  );

  const handleRemove = useCallback(
    async (id: number) => {
      try {
        await fileRequest.delete({ ids: [id] });
        if (mode === 'single') {
          (onChange as (v: FileEntity | undefined) => void)?.(undefined);
        } else {
          const existing = (value as FileEntity[]) ?? [];
          (onChange as (v: FileEntity[]) => void)?.(existing.filter((f) => f.id !== id));
        }
      } catch {
        notify.error('Xóa tệp thất bại');
      }
    },
    [mode, value, onChange],
  );

  const uploadedFiles: FileEntity[] =
    mode === 'single' ? (value ? [value as FileEntity] : []) : ((value as FileEntity[]) ?? []);

  const showDropZone = !disabled && (mode === 'multiple' || uploadedFiles.length === 0);
  const hasActivity = uploading.length > 0 || uploadedFiles.length > 0;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {showDropZone && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tải tệp lên"
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors',
            'hover:border-primary/60 hover:bg-primary/5',
            isDragging && 'border-primary bg-primary/10',
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="text-muted-foreground size-8" />
          <div className="text-center">
            <p className="text-sm font-medium">Nhấp để tải lên hoặc kéo thả</p>
            <p className="text-muted-foreground text-xs">
              {accept ? accept.split(',').join(', ') : 'Mọi định dạng'} — tối đa {maxSizeMB}MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            multiple={mode === 'multiple'}
            disabled={disabled}
            onChange={handleInputChange}
          />
        </div>
      )}

      {hasActivity && (
        <div className="flex flex-col gap-2">
          {/* In-progress uploads */}
          {uploading.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              {isImageFile(item.file.name) ? (
                <ImageIcon className="text-muted-foreground size-8 shrink-0" />
              ) : (
                <FileIcon className="text-muted-foreground size-8 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.file.name}</p>
                {item.error ? (
                  <p className="text-destructive text-xs">{item.error}</p>
                ) : item.entity ? (
                  <p className="text-xs text-green-600">Tải lên thành công</p>
                ) : (
                  <>
                    <Progress value={item.progress} className="mt-1 h-1.5" />
                    <p className="text-muted-foreground mt-0.5 text-xs">{item.progress}%</p>
                  </>
                )}
              </div>
              {!item.entity && !item.error && (
                <Loader2 className="text-muted-foreground size-4 shrink-0 animate-spin" />
              )}
            </div>
          ))}

          {/* Uploaded files */}
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center gap-3 rounded-lg border p-3">
              {isImageFile(file.name) ? (
                <div className="bg-muted size-10 shrink-0 overflow-hidden rounded">
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <FileIcon className="text-muted-foreground size-8 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">{formatSize(file.size)}</p>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemove(file.id)}
                  aria-label="Xóa tệp"
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { UploadInput };
