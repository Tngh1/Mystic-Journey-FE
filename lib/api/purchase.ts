import apiClient, { handleApiError } from "./client";

export interface PurchaseHistoryResponse {
  id: number;
  playerProfileId: number;
  playerName: string | null;
  shopItemId: number;
  itemName: string | null;
  quantity: number;
  totalPrice: number;
  currency: string;
  purchasedAt: string;
}

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: PurchaseHistoryResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: PurchaseHistoryResponse[] }>(
      `/api/purchase-histories?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getByPlayerId = async (playerProfileId: number): Promise<PurchaseHistoryResponse[]> => {
  try {
    const response = await apiClient.get<PurchaseHistoryResponse[]>(
      `/api/purchase-histories/player/${playerProfileId}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
