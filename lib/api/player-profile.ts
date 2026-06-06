import apiClient, { handleApiError } from "./client";

export interface PlayerProfileResponse {
  id: number;
  accountId: number;
  accountEmail: string | null;
  displayName: string;
  avatarUrl: string | null;
  playerClass: string;
  level: number;
  experiencePoints: number;
  gold: number;
  gems: number;
  energy: number;
  createdAt: string;
  updatedAt: string | null;
  isBanned: boolean;
}

export interface PlayerStatsResponse {
  currentHp: number;
  maxHp: number;
  atk: number;
  def: number;
  moveSpeed: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  damageBonus: number;
  skillPoints: number;
  totalWins: number;
  totalLosses: number;
  totalKills: number;
  totalDeaths: number;
}

export interface CreatePlayerProfileRequest {
  accountId: number;
  displayName: string;
  avatarUrl?: string;
  class?: string;
}

export interface UpdatePlayerProfileRequest {
  displayName?: string;
  avatarUrl?: string;
  playerClass?: string;
  level?: number;
  experiencePoints?: number;
  gold?: number;
  gems?: number;
  energy?: number;
  isBanned?: boolean;
}

export interface PlayerProfileWithStats extends PlayerProfileResponse {
  stats: PlayerStatsResponse | null;
}

export const getPlayerProfileById = async (id: number): Promise<PlayerProfileWithStats> => {
  try {
    const response = await apiClient.get<PlayerProfileWithStats>(`/api/player-profiles/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getPlayerProfileAdmin = async (id: number): Promise<PlayerProfileWithStats> => {
  try {
    const response = await apiClient.get<PlayerProfileWithStats>(`/api/player-profiles/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updatePlayerProfileAdmin = async (id: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfileResponse> => {
  try {
    const response = await apiClient.put<PlayerProfileResponse>(`/api/player-profiles/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: PlayerProfileResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: PlayerProfileResponse[] }>(
      `/api/player-profiles?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updatePlayerProfile = async (id: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfileResponse> => {
  try {
    const response = await apiClient.put<PlayerProfileResponse>(`/api/player-profiles/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
