import apiClient, { handleApiError } from "./client";

export interface DungeonConfigResponse {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  levelRequirement: number;
  maxMembers: number;
  difficulty: number;
  recommendedPower: number;
  chestId: number | null;
  isActive: boolean;
}

export interface CreateDungeonConfigRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  type?: string;
  levelRequirement?: number;
  maxMembers?: number;
  difficulty?: number;
  recommendedPower?: number;
  chestId?: number;
  isActive?: boolean;
}

export type UpdateDungeonConfigRequest = CreateDungeonConfigRequest;

export const getById = async (id: number): Promise<DungeonConfigResponse> => {
  try {
    const response = await apiClient.get<DungeonConfigResponse>(`/api/dungeons/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: DungeonConfigResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: DungeonConfigResponse[] }>(
      `/api/dungeons?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  try {
    const response = await apiClient.post<DungeonConfigResponse>("/api/dungeons", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  try {
    const response = await apiClient.put<DungeonConfigResponse>(`/api/dungeons/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/dungeons/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
