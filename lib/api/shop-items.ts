import { get, post, put, del } from "./client";
import type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";
export type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";

export type ShopItemFilters = {
  search?: string;
  currency?: string;
  shopSection?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const getById = async (id: number): Promise<ShopItemResponse> => {
  return get<ShopItemResponse>(`/api/shopitems/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 10,
  params?: ShopItemFilters,
): Promise<PagedResponse<ShopItemResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.currency) qs.set("currency", params.currency);
  if (params?.shopSection) qs.set("shopSection", params.shopSection);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params?.sortBy) qs.set("sortBy", params.sortBy);
  if (params?.sortOrder) qs.set("sortOrder", params.sortOrder);
  return get<PagedResponse<ShopItemResponse>>(`/api/shopitems?${qs}`);
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