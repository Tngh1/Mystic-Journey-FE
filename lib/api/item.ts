import apiClient, { handleApiError } from "./client";

export interface ItemResponse {
  id: number;
  name: string;
  description: string | null;
  type: string;
  rarity: string;
  slot: string;
  baseValue: number;
  maxStack: number;
  isTradable: boolean;
  isActive: boolean;
  iconUrl: string | null;
  createdAt?: string;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  bonusCritRate?: number;
  bonusCritDamage?: number;
}

export interface CreateItemRequest {
  name: string;
  description?: string;
  type?: string;
  rarity?: string;
  slot?: string;
  baseValue?: number;
  maxStack?: number;
  isTradable?: boolean;
  isActive?: boolean;
  iconUrl?: string;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  bonusCritRate?: number;
  bonusCritDamage?: number;
}

export type UpdateItemRequest = Partial<CreateItemRequest>;

export const getById = async (id: number): Promise<ItemResponse> => {
  try {
    const response = await apiClient.get<ItemResponse>(`/api/items/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: ItemResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: ItemResponse[] }>(
      `/api/items?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateItemRequest): Promise<ItemResponse> => {
  try {
    const response = await apiClient.post<ItemResponse>("/api/items", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateItemRequest): Promise<ItemResponse> => {
  try {
    const response = await apiClient.put<ItemResponse>(`/api/items/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
