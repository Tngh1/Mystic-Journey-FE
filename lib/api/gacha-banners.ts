import { get, post, put, del } from "./client";
import type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse, CreateGachaBannerRequest, GachaPullHistoryResponse, PlayerGachaStatsResponse } from "@/lib/types";
export type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse, CreateGachaBannerRequest, GachaPullHistoryResponse, PlayerGachaStatsResponse } from "@/lib/types";

// Fetches gacha banner details, rates, and featured drop items.
export const getById = async (id: number): Promise<GachaBannerDetailResponse> => {
  return get<GachaBannerDetailResponse>(`/api/gachabanners/${id}`); // Query banner configuration and pool items
};

// Retrieves paginated list of gacha banners with active and type filters.
export const getAll = async (
  page = 1,
  pageSize = 10,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<GachaBannerResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search); // Search query
  if (params?.type) qs.set("type", params.type); // Filter standard vs event banner
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive)); // Filter active status
  return get<PagedResponse<GachaBannerResponse>>(`/api/gachabanners?${qs}`); // GET /api/gachabanners
};

// Retrieves paginated list of all drop table items across banners.
export const getAllItems = async (page = 1, pageSize = 10): Promise<PagedResponse<GachaBannerItemResponse>> => {
  return get<PagedResponse<GachaBannerItemResponse>>(
    `/api/gachabanners/items-paged?page=${page}&pageSize=${pageSize}`
  ); // GET /api/gachabanners/items-paged
};

// Creates a new gacha banner configuration with schedule and pity thresholds.
export const create = async (data: CreateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return post<GachaBannerResponse>(`/api/gachabanners`, data); // POST /api/gachabanners
};

// Updates banner dates, pity requirements, and display metadata.
export const update = async (id: number, data: UpdateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return put<GachaBannerResponse>(`/api/gachabanners/${id}`, data); // PUT /api/gachabanners/{id}
};

// Configures a new reward item drop rate and rate-up featured flag for a banner.
export const addBannerItem = async (bannerId: number, data: { itemId: number; dropRate: number; isFeatured?: boolean }): Promise<GachaBannerItemResponse> => {
  return post<GachaBannerItemResponse>(`/api/gachabanners/${bannerId}/items`, data); // POST /api/gachabanners/{id}/items
};

// ─── Admin APIs ───────────────────────────────────────────────────────
// Removes a drop reward item from a gacha banner table.
export const removeBannerItem = async (bannerId: number, bannerItemId: number): Promise<void> => {
  return del<void>(`/api/gachabanners/${bannerId}/items/${bannerItemId}`); // DELETE /api/gachabanners/{id}/items/{itemId}
};

// ─── Player APIs ───────────────────────────────────────────────────────
// Admin audit endpoint: queries global pull history with rarity and banner filters.
export const getAllHistory = async (
  page = 1,
  pageSize = 20,
  params?: { bannerId?: number; rarity?: string }
): Promise<PagedResponse<GachaPullHistoryResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.bannerId) qs.set("bannerId", String(params.bannerId)); // Filter specific banner
  if (params?.rarity) qs.set("rarity", params.rarity); // Filter SSR, SR, R
  return get<PagedResponse<GachaPullHistoryResponse>>(`/api/gachabanners/history/admin?${qs}`); // GET /api/gachabanners/history/admin
};

// Retrieves lifetime pull counts and pity status for a specific player profile.
export const getPlayerGachaStats = async (playerProfileId: number): Promise<PlayerGachaStatsResponse> => {
  return get<PlayerGachaStatsResponse>(`/api/gachabanners/history/admin/stats/${playerProfileId}`); // GET /api/gachabanners/history/admin/stats/{profileId}
};
