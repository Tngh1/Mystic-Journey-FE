import { get, post, put } from "./client";
import type { AccountAdminResponse, PagedResponse } from "@/lib/types";
export type { AccountAdminResponse, PagedResponse } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// ADMIN ACCOUNTS API - Quản lý tài khoản admin
// ═══════════════════════════════════════════════════════════════

// ── Lấy tất cả accounts ──────────────────────────────────
export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<AccountAdminResponse>> => {
  return get<PagedResponse<AccountAdminResponse>>(
    `/api/adminaccounts?page=${page}&pageSize=${pageSize}`
  );
};

// ── Lấy account theo ID ───────────────────────────────────
export const getById = async (id: number): Promise<AccountAdminResponse> => {
  return get<AccountAdminResponse>(`/api/adminaccounts/${id}`);
};

// ── Tạo account mới ───────────────────────────────────────
export const create = async (data: Record<string, unknown>): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>("/api/adminaccounts", data);
};

// ── Cập nhật account ─────────────────────────────────────
export const update = async (id: number, data: Record<string, unknown>): Promise<AccountAdminResponse> => {
  return put<AccountAdminResponse>(`/api/adminaccounts/${id}`, data);
};

// ── Cấm player ────────────────────────────────────────────
export const banPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/ban`);
};

// ── Bỏ cấm player ─────────────────────────────────────────
export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/unban`);
};
