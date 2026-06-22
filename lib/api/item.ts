import { get, post, put, del } from "./client";
import type { ItemResponse, CreateItemRequest, UpdateItemRequest, PagedResponse } from "@/lib/types";
export type { ItemResponse, CreateItemRequest, UpdateItemRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<ItemResponse> => {
  return get<ItemResponse>(`/api/items/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<ItemResponse>> => {
  return get<PagedResponse<ItemResponse>>(
    `/api/items?page=${page}&pageSize=${pageSize}`
  );
};

export const getAllSimple = async (): Promise<ItemResponse[]> => {
  const res = await get<PagedResponse<ItemResponse>>(`/api/items?page=1&pageSize=1000`);
  return (res as unknown as { items: ItemResponse[] }).items ?? res.items ?? [];
};

export const create = async (data: CreateItemRequest): Promise<ItemResponse> => {
  return post<ItemResponse>("/api/items", data);
};

export const update = async (id: number, data: UpdateItemRequest): Promise<ItemResponse> => {
  return put<ItemResponse>(`/api/items/${id}`, data);
};

export const remove = async (id: number): Promise<void> => {
  await del(`/api/items/${id}`);
};
