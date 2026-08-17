import { get, put } from "./client";
import type { PlayerProfileResponse, PlayerProfileWithStats, UpdatePlayerProfileRequest, PagedResponse } from "@/lib/types";
export type { PlayerProfileResponse, PlayerProfileWithStats, UpdatePlayerProfileRequest, PagedResponse } from "@/lib/types";


// Fetches full player profile, character stats, and equipment summary by profile ID.
export const getPlayerProfileById = async (id: number): Promise<PlayerProfileWithStats> => {
  return get<PlayerProfileWithStats>(`/api/playerprofiles/${id}`); // Query profile and stat overview
};


// Retrieves paginated list of all player profiles with search query support.
export const getAll = async (
  page = 1,
  pageSize = 10,
  search?: string
): Promise<PagedResponse<PlayerProfileResponse>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (search && search.trim()) params.set("search", search.trim()); // Append search keyword
  return get<PagedResponse<PlayerProfileResponse>>(`/api/playerprofiles?${params.toString()}`); // GET /api/playerprofiles
};

// Updates player profile attributes (display name, avatar, bio).
export const updatePlayerProfile = async (id: number, data: UpdatePlayerProfileRequest): Promise<PlayerProfileResponse> => {
  return put<PlayerProfileResponse>(`/api/playerprofiles/${id}`, data); // PUT /api/playerprofiles/{id}
};
