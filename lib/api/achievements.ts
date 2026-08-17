import { get, put } from "./client";
import type { AchievementResponse, UpdateAchievementRequest, PagedResponse } from "@/lib/types";
export type { AchievementResponse, UpdateAchievementRequest, PagedResponse } from "@/lib/types";

// Fetches single achievement definition by ID.
export const getById = async (id: number): Promise<AchievementResponse> => {
  return get<AchievementResponse>(`/api/achievements/${id}`); // Query achievement details
};

// Retrieves paginated list of achievement milestones and reward specs.
export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<AchievementResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Append search query
  if (params?.type) qs.set("type", params.type); // Filter Combat/Exploration/Social category
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active milestones
  return get<PagedResponse<AchievementResponse>>(`/api/achievements?${qs}`); // GET /api/achievements
};

// Updates achievement milestone target requirement or reward amounts.
export const update = async (id: number, data: UpdateAchievementRequest): Promise<AchievementResponse> => {
  return put<AchievementResponse>(`/api/achievements/${id}`, data); // PUT /api/achievements/{id}
};
