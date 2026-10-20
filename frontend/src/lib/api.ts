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

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  const normalizedPath = path.replace(/^\//, '');
  const response = await fetch(`${apiUrl}/${normalizedPath}`, {
    ...options,
    headers,
  });
  const responseText = await response.text();
  let body: unknown;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new ApiError('Server returned an invalid response', response.status, 'INVALID_RESPONSE');
      }
    }
  } else if (response.ok) {
    throw new ApiError('Server returned an empty response', response.status, 'INVALID_RESPONSE');
  }

  if (!response.ok) {
    const errorBody = body && typeof body === 'object' ? (body as ApiErrorBody) : undefined;
    throw new ApiError(
      errorBody?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorBody?.error?.code ?? 'UNKNOWN_ERROR',
    );
  }

  return body as T;
};
