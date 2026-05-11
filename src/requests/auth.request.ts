import {
  AuthUser,
  LoginBody,
  LoginResponse,
  RegisterBody,
  ResendVerifyEmailBody,
  UpdateInfoBody,
  UpdatePasswordBody,
  VerifyEmailBody,
} from '../types/requests/auth.type';
import { api } from '../utils/api.util';
import { serverApi } from '../utils/server-api.util';

export const authRequest = {
  login: async (body: LoginBody) => {
    const { data } = await api.post<LoginResponse>('/auth/login', body);
    return data;
  },

  register: async (body: RegisterBody) => {
    const { data } = await api.post('/auth/register', body);
    return data;
  },

  verifyEmail: async (body: VerifyEmailBody) => {
    const { data } = await api.post('/auth/verify-email', body);
    return data;
  },

  resendVerifyEmail: async (body: ResendVerifyEmailBody) => {
    const { data } = await api.post('/auth/resend-verify-email', body);
    return data;
  },

  me: async () => {
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },

  serverMe: async () => {
    const { data } = await (await serverApi()).get<AuthUser>(`/auth/me`);
    return data;
  },

  updateInfo: async (body: UpdateInfoBody) => {
    const { data } = await api.put('/auth/update-info', body);
    return data;
  },

  updatePassword: async (body: UpdatePasswordBody) => {
    const { data } = await api.put('/auth/update-password', body);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout');
    return data;
  },
};
