import { get, put, post } from "./client";
import type { GameSettingResponse, UpdateGameSettingRequest, DailyLoginRewardResponse, CreateDailyLoginRewardRequest, PagedResponse } from "@/lib/types";
export type { GameSettingResponse, UpdateGameSettingRequest, DailyLoginRewardResponse, CreateDailyLoginRewardRequest, PagedResponse } from "@/lib/types";

export const getSettingById = async (id: number): Promise<GameSettingResponse> => {
  return get<GameSettingResponse>(`/api/gamesettings/${id}`);
};

export const getSettingByKey = async (key: string): Promise<GameSettingResponse> => {
  return get<GameSettingResponse>(`/api/gamesettings/key/${key}`);
};

export const getAllSettings = async (page = 1, pageSize = 10): Promise<PagedResponse<GameSettingResponse>> => {
  return get<PagedResponse<GameSettingResponse>>(
    `/api/gamesettings?page=${page}&pageSize=${pageSize}`
  );
};

export const updateSettingByKey = async (key: string, data: UpdateGameSettingRequest): Promise<GameSettingResponse> => {
  return put<GameSettingResponse>(`/api/gamesettings/key/${key}`, data);
};

export const getAllDailyLoginRewards = async (page = 1, pageSize = 10): Promise<PagedResponse<DailyLoginRewardResponse>> => {
  return get<PagedResponse<DailyLoginRewardResponse>>(
    `/api/DailyLoginRewards?page=${page}&pageSize=${pageSize}`
  );
};

export const createDailyLoginReward = async (data: CreateDailyLoginRewardRequest): Promise<DailyLoginRewardResponse> => {
  return post<DailyLoginRewardResponse>("/api/DailyLoginRewards", data);
};
