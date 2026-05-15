export type ApiMeta = Record<string, unknown>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  meta?: ApiMeta;
}

export const apiSuccess = <T>(
  data: T,
  message = 'OK',
  meta?: ApiMeta,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const apiCreated = <T>(
  data: T,
  message = 'Created',
  meta?: ApiMeta,
): ApiResponse<T> => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {}),
});

export const apiError = (
  message = 'Error',
  error?: unknown,
  meta?: ApiMeta,
): ApiErrorResponse => ({
  success: false,
  message,
  ...(error
    ? { error: error instanceof Error ? error.message : String(error) }
    : {}),
  ...(meta ? { meta } : {}),
});
