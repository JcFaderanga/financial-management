import axios from 'axios';
import supabase from '@/lib/supabase';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }

  if (data.session?.access_token) {
    config.headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (cause: unknown) => {
    if (!axios.isAxiosError<ApiErrorBody>(cause) || !cause.response) {
      throw cause;
    }

    const { error } = cause.response.data ?? {};
    throw new ApiError(
      error?.message ?? cause.message,
      cause.response.status,
      error?.code ?? 'UNKNOWN_ERROR',
    );
  },
);

export default api;
