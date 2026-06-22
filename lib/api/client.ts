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
        await apiClient.post("/api/auth/refresh-token");
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(new ApiError("Session expired. Please log in again."));
      }
    }

    throw normalizeError(error);
  }
);

/* ─── ApiResponse envelope (BE unified format) ─────────────────────────── */

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  errorCode: string;
  data: T | null;
}

/** Unwrap BE ApiResponse<T> envelope. If body is not an envelope, return as-is. */
function unwrap<T>(body: unknown): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    const env = body as ApiEnvelope<T>;
    if (env.data !== null && env.data !== undefined) return env.data;
  }
  return body as T;
}

/* ─── Typed helper functions ─────────────────────────────────────────────── */

export async function get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiEnvelope<T> | T>(path, { params });
  return unwrap<T>(response.data);
}

export async function post<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<ApiEnvelope<T> | T>(path, data);
  return unwrap<T>(response.data);
}

export async function put<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<ApiEnvelope<T> | T>(path, data);
  return unwrap<T>(response.data);
}

export async function del<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.delete<ApiEnvelope<T> | T>(path, { params });
  return unwrap<T>(response.data);
}

/* ─── Error helpers ──────────────────────────────────────────────────────── */

export class ApiError extends Error {
  code?: string;
  status?: number;
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiEnvelope<unknown>>;
    const body = axiosError.response?.data;
    return new ApiError(
      body?.message || axiosError.message || "An error occurred.",
      body?.errorCode,
      axiosError.response?.status
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
