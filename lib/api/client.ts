import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError["config"] & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/api/accounts/refresh-token");
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }

    if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
      throw new Error((error.response.data as { message: string }).message);
    }
    throw new Error(error.message || "An unexpected error occurred.");
  }
);

export default apiClient;

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred.";
    throw new Error(message);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error("An unexpected error occurred.");
}
