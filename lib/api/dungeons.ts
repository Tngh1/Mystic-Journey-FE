import { get, put } from "./client";
import type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse } from "@/lib/types";
export type { DungeonConfigResponse, UpdateDungeonConfigRequest, PagedResponse } from "@/lib/types";

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