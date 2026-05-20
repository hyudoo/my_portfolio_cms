import {
  CreateNotificationBody,
  DeleteNotificationsBody,
  DetailNotificationResponse,
  ListNotificationsQuery,
  ListNotificationsResponse,
  UpdateNotificationBody,
} from '../types/requests/notification.type';
import { api } from '../utils/api.util';

export const notificationRequest = {
  list: async (params: ListNotificationsQuery) => {
    const { data } = await api.get<ListNotificationsResponse>('/notifications', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailNotificationResponse>(`/notifications/${id}`);
    return data;
  },

  create: async (body: CreateNotificationBody) => {
    const { data } = await api.post('/notifications', body);
    return data;
  },

  update: async (id: number, body: UpdateNotificationBody) => {
    const { data } = await api.put(`/notifications/${id}`, body);
    return data;
  },

  delete: async (body: DeleteNotificationsBody) => {
    const { data } = await api.delete('/notifications', { data: body });
    return data;
  },
};
