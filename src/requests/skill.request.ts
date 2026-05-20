import {
  CreateSkillBody,
  DeleteSkillsBody,
  DetailSkillResponse,
  ListSkillsQuery,
  ListSkillsResponse,
  UpdateSkillBody,
} from '../types/requests/skill.type';
import { api } from '../utils/api.util';

export const skillRequest = {
  list: async (params: ListSkillsQuery) => {
    const { data } = await api.get<ListSkillsResponse>('/skills', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailSkillResponse>(`/skills/${id}`);
    return data;
  },

  create: async (body: CreateSkillBody) => {
    const { data } = await api.post('/skills', body);
    return data;
  },

  update: async (id: number, body: UpdateSkillBody) => {
    const { data } = await api.put(`/skills/${id}`, body);
    return data;
  },

  delete: async (body: DeleteSkillsBody) => {
    const { data } = await api.delete('/skills', { data: body });
    return data;
  },
};
