import axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { apiNotify } from '../components/layouts/app-layout/notify-provider/api-notify/apiNotify';

let _accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  _accessToken = token;
};

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
      const code = error.response?.data?.code ?? '999999';

      if (!error.config?.silent) {
        apiNotify.error(`api_error.${code}`);
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

api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});
