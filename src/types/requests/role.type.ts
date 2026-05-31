import { ListQuery } from '../common/list-query.type';
import { PermissionEntity } from '../entities/permission.entitty';
import { RoleEntity } from '../entities/role.entity';

export type RoleItem = RoleEntity & {
  permissions?: PermissionEntity[];
};

export type ListRolesResponse = {
  roles: RoleItem[];
  total: number;
};

export type ListRolesQuery = ListQuery;

export type RoleDetail = RoleItem;

export type DetailRoleResponse = {
  role: RoleDetail;
};

export type CreateRoleBody = {
  name: string;
  isDefault?: boolean;
  permissions?: { id: number }[];
};

export type UpdateRoleBody = {
  name?: string;
  isDefault?: boolean;
  permissions?: { id: number }[];
};

export type DeleteRolesBody = {
  ids: number[];
};
