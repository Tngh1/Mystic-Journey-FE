import { get, post, put } from "./client";
import type { QuestResponse, CreateQuestRequest, UpdateQuestRequest, PagedResponse } from "@/lib/types";
export type { QuestResponse, CreateQuestRequest, UpdateQuestRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<QuestResponse> => {
  return get<QuestResponse>(`/api/quests/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<QuestResponse>> => {
  return get<PagedResponse<QuestResponse>>(
    `/api/quests?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateQuestRequest): Promise<QuestResponse> => {
  return post<QuestResponse>("/api/quests", data);
};

export const update = async (id: number, data: UpdateQuestRequest): Promise<QuestResponse> => {
  return put<QuestResponse>(`/api/quests/${id}`, data);
};
