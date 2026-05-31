import { signIn, signOut } from 'next-auth/react';
import {
  ForgotPasswordBody,
  LoginBody,
  RegisterBody,
  ResendVerifyEmailBody,
  ResetPasswordBody,
  UpdateInfoBody,
  UpdatePasswordBody,
  VerifyEmailBody,
} from '../types/requests/auth.type';
import { api } from '../utils/api.util';

export const authRequest = {
  login: async (body: LoginBody) => {
    return signIn('credentials', { email: body.email, password: body.password, redirect: false });
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

  updateInfo: async (body: UpdateInfoBody) => {
    const { data } = await api.put('/auth/update-info', body);
    return data;
  },

  updatePassword: async (body: UpdatePasswordBody) => {
    const { data } = await api.put('/auth/update-password', body);
    return data;
  },

  forgotPassword: async (body: ForgotPasswordBody) => {
    const { data } = await api.post('/auth/forgot-password', body, { silent: true });
    return data;
  },

  resetPassword: async (body: ResetPasswordBody) => {
    const { data } = await api.put('/auth/reset-password', body);
    return data;
  },

  logout: async () => {
    return signOut({ redirect: false });
  },
};
