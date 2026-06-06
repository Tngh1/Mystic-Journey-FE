import apiClient, { handleApiError } from "./client";

export interface GameSettingResponse {
  id: number;
  key: string;
  value: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface CreateGameSettingRequest {
  key: string;
  value?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateGameSettingRequest = Partial<CreateGameSettingRequest>;

export interface DailyLoginRewardResponse {
  id: number;
  dayNumber: number;
  rewardType: string;
  rewardValue: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardItemQuantity: number;
  isActive: boolean;
}

export interface CreateDailyLoginRewardRequest {
  dayNumber: number;
  rewardType?: string;
  rewardValue?: number;
  rewardItemId?: number;
  rewardItemQuantity?: number;
  isActive?: boolean;
}

export const getSettingById = async (id: number): Promise<GameSettingResponse> => {
  try {
    const response = await apiClient.get<GameSettingResponse>(`/api/game-settings/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getSettingByKey = async (key: string): Promise<GameSettingResponse> => {
  try {
    const response = await apiClient.get<GameSettingResponse>(`/api/game-settings/key/${key}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAllSettings = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: GameSettingResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: GameSettingResponse[] }>(
      `/api/game-settings?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createSetting = async (data: CreateGameSettingRequest): Promise<GameSettingResponse> => {
  try {
    const response = await apiClient.post<GameSettingResponse>("/api/game-settings", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateSettingByKey = async (key: string, data: UpdateGameSettingRequest): Promise<GameSettingResponse> => {
  try {
    const response = await apiClient.put<GameSettingResponse>(`/api/game-settings/key/${key}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const removeSetting = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/game-settings/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

export const getAllDailyLoginRewards = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: DailyLoginRewardResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: DailyLoginRewardResponse[] }>(
      `/api/daily-login-rewards?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createDailyLoginReward = async (data: CreateDailyLoginRewardRequest): Promise<DailyLoginRewardResponse> => {
  try {
    const response = await apiClient.post<DailyLoginRewardResponse>("/api/daily-login-rewards", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
