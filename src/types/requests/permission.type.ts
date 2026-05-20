import { ListQuery } from '../common/list-query.type';
import { PermissionEntity } from '../entities/permission.entitty';

export type PermissionItem = PermissionEntity;

export type ListPermissionsResponse = {
  permissions: PermissionItem[];
  total: number;
};

export type ListPermissionsQuery = ListQuery;

export type PermissionDetail = PermissionItem;

export type DetailPermissionResponse = {
  permission: PermissionDetail;
};

export type CreatePermissionBody = Omit<PermissionEntity, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePermissionBody = Partial<PermissionEntity>;

export type DeletePermissionsBody = {
  ids: number[];
};
