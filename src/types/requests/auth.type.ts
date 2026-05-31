import { UserEntity } from '../entities/user.entity';

export type AuthUser = UserEntity;

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  email: string;
  name: string;
  username: string;
  password: string;
};

export type VerifyEmailBody = {
  token: string;
};

export type ResendVerifyEmailBody = {
  email: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type UpdateInfoBody = Omit<RegisterBody, 'email' | 'password'> & {
  avatarId?: number;
};

export type UpdatePasswordBody = {
  password: string;
  newPassword: string;
};

export type ForgotPasswordBody = {
  email: string;
  locale: string;
};

export type ResetPasswordBody = {
  token: string;
  password: string;
};
