import { get, put } from "./client";
import type { MonsterResponse, MonsterDetailResponse, UpdateMonsterRequest, PagedResponse } from "@/lib/types";
export type { MonsterResponse, MonsterDetailResponse, UpdateMonsterRequest, PagedResponse } from "@/lib/types";

// Fetches single monster definition and drop table rewards by monster ID.
export const getById = async (id: number): Promise<MonsterDetailResponse> => {
  return get<MonsterDetailResponse>(`/api/monsters/${id}`); // Query monster attributes
};

// Retrieves paginated list of bestiary monster records with category filters.
export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<MonsterResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Append search query
  if (params?.type) qs.set("type", params.type); // Filter Normal, Elite, Boss
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active status
  return get<PagedResponse<MonsterResponse>>(`/api/monsters?${qs}`); // GET /api/monsters
};

// Updates monster stats, attack powers, elemental weaknesses, or loot drop chances.
export const update = async (id: number, data: UpdateMonsterRequest): Promise<MonsterResponse> => {
  return put<MonsterResponse>(`/api/monsters/${id}`, data); // PUT /api/monsters/{id}
};
