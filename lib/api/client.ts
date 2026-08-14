import axios, { AxiosError, AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  // Keep auth requests on the FE origin. Next rewrites /backend to the .NET
  // API, so its HttpOnly cookies are stored for the FE host and are also
  // visible to proxy.ts when it protects dashboard routes.
  baseURL: "/backend",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function processRefreshQueue() {
  refreshQueue.forEach((cb) => cb.resolve());
  refreshQueue = [];
}

function processRefreshError(err: unknown) {
  refreshQueue.forEach((cb) => cb.reject(err));
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh-token") ?? false;

    // A failed refresh must reject normally. Retrying the refresh request through its own
    // queue deadlocks session hydration and leaves the header permanently unauthenticated.
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => apiClient(originalRequest).then(resolve).catch(reject),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post("/api/auth/refresh-token");
        processRefreshQueue();
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processRefreshError(refreshErr);
        return Promise.reject(new ApiError("Session expired. Please login again."));
      } finally {
        isRefreshing = false;
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

const STATUS_TEXT_MAP: Record<number, string> = {
  400: "Invalid request. Please check your input parameters.",
  401: "Unauthorized access. Please login to continue.",
  403: "Access denied. You do not have permission to access this resource.",
  404: "The requested resource was not found.",
  405: "Method not allowed for this request.",
  408: "Request timeout. Please check your network connection and try again.",
  409: "A conflict occurred with the current state of the resource.",
  413: "Payload too large. Please upload a smaller file.",
  422: "Unprocessable entity. Please verify your data input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Internal server error. Please try again later.",
  502: "Bad gateway. Received an invalid response from upstream server.",
  503: "Service unavailable. The server is temporarily offline.",
  504: "Gateway timeout. The server took too long to respond.",
};

export function sanitizeErrorMessage(msg: string | undefined, status?: number): string {
  if (!msg || typeof msg !== "string") {
    return status && STATUS_TEXT_MAP[status] ? STATUS_TEXT_MAP[status] : "An unexpected error occurred.";
  }

  const trimmed = msg.trim();

  // If message is purely digits (e.g. "404", "401", "500")
  if (/^\d{3}$/.test(trimmed)) {
    const code = parseInt(trimmed, 10);
    return STATUS_TEXT_MAP[code] ?? "An unexpected error occurred.";
  }

  // If message matches raw status code patterns (e.g. "Request failed with status code 404")
  if (
    /request failed with status code/i.test(trimmed) ||
    /status code \d{3}/i.test(trimmed) ||
    /error \d{3}/i.test(trimmed) ||
    /^\d{3}\s+/i.test(trimmed) ||
    /^http\s+\d{3}/i.test(trimmed)
  ) {
    if (status && STATUS_TEXT_MAP[status]) {
      return STATUS_TEXT_MAP[status];
    }
    const match = trimmed.match(/\b([45]\d{2})\b/);
    if (match) {
      const code = parseInt(match[1], 10);
      if (STATUS_TEXT_MAP[code]) return STATUS_TEXT_MAP[code];
    }
    return "An unexpected server error occurred.";
  }

  return trimmed;
}

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
    const status = axiosError.response?.status;
    const body = axiosError.response?.data;

    let rawMsg: string | undefined;
    if (typeof body === "object" && body !== null && "message" in body && typeof body.message === "string") {
      rawMsg = body.message;
    } else if (typeof body === "string") {
      rawMsg = body;
    } else {
      rawMsg = axiosError.message;
    }

    const cleanMessage = sanitizeErrorMessage(rawMsg, status);
    return new ApiError(cleanMessage, body?.errorCode, status);
  }

  if (error instanceof Error) {
    const cleanMessage = sanitizeErrorMessage(error.message);
    return new ApiError(cleanMessage);
  }

  return new ApiError("An unexpected error occurred.");
}

export function handleApiError(error: unknown): never {
  throw normalizeError(error);
}

export default apiClient;
