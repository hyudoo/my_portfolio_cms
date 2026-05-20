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

export type CreateRoleBody = Omit<RoleEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateRoleBody = Partial<RoleEntity>;

export type DeleteRolesBody = {
  ids: number[];
};
