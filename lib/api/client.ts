import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/api/accounts/refresh-token");
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(new ApiError("Session expired. Please log in again."));
      }
    }

    throw normalizeError(error);
  }
);

/* ─── Typed helper functions ─────────────────────────────────────────────── */

export async function get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<T>(path, { params });
  return response.data;
}

export async function post<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(path, data);
  return response.data;
}

export async function put<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<T>(path, data);
  return response.data;
}

export async function del<T = unknown>(path: string): Promise<T> {
  const response = await apiClient.delete<T>(path);
  return response.data;
}

/* ─── Error helpers ──────────────────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return new ApiError(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "An error occurred."
    );
  }
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  return new ApiError("An unexpected error occurred.");
}

export function handleApiError(error: unknown): never {
  throw normalizeError(error);
}

export default apiClient;
