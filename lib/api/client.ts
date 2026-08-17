import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Helper function executing api client.
const apiClient = axios.create({
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

// Resume every request waiting for the shared token refresh, then clear the queue so each request retries exactly once.
function processRefreshQueue() {
  refreshQueue.forEach((cb) => cb.resolve());
  refreshQueue = [];
}

// Reject every request waiting for a failed token refresh, then clear the queue to prevent stale retry callbacks.
function processRefreshError(err: unknown) {
  refreshQueue.forEach((cb) => cb.reject(err));
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful HTTP responses unchanged
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh-token") ?? false; // Check if the failed request was the refresh token call itself

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      if (isRefreshing) {
        // Another request is already refreshing tokens — queue this request until refresh completes
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: () => apiClient(originalRequest).then(resolve).catch(reject),
            reject,
          });
        });
      }

      originalRequest._retry = true; // Mark request so it is never retried more than once
      isRefreshing = true; // Acquire refresh mutex flag

      try {
        await apiClient.post("/api/auth/refresh-token"); // Exchange refresh token cookie for new access token
        processRefreshQueue(); // Flush pending request queue now that new token cookies are active
        return apiClient(originalRequest); // Re-execute original request with fresh credentials
      } catch (refreshErr) {
        processRefreshError(refreshErr); // Reject all queued callers with session expiry error
        return Promise.reject(new ApiError("Session expired. Please login again."));
      } finally {
        isRefreshing = false; // Release refresh lock
      }
    }

    throw normalizeError(error); // Wrap non-401 or fatal errors into normalized ApiError
  }
);


interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  errorCode: string;
  data: T | null;
}

// Return the data field from a successful API envelope, or return the original body when the response is not wrapped.
function unwrap<T>(body: unknown): T {
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    const env = body as ApiEnvelope<T>;
    if (env.data !== null && env.data !== undefined) return env.data; // Extract unwrapped data payload
  }
  return body as T; // Fallback to raw body if not standard envelope
}


// Send a GET request with optional query parameters, unwrap the API envelope, and return the typed response payload.
export async function get<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiEnvelope<T> | T>(path, { params }); // Execute HTTP GET with query params
  return unwrap<T>(response.data); // Unwrap data field from response envelope
}

// Send a POST request with the supplied payload, unwrap the API envelope, and return the typed response payload.
export async function post<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<ApiEnvelope<T> | T>(path, data); // Execute HTTP POST with JSON body
  return unwrap<T>(response.data); // Unwrap data field from response envelope
}

// Send a PUT request with the supplied payload, unwrap the API envelope, and return the typed response payload.
export async function put<T = unknown>(path: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<ApiEnvelope<T> | T>(path, data); // Execute HTTP PUT with JSON body
  return unwrap<T>(response.data); // Unwrap data field from response envelope
}

// Send a DELETE request with optional query parameters, unwrap the API envelope, and return the typed response payload.
export async function del<T = unknown>(path: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.delete<ApiEnvelope<T> | T>(path, { params }); // Execute HTTP DELETE with query params
  return unwrap<T>(response.data); // Unwrap data field from response envelope
}


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

// Reject empty or raw HTTP status messages, map known status codes to safe user-facing text, and preserve valid backend messages.
export function sanitizeErrorMessage(msg: string | undefined, status?: number): string {
  if (!msg || typeof msg !== "string") {
    return status && STATUS_TEXT_MAP[status] ? STATUS_TEXT_MAP[status] : "An unexpected error occurred.";
  }

  const trimmed = msg.trim();

  if (/^\d{3}$/.test(trimmed)) {
    const code = parseInt(trimmed, 10);
    return STATUS_TEXT_MAP[code] ?? "An unexpected error occurred.";
  }

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
    // Helper function executing match.
    // Processes input parameters and returns the calculated result.
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
  // Initialize this instance from message, code, and status and store name, code, and status for later operations.
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// Convert Axios, native Error, and unknown failures into ApiError while preserving the sanitized message, backend code, and HTTP status.
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

// Normalize the supplied failure into ApiError and throw it so callers receive one consistent error shape.
export function handleApiError(error: unknown): never {
  throw normalizeError(error);
}

export default apiClient;
