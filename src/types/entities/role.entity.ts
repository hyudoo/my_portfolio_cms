import { BaseEntity } from "./_base.entity";

export type RoleEntity = BaseEntity & {
  name: string;
  isDefault: boolean;
};
