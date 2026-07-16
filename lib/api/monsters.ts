import { get, put } from "./client";
import type { MonsterResponse, MonsterDetailResponse, MonsterSpawnResponse, UpdateMonsterRequest, PagedResponse } from "@/lib/types";
export type { MonsterResponse, MonsterDetailResponse, MonsterSpawnResponse, UpdateMonsterRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<MonsterDetailResponse> => {
  return get<MonsterDetailResponse>(`/api/monsters/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<MonsterResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  return get<PagedResponse<MonsterResponse>>(`/api/monsters?${qs}`);
};

export const update = async (id: number, data: UpdateMonsterRequest): Promise<MonsterResponse> => {
  return put<MonsterResponse>(`/api/monsters/${id}`, data);
};

export const getSpawnsByMonster = async (monsterId: number): Promise<MonsterSpawnResponse[]> => {
  return get<MonsterSpawnResponse[]>(`/api/monsters/${monsterId}/spawns`);
};