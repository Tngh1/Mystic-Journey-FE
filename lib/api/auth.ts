import { get, post } from "./client";
import type {
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
} from "@/lib/types";

export const login = async (emailOrUsername: string, password: string): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/login", { emailOrUsername, password });
};

export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/register", data);
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  await post("/api/auth/send-verification-code", { email });
};

export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  await post("/api/auth/verify-email", data);
};

export const forgotPassword = async (email: string): Promise<void> => {
  await post("/api/auth/forgot-password", { email });
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await post("/api/auth/reset-password", data);
};

export const refreshToken = async (): Promise<void> => {
  await post("/api/auth/refresh-token");
};
