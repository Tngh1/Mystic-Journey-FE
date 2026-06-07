import apiClient, { handleApiError } from "./client";

export interface ShopItemResponse {
  id: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  itemType: string | null;
  currency: string;
  price: number;
  stock: number;
  dailyPurchaseLimit: number;
  isActive: boolean;
  availableFrom: string | null;
  availableTo: string | null;
}

export interface CreateShopItemRequest {
  itemId: number;
  currency?: string;
  price?: number;
  stock?: number;
  dailyPurchaseLimit?: number;
  isActive?: boolean;
  availableFrom?: string;
  availableTo?: string;
}

export type UpdateShopItemRequest = Partial<CreateShopItemRequest>;

export const getById = async (id: number): Promise<ShopItemResponse> => {
  try {
    const response = await apiClient.get<ShopItemResponse>(`/api/shop-items/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: ShopItemResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: ShopItemResponse[] }>(
      `/api/shop-items?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateShopItemRequest): Promise<ShopItemResponse> => {
  try {
    const response = await apiClient.post<ShopItemResponse>("/api/shop-items", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateShopItemRequest): Promise<ShopItemResponse> => {
  try {
    const response = await apiClient.put<ShopItemResponse>(`/api/shop-items/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/shop-items/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
