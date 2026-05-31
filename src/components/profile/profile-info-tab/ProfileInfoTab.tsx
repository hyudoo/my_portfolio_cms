'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { useAuth } from '@/components/providers/auth-provider/AuthProvider';
import { authRequest } from '@/requests/auth.request';
import { fileRequest } from '@/requests/file.request';
import { FileEntity } from '@/types/entities/file.entity';
import { UpdateInfoBody } from '@/types/requests/auth.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileInfoSchema = z.object({
  username: z.string().min(1),
});

type ProfileInfoValues = z.infer<typeof profileInfoSchema>;

export function ProfileInfoTab() {
  const t = useTranslations();
  const [auth, setAuth] = useAuth();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<FileEntity | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileInfoValues>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      username: auth?.username ?? '',
    },
  });

  const avatarSrc = useMemo(() => pendingAvatar?.url ?? auth?.avatar?.url, [pendingAvatar, auth]);
  console.log('avatarSrc', avatarSrc);
  const handleAvatarClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { presignedUrl, s3Key } = await fileRequest.getPresignedUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
        isPublic: true,
      });

      const uploadRes = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

      const { file: savedFile } = await fileRequest.saveMetadata({
        name: file.name,
        s3Key,
        size: file.size,
        isPublic: true,
      });

      setPendingAvatar(savedFile);
      notify.success(t('profile.messages.avatar_uploaded'));
    } catch {
      notify.error(t('profile.messages.avatar_upload_failed'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onSubmit = async (values: ProfileInfoValues) => {
    setSaving(true);
    try {
      const body: UpdateInfoBody = {
        name: values.username,
        username: values.username,
        ...(pendingAvatar ? { avatarId: pendingAvatar.id } : {}),
      };
      await authRequest.updateInfo(body);
      if (auth) {
        setAuth({
          ...auth,
          username: values.username,
          ...(pendingAvatar ? { avatar: pendingAvatar, avatarId: pendingAvatar.id } : {}),
        });
      }
      setPendingAvatar(null);
      notify.success(t('profile.messages.info_updated'));
    } finally {
      setSaving(false);
    }
  };

  const initials = auth?.username ? auth.username.slice(0, 2).toUpperCase() : 'AD';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('profile.tabs.info')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage key={avatarSrc} src={avatarSrc} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              title={t('profile.info.change_avatar')}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
          <div>
            <p className="font-semibold text-lg">{auth?.username ?? '—'}</p>
            <p className="text-sm text-muted-foreground">{auth?.email ?? '—'}</p>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? t('profile.messages.avatar_uploading') : t('profile.info.change_avatar')}
            </button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.info.username')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('profile.info.username_placeholder')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>{t('profile.info.email')}</FormLabel>
              <Input value={auth?.email ?? ''} disabled />
            </FormItem>

            <Button type="submit" disabled={saving || uploading}>
              {saving ? t('common.saving') : t('common.save')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
