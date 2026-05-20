import {
  CreateProjectCategoryBody,
  DeleteProjectCategoriesBody,
  DetailProjectCategoryResponse,
  ListProjectCategoriesQuery,
  ListProjectCategoriesResponse,
  UpdateProjectCategoryBody,
} from '../types/requests/project-category.type';
import { api } from '../utils/api.util';

export const projectCategoryRequest = {
  list: async (params: ListProjectCategoriesQuery) => {
    const { data } = await api.get<ListProjectCategoriesResponse>('/project-categories', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailProjectCategoryResponse>(`/project-categories/${id}`);
    return data;
  },

  create: async (body: CreateProjectCategoryBody) => {
    const { data } = await api.post('/project-categories', body);
    return data;
  },

  update: async (id: number, body: UpdateProjectCategoryBody) => {
    const { data } = await api.put(`/project-categories/${id}`, body);
    return data;
  },

  delete: async (body: DeleteProjectCategoriesBody) => {
    const { data } = await api.delete('/project-categories', { data: body });
    return data;
  },
};
