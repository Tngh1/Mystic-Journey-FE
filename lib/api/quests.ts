import { get, post, put } from "./client";
import type { QuestResponse, UpdateQuestRequest, PagedResponse, NPCResponse } from "@/lib/types";
export type { QuestResponse, UpdateQuestRequest, PagedResponse, NPCResponse } from "@/lib/types";

// Fetches full quest definition, prerequisites, objectives, and rewards by ID.
export const getById = async (id: number): Promise<QuestResponse> => {
  return get<QuestResponse>(`/api/quests/${id}`); // Query quest details
};

// Retrieves paginated list of quests with map, search, and category filters.
export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean; mapName?: string }
): Promise<PagedResponse<QuestResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Append search text
  if (params?.type) qs.set("type", params.type); // Append quest type (Main, Side, Daily)
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active status
  if (params?.mapName) qs.set("mapName", params.mapName); // Filter by world zone/map
  return get<PagedResponse<QuestResponse>>(`/api/quests?${qs}`); // GET /api/quests
};


// Retrieves eligible NPC dialog and quest-giver options for the current zone.
export const getNpcOptions = async (mapName?: string): Promise<NPCResponse[]> => {
  return get<NPCResponse[]>("/api/quests/npc-options", mapName ? { mapName } : undefined); // GET /api/quests/npc-options
};

// Creates a new quest template with target objectives and reward bundles.
export const create = async (data: UpdateQuestRequest): Promise<QuestResponse> => {
  return post<QuestResponse>("/api/quests", data); // POST /api/quests
};

// Updates quest instructions, target kill counts, prerequisites, or rewards.
export const update = async (id: number, data: UpdateQuestRequest): Promise<QuestResponse> => {
  return put<QuestResponse>(`/api/quests/${id}`, data); // PUT /api/quests/{id}
};
