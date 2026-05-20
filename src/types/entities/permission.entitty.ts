import { BaseEntity } from './_base.entity';

export type PermissionEntity = BaseEntity & {
  action: string;
};
