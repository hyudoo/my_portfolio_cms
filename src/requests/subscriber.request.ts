import {
  CreateSubscriberBody,
  DeleteSubscribersBody,
  DetailSubscriberResponse,
  ListSubscribersQuery,
  ListSubscribersResponse,
  UpdateSubscriberBody,
} from '../types/requests/subscriber.type';
import { api } from '../utils/api.util';

export const subscriberRequest = {
  list: async (params: ListSubscribersQuery) => {
    const { data } = await api.get<ListSubscribersResponse>('/subscribers', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailSubscriberResponse>(`/subscribers/${id}`);
    return data;
  },

  create: async (body: CreateSubscriberBody) => {
    const { data } = await api.post('/subscribers', body);
    return data;
  },

  update: async (id: number, body: UpdateSubscriberBody) => {
    const { data } = await api.put(`/subscribers/${id}`, body);
    return data;
  },

  delete: async (body: DeleteSubscribersBody) => {
    const { data } = await api.delete('/subscribers', { data: body });
    return data;
  },
};
