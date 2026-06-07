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

export interface MeResponse {
  accountId: number;
  userName: string;
  email: string;
  role: string;
  lastMapName: string;
  positionX: number;
  positionY: number;
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

export interface AccountAdminResponse {
  accountId: number;
  userName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  playerProfileId: number | null;
  playerDisplayName: number | null;
}

export const login = async (emailOrUsername: string, password: string): Promise<MeResponse> => {
  try {
    const response = await apiClient.post<MeResponse>("/api/accounts/login", {
      emailOrUsername,
      password,
    });
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const register = async (data: RegisterRequest): Promise<MeResponse> => {
  try {
    const response = await apiClient.post<MeResponse>("/api/accounts/register", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/send-verification-code", { email });
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

export const getMe = async (): Promise<MeResponse> => {
  try {
    const response = await apiClient.get<MeResponse>("/api/accounts/me");
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/logout");
  } catch (err) {
    handleApiError(err);
  }
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  try {
    await apiClient.post("/api/accounts/change-password", data);
  } catch (err) {
    handleApiError(err);
  }
};

export const banPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  try {
    const response = await apiClient.post<AccountAdminResponse>(`/api/admin-accounts/${accountId}/ban`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  try {
    const response = await apiClient.post<AccountAdminResponse>(`/api/admin-accounts/${accountId}/unban`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
