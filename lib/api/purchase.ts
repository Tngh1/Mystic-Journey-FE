import { get } from "./client";
import type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";
export type { PurchaseHistoryResponse, PagedResponse } from "@/lib/types";

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<PurchaseHistoryResponse>> => {
  return get<PagedResponse<PurchaseHistoryResponse>>(
    `/api/PurchaseHistories?page=${page}&pageSize=${pageSize}`
  );
};

export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  return get<PurchaseHistoryResponse[]>(`/api/PurchaseHistories/player/${playerProfileId}`);
};
