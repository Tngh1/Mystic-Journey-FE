import { get } from "./client";
import type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";
export type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// PURCHASE HISTORIES API - Lịch sử mua hàng
// ═══════════════════════════════════════════════════════════════

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<PurchaseHistoryResponse>> => {
  return get<PagedResponse<PurchaseHistoryResponse>>(
    `/api/purchasehistories?page=${page}&pageSize=${pageSize}`
  );
};

export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  return get<PurchaseHistoryResponse[]>(`/api/purchasehistories/player/${playerProfileId}`);
};
