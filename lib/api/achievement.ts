import { get, post, put, handleApiError } from "./client";
import type {
  AchievementResponse,
  CreateAchievementRequest,
  UpdateAchievementRequest,
  PagedResponse,
} from "@/lib/types";

export const getById = async (id: number): Promise<AchievementResponse> => {
  return get<AchievementResponse>(`/api/achievements/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<AchievementResponse>> => {
  return get<PagedResponse<AchievementResponse>>(
    `/api/achievements?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateAchievementRequest): Promise<AchievementResponse> => {
  return post<AchievementResponse>("/api/achievements", data);
};

export const update = async (id: number, data: UpdateAchievementRequest): Promise<AchievementResponse> => {
  return put<AchievementResponse>(`/api/achievements/${id}`, data);
};
