import { get } from "./client";
import type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";
export type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";


// Retrieves paginated list of all shop purchases and microtransactions for admin audit.
export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<PurchaseHistoryResponse>> => {
  return get<PagedResponse<PurchaseHistoryResponse>>(
    `/api/purchasehistories?page=${page}&pageSize=${pageSize}`
  ); // GET /api/purchasehistories
};

// Retrieves individual purchase ledger for a player profile.
export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  return get<PurchaseHistoryResponse[]>(`/api/purchasehistories/player/${playerProfileId}`); // GET /api/purchasehistories/player/{profileId}
};
