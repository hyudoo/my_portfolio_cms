import { UserEntity } from "../entities/user.entity";

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
  email: string;
  code: string;
};

export type ResendVerifyEmailBody = {
  email: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type UpdateInfoBody = Omit<RegisterBody, "email" | "password">;

export type UpdatePasswordBody = {
  oldPassword: string;
  password: string;
};
