import { get, post } from "./client";
import type {
  ChangePasswordRequest,
  MeResponse,
  AccountAdminResponse,
} from "@/lib/types";

export const getMe = async (): Promise<MeResponse> => {
  return get<MeResponse>("/api/auth/me");
};

export const logout = async (): Promise<void> => {
  await post("/api/auth/logout");
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await post("/api/auth/change-password", data);
};

export const banPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/ban`);
};

export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/unban`);
};
