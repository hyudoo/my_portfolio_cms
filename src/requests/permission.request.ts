import {
  CreatePermissionBody,
  DeletePermissionsBody,
  DetailPermissionResponse,
  ListPermissionsQuery,
  ListPermissionsResponse,
  UpdatePermissionBody,
} from '../types/requests/permission.type';
import { api } from '../utils/api.util';

export const permissionRequest = {
  list: async (params: ListPermissionsQuery) => {
    const { data } = await api.get<ListPermissionsResponse>('/permissions', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailPermissionResponse>(`/permissions/${id}`);
    return data;
  },

  create: async (body: CreatePermissionBody) => {
    const { data } = await api.post('/permissions', body);
    return data;
  },

  update: async (id: number, body: UpdatePermissionBody) => {
    const { data } = await api.put(`/permissions/${id}`, body);
    return data;
  },

  delete: async (body: DeletePermissionsBody) => {
    const { data } = await api.delete('/permissions', { data: body });
    return data;
  },
};
