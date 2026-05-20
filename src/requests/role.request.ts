import {
  CreateRoleBody,
  DeleteRolesBody,
  DetailRoleResponse,
  ListRolesQuery,
  ListRolesResponse,
  UpdateRoleBody,
} from '../types/requests/role.type';
import { api } from '../utils/api.util';

export const roleRequest = {
  list: async (params: ListRolesQuery) => {
    const { data } = await api.get<ListRolesResponse>('/roles', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailRoleResponse>(`/roles/${id}`);
    return data;
  },

  create: async (body: CreateRoleBody) => {
    const { data } = await api.post('/roles', body);
    return data;
  },

  update: async (id: number, body: UpdateRoleBody) => {
    const { data } = await api.put(`/roles/${id}`, body);
    return data;
  },

  delete: async (body: DeleteRolesBody) => {
    const { data } = await api.delete('/roles', { data: body });
    return data;
  },
};
