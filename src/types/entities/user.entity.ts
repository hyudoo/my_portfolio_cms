import { BaseEntity } from './_base.entity';

export type UserEntity = BaseEntity & {
  username: string;
  email: string;
  isActive: boolean;
  deletedAt?: string | null;
};
