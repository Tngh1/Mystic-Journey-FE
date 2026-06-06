import apiClient, { handleApiError } from "./client";

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AccountResponse {
  accountId: number;
  userName: string;
  emailAddress: string;
  roleId: number;
  isActive: boolean;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

export const login = async (emailOrUsername: string, password: string): Promise<AccountResponse> => {
  try {
    const response = await apiClient.post<AccountResponse>("/api/accounts/login", {
      emailOrUsername,
      password,
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const register = async (data: RegisterRequest): Promise<AccountResponse> => {
  try {
    const response = await apiClient.post<AccountResponse>("/api/accounts/register", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/send-verification", { email });
  } catch (err) {
    handleApiError(err);
  }
};

export const verifyEmail = async (email: string, verificationCode: string): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/verify-email", { email, verificationCode });
  } catch (err) {
    handleApiError(err);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/forgot-password", { email });
  } catch (err) {
    handleApiError(err);
  }
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/reset-password", data);
  } catch (err) {
    handleApiError(err);
  }
};

export const refreshToken = async (refreshToken: string): Promise<AccountResponse> => {
  try {
    const response = await apiClient.post<AccountResponse>("/api/accounts/refresh-token", {
      refreshToken,
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const changePassword = async (accessToken: string, data: ChangePasswordRequest): Promise<AccountResponse> => {
  try {
    const response = await apiClient.post<AccountResponse>("/api/accounts/change-password", data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
