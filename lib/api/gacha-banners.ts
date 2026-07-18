import { get, post, put, del } from "./client";
import type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse, CreateGachaBannerRequest, GachaPullHistoryResponse, PlayerGachaStatsResponse } from "@/lib/types";
export type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse, CreateGachaBannerRequest, GachaPullHistoryResponse, PlayerGachaStatsResponse } from "@/lib/types";

export const getById = async (id: number): Promise<GachaBannerDetailResponse> => {
  return get<GachaBannerDetailResponse>(`/api/gachabanners/${id}`);
};

export const getAll = async (
  page = 1,
  pageSize = 10,
  params?: { search?: string; type?: string; isActive?: boolean }
): Promise<PagedResponse<GachaBannerResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.search) qs.set("search", params.search);
  if (params?.type) qs.set("type", params.type);
  if (params?.isActive !== undefined) qs.set("isActive", String(params.isActive));
  return get<PagedResponse<GachaBannerResponse>>(`/api/gachabanners?${qs}`);
};

export const getAllItems = async (page = 1, pageSize = 10): Promise<PagedResponse<GachaBannerItemResponse>> => {
  return get<PagedResponse<GachaBannerItemResponse>>(
    `/api/gachabanners/items-paged?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return post<GachaBannerResponse>(`/api/gachabanners`, data);
};

export const update = async (id: number, data: UpdateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return put<GachaBannerResponse>(`/api/gachabanners/${id}`, data);
};

export const addBannerItem = async (bannerId: number, data: { itemId: number; dropRate: number; isFeatured?: boolean }): Promise<GachaBannerItemResponse> => {
  return post<GachaBannerItemResponse>(`/api/gachabanners/${bannerId}/items`, data);
};

export const removeBannerItem = async (bannerId: number, bannerItemId: number): Promise<void> => {
  return del<void>(`/api/gachabanners/${bannerId}/items/${bannerItemId}`);
};

export const getAllHistory = async (
  page = 1,
  pageSize = 20,
  params?: { bannerId?: number; rarity?: string }
): Promise<PagedResponse<GachaPullHistoryResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (params?.bannerId) qs.set("bannerId", String(params.bannerId));
  if (params?.rarity) qs.set("rarity", params.rarity);
  return get<PagedResponse<GachaPullHistoryResponse>>(`/api/gachabanners/history/admin?${qs}`);
};

export const getPlayerGachaStats = async (playerProfileId: number): Promise<PlayerGachaStatsResponse> => {
  return get<PlayerGachaStatsResponse>(`/api/gachabanners/history/admin/stats/${playerProfileId}`);
};