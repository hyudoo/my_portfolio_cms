import { BaseEntity } from './_base.entity';

export type FileEntity = BaseEntity & {
  name: string;
  s3Key: string;
  isPublic: boolean;
  url: string;
  size: number;
  capturedAt: string;
};
