import { get, put, post, del } from "./client";
import type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse, MonsterSpawnResponse, CreateMonsterSpawnRequest, UpdateMonsterSpawnRequest, ChestItemResponse, CreateChestItemRequest } from "@/lib/types";
export type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse, ChestItemResponse, CreateChestItemRequest } from "@/lib/types";

// Fetches a single dungeon configuration by its ID.
export const getById = async (id: number): Promise<DungeonConfigResponse> => {
  return get<DungeonConfigResponse>(`/api/dungeons/${id}`); // Query dungeon config, waves, and drops
};

// Retrieves paginated list of dungeons with optional search and type filtering.
export const getAll = async (
  page = 1,
  pageSize = 50,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<DungeonConfigResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Append search query
  if (params?.type) qs.set("type", params.type); // Append dungeon category filter
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active status
  return get<PagedResponse<DungeonConfigResponse>>(`/api/dungeons?${qs}`); // GET /api/dungeons
};

// Updates dungeon difficulty, required level, and completion rewards.
export const update = async (id: number, data: UpdateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  return put<DungeonConfigResponse>(`/api/dungeons/${id}`, data); // PUT /api/dungeons/{id}
};

// Retrieves all monster spawn points and wave sequences configured for a dungeon.
export const getDungeonSpawns = async (dungeonId: number): Promise<MonsterSpawnResponse[]> => {
  return get<MonsterSpawnResponse[]>(`/api/dungeons/${dungeonId}/spawns`); // GET /api/dungeons/{id}/spawns
};

// Adds a new monster spawn wave entry to a dungeon map.
export const addDungeonSpawn = async (data: CreateMonsterSpawnRequest): Promise<MonsterSpawnResponse> => {
  return post<MonsterSpawnResponse>("/api/monsters/spawns", data); // POST /api/monsters/spawns
};

// Updates monster spawn coordinates, wave timing, and respawn count.
export const updateDungeonSpawn = async (spawnId: number, data: UpdateMonsterSpawnRequest): Promise<MonsterSpawnResponse> => {
  return put<MonsterSpawnResponse>(`/api/monsters/spawns/${spawnId}`, data); // PUT /api/monsters/spawns/{id}
};

// Removes a monster spawn point from a dungeon map.
export const removeDungeonSpawn = async (spawnId: number): Promise<void> => {
  return del<void>(`/api/monsters/spawns/${spawnId}`); // DELETE /api/monsters/spawns/{id}
};

// Retrieves treasure chest reward drops for a dungeon.
export const getDungeonChestItems = async (dungeonId: number): Promise<ChestItemResponse[]> => {
  const dungeon = await getById(dungeonId); // Fetch dungeon data
  return dungeon.possibleDrops ?? []; // Extract possible drop items
};

// Adds a new item drop entry to the dungeon clear chest.
export const addDungeonChestItem = async (dungeonId: number, data: CreateChestItemRequest): Promise<ChestItemResponse> => {
  return post<ChestItemResponse>(`/api/dungeons/${dungeonId}/chest-items`, data); // POST /api/dungeons/{id}/chest-items
};

// Modifies drop chance weight or item count for a dungeon chest reward.
export const updateDungeonChestItem = async (dungeonId: number, chestItemId: number, data: CreateChestItemRequest): Promise<ChestItemResponse> => {
  return put<ChestItemResponse>(`/api/dungeons/${dungeonId}/chest-items/${chestItemId}`, data); // PUT /api/dungeons/{id}/chest-items/{chestItemId}
};

// Deletes a chest drop reward entry from a dungeon.
export const removeDungeonChestItem = async (dungeonId: number, chestItemId: number): Promise<void> => {
  return del<void>(`/api/dungeons/${dungeonId}/chest-items/${chestItemId}`); // DELETE /api/dungeons/{id}/chest-items/{chestItemId}
};
