import {
  CreateVerificationCodeBody,
  DeleteVerificationCodesBody,
  DetailVerificationCodeResponse,
  ListVerificationCodesQuery,
  ListVerificationCodesResponse,
  UpdateVerificationCodeBody,
} from '../types/requests/verification-code.type';
import { api } from '../utils/api.util';

export const verificationCodeRequest = {
  list: async (params: ListVerificationCodesQuery) => {
    const { data } = await api.get<ListVerificationCodesResponse>('/verification-codes', { params });
    return data;
  },

  detail: async (id: number) => {
    const { data } = await api.get<DetailVerificationCodeResponse>(`/verification-codes/${id}`);
    return data;
  },

  create: async (body: CreateVerificationCodeBody) => {
    const { data } = await api.post('/verification-codes', body);
    return data;
  },

  update: async (id: number, body: UpdateVerificationCodeBody) => {
    const { data } = await api.put(`/verification-codes/${id}`, body);
    return data;
  },

  delete: async (body: DeleteVerificationCodesBody) => {
    const { data } = await api.delete('/verification-codes', { data: body });
    return data;
  },
};
