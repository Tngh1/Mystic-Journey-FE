import { get, post, put } from "./client";
import type { MonsterResponse, MonsterDetailResponse, MonsterDropResponse, MonsterSpawnResponse, CreateMonsterRequest, UpdateMonsterRequest, AddMonsterDropRequest, CreateMonsterSpawnRequest, PagedResponse } from "@/lib/types";
export type { MonsterResponse, MonsterDetailResponse, MonsterDropResponse, MonsterSpawnResponse, CreateMonsterRequest, UpdateMonsterRequest, AddMonsterDropRequest, CreateMonsterSpawnRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<MonsterDetailResponse> => {
  return get<MonsterDetailResponse>(`/api/monsters/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<MonsterResponse>> => {
  return get<PagedResponse<MonsterResponse>>(
    `/api/monsters?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateMonsterRequest): Promise<MonsterResponse> => {
  return post<MonsterResponse>("/api/monsters", data);
};

export const update = async (id: number, data: UpdateMonsterRequest): Promise<MonsterResponse> => {
  return put<MonsterResponse>(`/api/monsters/${id}`, data);
};

export const addDrop = async (monsterId: number, data: AddMonsterDropRequest): Promise<MonsterDropResponse> => {
  return post<MonsterDropResponse>(`/api/monsters/${monsterId}/drops`, data);
};

export const getSpawnsByMonster = async (monsterId: number): Promise<MonsterSpawnResponse[]> => {
  return get<MonsterSpawnResponse[]>(`/api/monsters/${monsterId}/spawns`);
};

export const createSpawn = async (data: CreateMonsterSpawnRequest): Promise<MonsterSpawnResponse> => {
  return post<MonsterSpawnResponse>("/api/monsters/spawns", data);
};
