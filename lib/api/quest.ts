import apiClient, { handleApiError } from "./client";

export interface QuestResponse {
  id: number;
  title: string;
  description: string | null;
  type: string;
  defaultStatus: string;
  requiredLevel: number;
  rewardExperience: number;
  rewardGold: number;
  rewardGems: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  isActive: boolean;
}

export interface CreateQuestRequest {
  title: string;
  description?: string;
  type?: string;
  defaultStatus?: string;
  requiredLevel?: number;
  rewardExperience?: number;
  rewardGold?: number;
  rewardGems?: number;
  rewardItemId?: number | null;
  isActive?: boolean;
}

export type UpdateQuestRequest = CreateQuestRequest;

export const getById = async (id: number): Promise<QuestResponse> => {
  try {
    const response = await apiClient.get<QuestResponse>(`/api/quests/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: QuestResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: QuestResponse[] }>(
      `/api/quests?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateQuestRequest): Promise<QuestResponse> => {
  try {
    const response = await apiClient.post<QuestResponse>("/api/quests", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateQuestRequest): Promise<QuestResponse> => {
  try {
    const response = await apiClient.put<QuestResponse>(`/api/quests/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
