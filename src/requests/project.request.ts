import {
  CreateProjectBody,
  DeleteProjectsBody,
  DetailProjectResponse,
  ListProjectsQuery,
  ListProjectsResponse,
  UpdateProjectBody,
} from '../types/requests/project.type';
import { api } from '../utils/api.util';

export const projectRequest = {
  list: async (params: ListProjectsQuery) => {
    const { data } = await api.get<ListProjectsResponse>('/projects', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailProjectResponse>(`/projects/${id}`);
    return data;
  },

  create: async (body: CreateProjectBody) => {
    const { data } = await api.post('/projects', body);
    return data;
  },

  update: async (id: number, body: UpdateProjectBody) => {
    const { data } = await api.put(`/projects/${id}`, body);
    return data;
  },

  delete: async (body: DeleteProjectsBody) => {
    const { data } = await api.delete('/projects', { data: body });
    return data;
  },
};
