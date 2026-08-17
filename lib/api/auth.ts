import { get, post } from "./client";
import type {
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  MeResponse,
  ChangePasswordRequest,
} from "@/lib/types";

// ─── Guest APIs ───────────────────────────────────────────────────────
// Validate the login payload and client version, authenticate the account, issue access and refresh tokens, persist the correct session slot, and return the authenticated account data.
export const login = async (emailOrUsername: string, password: string): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/login", { emailOrUsername, password, clientType: "Web" }); // POST credentials with clientType='Web' — server returns JWT tokens in cookies
};

// Validate the registration payload, create the account and initial profile, issue session tokens, and return the authenticated registration result.
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  return post<LoginResponse>("/api/auth/register", data); // POST registration payload — server creates account, profile, and sets JWT cookies
};

// Dispatches HTTP GET request to '/api/auth/me' via API client.
// Returns a Promise resolving to the typed MeResponse response.
export const getMe = async (): Promise<MeResponse> => {
  return get<MeResponse>("/api/auth/me"); // GET authenticated user profile using JWT cookie from browser
};

// Dispatches HTTP POST request to '/api/auth/change-password' via API client.
// Returns a Promise resolving to the typed void response.
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await post("/api/auth/change-password", data); // POST new and current password — server validates, rotates tokens, and kicks other device
};

// Dispatches HTTP POST request to '/api/auth/logout' via API client.
// Returns a Promise resolving to the typed void response.
export const logout = async (): Promise<void> => {
  await post("/api/auth/logout"); // POST to logout — server revokes refresh token and deletes JWT cookies
};

// Dispatches HTTP POST request to '/api/auth/send-verification-code' via API client.
// Returns a Promise resolving to the typed void response.
export const sendVerificationCode = async (email: string): Promise<void> => {
  await post("/api/auth/send-verification-code", { email }); // POST email address — server generates OTP and sends it via email
};

// Dispatches HTTP POST request to '/api/auth/verify-email' via API client.
// Returns a Promise resolving to the typed void response.
export const verifyEmail = async (data: VerifyEmailRequest): Promise<void> => {
  await post("/api/auth/verify-email", data); // POST OTP code — server validates against Redis cache and marks email as verified
};

// Dispatches HTTP POST request to '/api/auth/forget-password' via API client.
// Returns a Promise resolving to the typed void response.
export const forgetPassword = async (email: string): Promise<void> => {
  await post("/api/auth/forget-password", { email }); // POST email address — server generates OTP and sends password-reset email
};

// Dispatches HTTP POST request to '/api/auth/reset-password' via API client.
// Returns a Promise resolving to the typed void response.
export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await post("/api/auth/reset-password", data); // POST email + OTP + new password — server verifies OTP and replaces password hash
};
