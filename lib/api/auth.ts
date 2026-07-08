import { get, post } from "./client";
import type {
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  MeResponse,
  ChangePasswordRequest,
} from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// AUTH API - Xác thực
// ═══════════════════════════════════════════════════════════════

// ── Đăng nhập ──────────────────────────────────────────────
export const login = async (emailOrUsername: string, password: string): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/login", { emailOrUsername, password });
};

// ── Đăng ký ───────────────────────────────────────────────
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/register", data);
};

// ── Lấy thông tin người dùng hiện tại ────────────────────
export const getMe = async (): Promise<MeResponse> => {
  return get<MeResponse>("/api/auth/me");
};

// ── Đổi mật khẩu ──────────────────────────────────────────
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await post("/api/auth/change-password", data);
};

// ── Đăng xuất ─────────────────────────────────────────────
export const logout = async (): Promise<void> => {
  await post("/api/auth/logout");
};

// ── Gửi mã xác thực ──────────────────────────────────────
export const sendVerificationCode = async (email: string): Promise<void> => {
  await post("/api/auth/send-verification-code", { email });
};

// ── Xác thực email ────────────────────────────────────────
export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  await post("/api/auth/verify-email", data);
};

// ── Quên mật khẩu ─────────────────────────────────────────
export const forgotPassword = async (email: string): Promise<void> => {
  await post("/api/auth/forgot-password", { email });
};

// ── Đặt lại mật khẩu ─────────────────────────────────────
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await post("/api/auth/reset-password", data);
};
