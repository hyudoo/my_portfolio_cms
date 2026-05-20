import {
  CreateSkillCategoryBody,
  DeleteSkillCategoriesBody,
  DetailSkillCategoryResponse,
  ListSkillCategoriesQuery,
  ListSkillCategoriesResponse,
  UpdateSkillCategoryBody,
} from '../types/requests/skill-category.type';
import { api } from '../utils/api.util';

export const skillCategoryRequest = {
  list: async (params: ListSkillCategoriesQuery) => {
    const { data } = await api.get<ListSkillCategoriesResponse>('/skill-categories', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailSkillCategoryResponse>(`/skill-categories/${id}`);
    return data;
  },

  create: async (body: CreateSkillCategoryBody) => {
    const { data } = await api.post('/skill-categories', body);
    return data;
  },

  update: async (id: number, body: UpdateSkillCategoryBody) => {
    const { data } = await api.put(`/skill-categories/${id}`, body);
    return data;
  },

  delete: async (body: DeleteSkillCategoriesBody) => {
    const { data } = await api.delete('/skill-categories', { data: body });
    return data;
  },
};
