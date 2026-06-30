import { get } from "./client";
import type { SaleResponse } from "@/lib/types";
export type { SaleResponse } from "@/lib/types";

// ═══════════════════════════════════════════════════════════════
// SALES API - Lịch sử bán
// ═══════════════════════════════════════════════════════════════

export const getByPlayerId = async (playerProfileId: number): Promise<SaleResponse[]> => {
  return get<SaleResponse[]>(`/api/sales/player/${playerProfileId}`);
};
