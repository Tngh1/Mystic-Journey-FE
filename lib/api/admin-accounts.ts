import { get, post } from "./client";
import type { AccountAdminResponse, PagedResponse } from "@/lib/types";
export type { AccountAdminResponse, PagedResponse } from "@/lib/types";


// Retrieves paginated list of registered user accounts with role filtering.
export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<AccountAdminResponse>> => {
  return get<PagedResponse<AccountAdminResponse>>(
    `/api/adminaccounts?page=${page}&pageSize=${pageSize}`
  ); // GET /api/adminaccounts
};

// Fetches account details, role assignments, and ban remarks by account ID.
export const getById = async (id: number): Promise<AccountAdminResponse> => {
  return get<AccountAdminResponse>(`/api/adminaccounts/${id}`); // Query user account details
};

// Bans a player account and records the reason.
export const banPlayer = async (accountId: number, banReason?: string): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/ban`, { banReason: banReason ?? null }); // POST /api/adminaccounts/{id}/ban
};

// Unbans a player account.
export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/unban`); // POST /api/adminaccounts/{id}/unban
};
