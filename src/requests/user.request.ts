import {
  CreateUserBody,
  DeleteUsersBody,
  DetailUserResponse,
  ListUsersQuery,
  ListUsersResponse,
  RestoreUsersBody,
  UpdateUserBody,
} from "../types/requests/user.type";
import { api } from "../utils/api.util";

export const userRequest = {
  list: async (params: ListUsersQuery) => {
    const { data } = await api.get<ListUsersResponse>("/users", { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailUserResponse>(`/users/${id}`);
    return data;
  },

  create: async (body: CreateUserBody) => {
    const { data } = await api.post("/users", body);
    return data;
  },

  update: async (id: number, body: UpdateUserBody) => {
    const { data } = await api.put(`/users/${id}`, body);
    return data;
  },

  softDelete: async (body: DeleteUsersBody) => {
    const { data } = await api.delete(`/users`, { data: body });
    return data;
  },

  restore: async (body: RestoreUsersBody) => {
    const { data } = await api.patch(`/users/restore`, body);
    return data;
  },
};
