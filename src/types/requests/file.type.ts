import { FileEntity } from '../entities/file.entity';

export type FileResponse = FileEntity;

export type GetPresignedUrlBody = {
  filename: string;
  contentType: string;
  size: number;
  isPublic: boolean;
};

export type GetPresignedUrlResponse = {
  presignedUrl: string;
  s3Key: string;
};

export type SaveFileMetadataBody = {
  name: string;
  s3Key: string;
  size: number;
  isPublic: boolean;
};

export type SaveFileMetadataResponse = {
  file: FileEntity;
};

export type DeleteFilesBody = {
  ids: number[];
};
