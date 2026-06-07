import apiClient, { handleApiError } from "./client";

export interface AchievementResponse {
  id: number;
  name: string;
  description: string | null;
  type: string;
  iconUrl: string | null;
  requiredValue: number;
  isActive: boolean;
  createdAt: string;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardQuantity: number;
  rewardGold: number;
  rewardGems: number;
}

export interface CreateAchievementRequest {
  name: string;
  description?: string;
  type?: string;
  iconUrl?: string | null;
  requiredValue?: number;
  isActive?: boolean;
  rewardItemId?: number | null;
  rewardQuantity?: number;
  rewardGold?: number;
  rewardGems?: number;
}

export type UpdateAchievementRequest = CreateAchievementRequest;

export const getById = async (id: number): Promise<AchievementResponse> => {
  try {
    const response = await apiClient.get<AchievementResponse>(`/api/achievements/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: AchievementResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: AchievementResponse[] }>(
      `/api/achievements?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateAchievementRequest): Promise<AchievementResponse> => {
  try {
    const response = await apiClient.post<AchievementResponse>("/api/achievements", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateAchievementRequest): Promise<AchievementResponse> => {
  try {
    const response = await apiClient.put<AchievementResponse>(`/api/achievements/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
