import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface AccountInfo {
  accountId: number;
  userName: string;
  emailAddress: string;
  roleId: number;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

interface ApiError {
  message: string;
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const message = axiosError.response?.data?.message || axiosError.message || "An error occurred.";
    throw new Error(message);
  }
  throw new Error("An unexpected error occurred.");
}

export const login = async (emailOrUsername: string, password: string): Promise<AccountInfo> => {
  try {
    const response = await apiClient.post<AccountInfo>("/accounts/login", { emailOrUsername, password });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const register = async (data: {
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}): Promise<AccountInfo> => {
  try {
    const response = await apiClient.post<AccountInfo>("/accounts/register", {
      userName: data.userName,
      emailAddress: data.emailAddress,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/accounts/forgot-password", { email });
  } catch (err) {
    handleError(err);
  }
};

export const resetPassword = async (data: {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  try {
    await apiClient.post("/accounts/reset-password", {
      email: data.email,
      verificationCode: data.verificationCode,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  } catch (err) {
    handleError(err);
  }
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/accounts/send-verification-code", { email });
  } catch (err) {
    handleError(err);
  }
};

export const verifyEmail = async (email: string, verificationCode: string): Promise<void> => {
  try {
    await apiClient.post("/accounts/verify-email", { email, verificationCode });
  } catch (err) {
    handleError(err);
  }
};

export const changePassword = async (
  accessToken: string,
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<void> => {
  try {
    await apiClient.post(
      "/accounts/change-password",
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (err) {
    handleError(err);
  }
};

export const refreshToken = async (refreshToken: string): Promise<AccountInfo> => {
  try {
    const response = await apiClient.post<AccountInfo>("/accounts/refresh-token", { refreshToken });
    return response.data;
  } catch (err) {
    handleError(err);
  }
};
