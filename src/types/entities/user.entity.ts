import { BaseEntity } from './_base.entity';
import { FileEntity } from './file.entity';

export type UserEntity = BaseEntity & {
  username: string;
  email: string;
  isActive: boolean;
  deletedAt?: string | null;
  avatarId?: number | null;
  avatar?: FileEntity | null;
};
