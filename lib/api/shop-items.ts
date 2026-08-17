import { get, post, put, del } from "./client";
import type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";
export type { ShopItemResponse, CreateShopItemRequest, UpdateShopItemRequest, PagedResponse } from "@/lib/types";

export type ShopItemFilters = {
  search?: string;
  // Supported currencies: Gold or Gems; the selected currency determines which player balance is charged or credited.
  currency?: string;
  shopSection?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// Fetches a single shop catalog listing by its ID.
export const getById = async (id: number): Promise<ShopItemResponse> => {
  return get<ShopItemResponse>(`/api/shopitems/${id}`); // Query item price, currency type, and purchase limits
};

// Retrieves paginated list of store offerings with currency, section, and search filters.
export const getAll = async (
  page = 1,
  pageSize = 10,
  params?: ShopItemFilters,
): Promise<PagedResponse<ShopItemResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Search by item name
  if (params?.currency) qs.set("currency", params.currency); // Filter Gold vs Gems
  if (params?.shopSection) qs.set("shopSection", params.shopSection); // Filter by store tab/section
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active store entries
  if (params?.sortBy) qs.set("sortBy", params.sortBy); // Sorting column
  if (params?.sortOrder) qs.set("sortOrder", params.sortOrder); // Sort direction
  return get<PagedResponse<ShopItemResponse>>(`/api/shopitems?${qs}`); // GET /api/shopitems
};

// Creates a new purchasable store listing.
export const create = async (data: CreateShopItemRequest): Promise<ShopItemResponse> => {
  return post<ShopItemResponse>("/api/shopitems", data); // POST /api/shopitems
};

// Updates prices, discount rates, purchase limits, and active periods for a shop listing.
export const update = async (id: number, data: UpdateShopItemRequest): Promise<ShopItemResponse> => {
  return put<ShopItemResponse>(`/api/shopitems/${id}`, data); // PUT /api/shopitems/{id}
};

// Deactivates/removes an item listing from the in-game shop.
export const remove = async (id: number): Promise<void> => {
  await del(`/api/shopitems/${id}`); // DELETE /api/shopitems/{id}
};
