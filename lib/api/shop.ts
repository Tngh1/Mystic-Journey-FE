import { get, post, put, del } from "./client";
import type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";
export type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<ShopItemResponse> => {
  return get<ShopItemResponse>(`/api/shopitems/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<ShopItemResponse>> => {
  return get<PagedResponse<ShopItemResponse>>(
    `/api/shopitems?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateShopItemRequest): Promise<ShopItemResponse> => {
  return post<ShopItemResponse>("/api/shopitems", data);
};

export const update = async (id: number, data: UpdateShopItemRequest): Promise<ShopItemResponse> => {
  return put<ShopItemResponse>(`/api/shopitems/${id}`, data);
};

export const remove = async (id: number): Promise<void> => {
  await del(`/api/shopitems/${id}`);
};
