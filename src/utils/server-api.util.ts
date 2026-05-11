'use server';

import axios from 'axios';

export const serverApi = async () => {
  const api = axios.create({
    baseURL: (process.env.NEXT_PROXY_URL ?? '') + '/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

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

  return api;
};
