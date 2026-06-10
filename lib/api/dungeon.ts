import { get, post, put, del, handleApiError } from "./client";
import type {
  DungeonConfigResponse,
  CreateDungeonConfigRequest,
  UpdateDungeonConfigRequest,
  PagedResponse,
} from "@/lib/types";

export const getById = async (id: number): Promise<DungeonConfigResponse> => {
  return get<DungeonConfigResponse>(`/api/dungeons/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<DungeonConfigResponse>> => {
  return get<PagedResponse<DungeonConfigResponse>>(
    `/api/dungeons?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  return post<DungeonConfigResponse>("/api/dungeons", data);
};

export const update = async (id: number, data: UpdateDungeonConfigRequest): Promise<DungeonConfigResponse> => {
  return put<DungeonConfigResponse>(`/api/dungeons/${id}`, data);
};

export const remove = async (id: number): Promise<void> => {
  await del(`/api/dungeons/${id}`);
};
