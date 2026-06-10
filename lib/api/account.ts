import { get, post, handleApiError } from "./client";
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  MeResponse,
  AccountAdminResponse,
} from "@/lib/types";

export const login = async (emailOrUsername: string, password: string): Promise<MeResponse> => {
  return post<MeResponse>("/api/accounts/login", { emailOrUsername, password });
};

export const register = async (data: RegisterRequest): Promise<MeResponse> => {
  return post<MeResponse>("/api/accounts/register", data);
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  await post("/api/accounts/send-verification-code", { email });
};

export const verifyEmail = async (email: string, verificationCode: string): Promise<void> => {
  await post("/api/accounts/verify-email", { email, verificationCode });
};

export const forgotPassword = async (email: string): Promise<void> => {
  await post("/api/accounts/forgot-password", { email });
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await post("/api/accounts/reset-password", data);
};

export const getMe = async (): Promise<MeResponse> => {
  return get<MeResponse>("/api/accounts/me");
};

export const logout = async (): Promise<void> => {
  await post("/api/accounts/logout");
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await post("/api/accounts/change-password", data);
};

export const banPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/ban`);
};

export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/unban`);
};
