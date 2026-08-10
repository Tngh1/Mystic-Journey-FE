import { get, post } from "./client";
import type { AccountAdminResponse, PagedResponse } from "@/lib/types";
export type { AccountAdminResponse, PagedResponse } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// ADMIN ACCOUNTS API - Quản lý tài khoản Player
// ═══════════════════════════════════════════════════════════════
// Không có create/update: BE đã bỏ POST/PUT /api/adminaccounts cùng với role
// SuperAdmin, nên tài khoản Admin chỉ cấp trực tiếp trong DB. Để lại wrapper ở
// đây thì lần sau có người gọi và nhận 404 mà không hiểu vì sao.

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

// ── Cấm player ────────────────────────────────────────────
export const banPlayer = async (accountId: number, banReason?: string): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/ban`, { banReason: banReason ?? null });
};

// ── Bỏ cấm player ─────────────────────────────────────────
export const unbanPlayer = async (accountId: number): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>(`/api/adminaccounts/${accountId}/unban`);
};
