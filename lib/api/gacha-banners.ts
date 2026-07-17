import { get, put } from "./client";
import type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse } from "@/lib/types";
export type { GachaBannerResponse, GachaBannerDetailResponse, GachaBannerItemResponse, UpdateGachaBannerRequest, PagedResponse } from "@/lib/types";

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

export const update = async (id: number, data: UpdateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return put<GachaBannerResponse>(`/api/gachabanners/${id}`, data);
};