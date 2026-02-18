import axios, { AxiosError } from 'axios';

import { createClient } from './supabase/client';

export interface AppError {
  title: string;
  messages: string[];
  code?: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise: Promise<string | null> | null = null;

async function getAccessToken() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        await supabase.auth.signOut();
        return null;
      }

      return data.session?.access_token ?? null;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<unknown>) => {
    const isUnauthorized = error.response?.status === 401;
    const requestConfig = error.config;

    if (isUnauthorized && requestConfig && !requestConfig.headers?.['x-retry-with-refresh']) {
      const refreshedToken = await refreshAccessToken();

      if (refreshedToken) {
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${refreshedToken}`,
          'x-retry-with-refresh': '1',
        };

        return api(requestConfig);
      }
    }

    const data = (error.response?.data ?? null) as {
      messagePtBr?: string;
      message?: string;
      code?: string;
      details?: string;
    } | null;
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
