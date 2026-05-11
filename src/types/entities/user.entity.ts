import { BaseEntity } from "./_base.entity";

export type UserEntity = BaseEntity & {
  email: string;
  username: string;
  isActive: boolean;
  deletedAt?: string | null;
};
