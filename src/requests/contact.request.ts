import {
  CreateContactBody,
  DeleteContactsBody,
  DetailContactResponse,
  ListContactsQuery,
  ListContactsResponse,
  UpdateContactBody,
} from '../types/requests/contact.type';
import { api } from '../utils/api.util';

export const contactRequest = {
  list: async (params: ListContactsQuery) => {
    const { data } = await api.get<ListContactsResponse>('/contacts', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailContactResponse>(`/contacts/${id}`);
    return data;
  },

  create: async (body: CreateContactBody) => {
    const { data } = await api.post('/contacts', body);
    return data;
  },

  update: async (id: number, body: UpdateContactBody) => {
    const { data } = await api.put(`/contacts/${id}`, body);
    return data;
  },

  delete: async (body: DeleteContactsBody) => {
    const { data } = await api.delete('/contacts', { data: body });
    return data;
  },
};
