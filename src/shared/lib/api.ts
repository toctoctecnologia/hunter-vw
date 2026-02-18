import axios, { AxiosError } from 'axios';

import { createClient } from './supabase/client';

export interface AppError {
  title: string;
  messages: string[];
  code?: string;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = createClient();
  const token = (await session.auth.getSession()).data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const data = error.response?.data;
    const path = error.response?.config.url;
    const message = data?.messagePtBr || data?.message || 'Ocorreu um erro inesperado.';
    const messages = [`${message} - Codigo: ${data?.code || 'N/A'}`, `${path} | Status: ${error.response?.status}`];

    if (data.details) {
      messages.push(`Detalhes: ${data.details}`);
    }

    const appError: AppError = {
      title: 'Erro na requisição',
      messages,
      code: data?.code,
    };

    return Promise.reject(appError);
  },
);
