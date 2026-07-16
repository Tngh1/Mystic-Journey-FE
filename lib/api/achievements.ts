import { get, put } from "./client";
import type { AchievementResponse, UpdateAchievementRequest, PagedResponse } from "@/lib/types";
export type { AchievementResponse, UpdateAchievementRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<AchievementResponse> => {
  return get<AchievementResponse>(`/api/achievements/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<AchievementResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  return get<PagedResponse<AchievementResponse>>(`/api/achievements?${qs}`);
};

export const update = async (id: number, data: UpdateAchievementRequest): Promise<AchievementResponse> => {
  return put<AchievementResponse>(`/api/achievements/${id}`, data);
};