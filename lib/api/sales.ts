import { get } from "./client";
import type { PurchaseHistoryResponse } from "@/lib/types";
export type { PurchaseHistoryResponse } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// SALES API - Lịch sử bán
// BE GET /api/sales/player/{id} trả về List<PurchaseHistoryResponseDto>
// ═══════════════════════════════════════════════════════════════

export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  return get<PurchaseHistoryResponse[]>(`/api/sales/player/${playerProfileId}`);
};
