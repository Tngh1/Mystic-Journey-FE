import { get } from "./client";
import type { PurchaseHistoryResponse } from "@/lib/types";
export type { PurchaseHistoryResponse } from "@/lib/types";


// Retrieves purchase transaction logs for the specified player profile.
export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  return get<PurchaseHistoryResponse[]>(`/api/sales/player/${playerProfileId}`); // GET /api/sales/player/{profileId}
};
