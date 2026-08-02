import { get, put } from "./client";
import type { ItemResponse, UpdateItemRequest, PagedResponse } from "@/lib/types";
export type { ItemResponse, UpdateItemRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<ItemResponse> => {
  return get<ItemResponse>(`/api/items/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 1000,
  params?: { search?: string; type?: string; rarity?: string; isActive?: boolean }
): Promise<PagedResponse<ItemResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.rarity) qs.set("rarity", params.rarity);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  return get<PagedResponse<ItemResponse>>(`/api/items?${qs}`);
};

export const update = async (id: number, data: UpdateItemRequest): Promise<ItemResponse> => {
  return put<ItemResponse>(`/api/items/${id}`, data);
};
