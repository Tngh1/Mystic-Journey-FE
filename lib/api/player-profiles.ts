import { get, put } from "./client";
import type { PlayerProfileResponse, PlayerProfileWithStats, UpdatePlayerProfileRequest, PagedResponse } from "@/lib/types";
export type { PlayerProfileResponse, PlayerProfileWithStats, UpdatePlayerProfileRequest, PagedResponse } from "@/lib/types";

export const getPlayerProfileById = async (id: number): Promise<PlayerProfileWithStats> => {
  return get<PlayerProfileWithStats>(`/api/playerprofiles/${id}`);
};

export const getPlayerProfileAdmin = async (id: number): Promise<PlayerProfileWithStats> => {
  return get<PlayerProfileWithStats>(`/api/playerprofiles/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 10,
  search?: string
): Promise<PagedResponse<PlayerProfileResponse>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search && search.trim()) params.set("search", search.trim());
  return get<PagedResponse<PlayerProfileResponse>>(`/api/playerprofiles?${params.toString()}`);
};

export const updatePlayerProfile = async (id: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfileResponse> => {
  return put<PlayerProfileResponse>(`/api/playerprofiles/${id}`, data);
};

export const updatePlayerProfileAdmin = async (id: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfileResponse> => {
  return put<PlayerProfileResponse>(`/api/playerprofiles/${id}`, data);
};
