import { get, post, put } from "./client";
import type { QuestResponse, UpdateQuestRequest, PagedResponse, NPCResponse } from "@/lib/types";
export type { QuestResponse, UpdateQuestRequest, PagedResponse, NPCResponse } from "@/lib/types";

export const getById = async (id: number): Promise<QuestResponse> => {
  return get<QuestResponse>(`/api/quests/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean; mapName?: string }
): Promise<PagedResponse<QuestResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params?.mapName) qs.set("mapName", params.mapName);
  return get<PagedResponse<QuestResponse>>(`/api/quests?${qs}`);
};


export const getNpcOptions = async (mapName?: string): Promise<NPCResponse[]> => {
  return get<NPCResponse[]>("/api/quests/npc-options", mapName ? { mapName } : undefined);
};

export const create = async (data: UpdateQuestRequest): Promise<QuestResponse> => {
  return post<QuestResponse>("/api/quests", data);
};

export const update = async (id: number, data: UpdateQuestRequest): Promise<QuestResponse> => {
  return put<QuestResponse>(`/api/quests/${id}`, data);
};