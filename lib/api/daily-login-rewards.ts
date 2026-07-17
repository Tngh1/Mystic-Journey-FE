import { get, post } from "./client";
import type { DailyLoginRewardResponse, CreateDailyLoginRewardRequest, PagedResponse } from "@/lib/types";
export type { DailyLoginRewardResponse, CreateDailyLoginRewardRequest } from "@/lib/types";

export const getAllDailyLoginRewards = async (page = 1, pageSize = 10): Promise<PagedResponse<DailyLoginRewardResponse>> => {
  return get<PagedResponse<DailyLoginRewardResponse>>(
    `/api/dailyloginrewards?page=${page}&pageSize=${pageSize}`
  );
};

export const createDailyLoginReward = async (data: CreateDailyLoginRewardRequest): Promise<DailyLoginRewardResponse> => {
  return post<DailyLoginRewardResponse>("/api/dailyloginrewards", data);
};

export const getDailyLoginRewardsCurrentMonth = async (): Promise<DailyLoginRewardResponse[]> => {
  return get<DailyLoginRewardResponse[]>(`/api/dailyloginrewards/current-month`);
};