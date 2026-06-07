import apiClient, { handleApiError } from "./client";

export interface MonsterResponse {
  id: number;
  name: string;
  type: string;
  description: string;
  level: number;
  maxHp: number;
  atk: number;
  def: number;
  moveSpeed: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  experienceReward: number;
  goldReward: number;
  isActive: boolean;
}

export interface MonsterDetailResponse extends MonsterResponse {
  monsterDrops: MonsterDropResponse[];
}

export interface MonsterDropResponse {
  id: number;
  monsterId: number;
  itemId: number;
  itemName: string | null;
  dropRate: number;
  minQuantity: number;
  maxQuantity: number;
  isGuaranteed: boolean;
  isActive: boolean;
}

export interface CreateMonsterRequest {
  name: string;
  type?: string;
  description?: string;
  level?: number;
  maxHp?: number;
  atk?: number;
  def?: number;
  moveSpeed?: number;
  attackSpeed?: number;
  critRate?: number;
  critDamage?: number;
  experienceReward?: number;
  goldReward?: number;
  isActive?: boolean;
}

export type UpdateMonsterRequest = Partial<CreateMonsterRequest>;

export const getById = async (id: number): Promise<MonsterDetailResponse> => {
  try {
    const response = await apiClient.get<MonsterDetailResponse>(`/api/monsters/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: MonsterResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: MonsterResponse[] }>(
      `/api/monsters?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateMonsterRequest): Promise<MonsterResponse> => {
  try {
    const response = await apiClient.post<MonsterResponse>("/api/monsters", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateMonsterRequest): Promise<MonsterResponse> => {
  try {
    const response = await apiClient.put<MonsterResponse>(`/api/monsters/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/monsters/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

export const addDrop = async (monsterId: number, data: { itemId: number; dropRate: number; minQuantity?: number; maxQuantity?: number; isGuaranteed?: boolean; isActive?: boolean }): Promise<MonsterDropResponse> => {
  try {
    const response = await apiClient.post<MonsterDropResponse>(`/api/monsters/${monsterId}/drops`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
