import { ItemDto } from "../common/item-dto.type";
import { ListQuery } from "../common/list-query.type";
import { FileEntity } from "../entities/file.entity";
import { RoleEntity } from "../entities/role.entity";
import { UserEntity } from "../entities/user.entity";

export type UserItem = UserEntity & {
  roles?: RoleEntity[] | null;
  avatar?: FileEntity;
};

export type ListUsersResponse = {
  users: UserItem[];
  total: number;
};

export type ListUsersQuery = ListQuery;

export type UserDetail = UserItem;

export type DetailUserResponse = {
  user: UserDetail;
};

export type CreateUserBody = Omit<UserEntity, "id" | "updatedAt" | "createdAt"> & {
  roles?: ItemDto[];
};

export type UpdateUserBody = Partial<UserEntity & { roles: ItemDto[] }>;

export type DeleteUsersBody = {
  ids: number[];
};

export type RestoreUsersBody = {
  ids: number[];
};
