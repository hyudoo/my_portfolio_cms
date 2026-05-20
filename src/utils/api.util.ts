import axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { getSession } from 'next-auth/react';
import { apiNotify } from '../components/providers/notify-provider/api-notify/apiNotify';

declare module 'axios' {
  interface AxiosRequestConfig {
    silent?: boolean;
  }
}

export const createApiInstance = (config: CreateAxiosDefaults) => {
  const api = axios.create(config);

  api.interceptors.request.use(
    (config) => {
      for (const key in config.params) {
        if (config.params[key] === undefined) {
          delete config.params[key];
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<any, any>) => {
      const data = error.response?.data;

      if (!error.config?.silent) {
        apiNotify.error(`api_error.${data.code}`);
      }
      console.error(error);

      return Promise.reject(error);
    },
  );

  return api;
};

export const api = createApiInstance({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? '') + '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});
