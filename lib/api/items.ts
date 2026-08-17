import { get, put } from "./client";
import type { ItemResponse, UpdateItemRequest, PagedResponse } from "@/lib/types";
export type { ItemResponse, UpdateItemRequest, PagedResponse } from "@/lib/types";

// Fetches single item template details by item ID.
export const getById = async (id: number): Promise<ItemResponse> => {
  return get<ItemResponse>(`/api/items/${id}`); // Query item details
};

// Retrieves paginated list of all items with rarity and type filters.
export const getAll = async (
  page = 1,
  pageSize = 1000,
  params?: { search?: string; type?: string; rarity?: string; isActive?: boolean }
): Promise<PagedResponse<ItemResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Append search term
  if (params?.type) qs.set("type", params.type); // Append equipment slot or consumable type
  if (params?.rarity) qs.set("rarity", params.rarity); // Filter Common, Rare, Epic, Legendary
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active items
  return get<PagedResponse<ItemResponse>>(`/api/items?${qs}`); // GET /api/items
};

// Updates item attributes, sell value, stack size, or stat bonus values.
export const update = async (id: number, data: UpdateItemRequest): Promise<ItemResponse> => {
  return put<ItemResponse>(`/api/items/${id}`, data); // PUT /api/items/{id}
};
