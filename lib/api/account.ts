import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  validateStatus: (status) => status >= 200 && status < 500, // Prevent throwing on 400 errors so we can handle ApiResponse cleanly
});

export interface AccountInfo {
  accountId: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  phoneNumber?: string;
  birthday?: string;
  roleId: number;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  account?: AccountInfo;
}

export const login = async (emailOrUsername: string, password: string): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/login", { emailOrUsername, password });
  return response.data;
};

export const register = async (data: {
  fullName: string;
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber?: string;
  birthday?: string;
}): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/register", {
    fullName: data.fullName,
    userName: data.userName,
    emailAddress: data.emailAddress,
    password: data.password,
    confirmPassword: data.confirmPassword,
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    birthday: data.birthday,
  });
  return response.data;
};

export const forgotPassword = async (email: string): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data: {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/reset-password", {
    email: data.email,
    verificationCode: data.verificationCode,
    newPassword: data.newPassword,
    confirmPassword: data.confirmPassword,
  });
  return response.data;
};

export const sendVerificationCode = async (email: string): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/send-verification-code", { email });
  return response.data;
};

export const verifyEmail = async (email: string, verificationCode: string): Promise<ApiResponse> => {
  const response = await apiClient.post("/accounts/verify-email", { email, verificationCode });
  return response.data;
};

export const changePassword = async (
  accessToken: string,
  data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
): Promise<ApiResponse> => {
  const response = await apiClient.post(
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
  return response.data;
};

export const updateProfile = async (
  accessToken: string,
  data: {
    fullName: string;
    gender: string;
    phoneNumber?: string;
    birthday?: string;
  }
): Promise<ApiResponse> => {
  const response = await apiClient.put(
    "/accounts/update-profile",
    data,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};
