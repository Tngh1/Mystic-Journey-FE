import { get, put, post, del } from "./client";
import type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse, MonsterSpawnResponse, CreateMonsterSpawnRequest, UpdateMonsterSpawnRequest, ChestItemResponse, CreateChestItemRequest } from "@/lib/types";
export type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse, ChestItemResponse, CreateChestItemRequest } from "@/lib/types";

export const getById = async (id: number): Promise<DungeonConfigResponse> => {
  return get<DungeonConfigResponse>(`/api/dungeons/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<DungeonConfigResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  return get<PagedResponse<DungeonConfigResponse>>(`/api/dungeons?${qs}`);
};

export const update = async (id: number, data: UpdateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  return put<DungeonConfigResponse>(`/api/dungeons/${id}`, data);
};

export const getDungeonSpawns = async (dungeonId: number): Promise<MonsterSpawnResponse[]> => {
  return get<MonsterSpawnResponse[]>(`/api/dungeons/${dungeonId}/spawns`);
};

export const addDungeonSpawn = async (data: CreateMonsterSpawnRequest): Promise<MonsterSpawnResponse> => {
  return post<MonsterSpawnResponse>("/api/monsters/spawns", data);
};

export const updateDungeonSpawn = async (spawnId: number, data: UpdateMonsterSpawnRequest): Promise<MonsterSpawnResponse> => {
  return put<MonsterSpawnResponse>(`/api/monsters/spawns/${spawnId}`, data);
};

export const removeDungeonSpawn = async (spawnId: number): Promise<void> => {
  return del<void>(`/api/monsters/spawns/${spawnId}`);
};

export const getDungeonChestItems = async (dungeonId: number): Promise<ChestItemResponse[]> => {
  const dungeon = await getById(dungeonId);
  return dungeon.possibleDrops ?? [];
};

export const addDungeonChestItem = async (dungeonId: number, data: CreateChestItemRequest): Promise<ChestItemResponse> => {
  return post<ChestItemResponse>(`/api/dungeons/${dungeonId}/chest-items`, data);
};

export const updateDungeonChestItem = async (dungeonId: number, chestItemId: number, data: CreateChestItemRequest): Promise<ChestItemResponse> => {
  return put<ChestItemResponse>(`/api/dungeons/${dungeonId}/chest-items/${chestItemId}`, data);
};

export const removeDungeonChestItem = async (dungeonId: number, chestItemId: number): Promise<void> => {
  return del<void>(`/api/dungeons/${dungeonId}/chest-items/${chestItemId}`);
};