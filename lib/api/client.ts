import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosError["config"] & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(`${API_BASE_URL}/accounts/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
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
    const message = axiosError.response?.data?.message || axiosError.message || "An error occurred.";
    throw new Error(message);
  }
  throw new Error("An unexpected error occurred.");
}
