import { get, post, put } from "./client";
import type {
  MonsterResponse,
  MonsterDetailResponse,
  MonsterDropResponse,
  CreateMonsterRequest,
  UpdateMonsterRequest,
  AddMonsterDropRequest,
  PagedResponse,
} from "@/lib/types";

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
