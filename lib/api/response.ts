export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function successResponse<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, message };
}

export function errorResponse(code: string, message: string): ApiError {
  return { success: false, error: { code, message } };
}
