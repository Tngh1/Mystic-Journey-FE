import { get, post, put } from "./client";
import type {
  GachaBannerResponse,
  GachaBannerDetailResponse,
  GachaBannerItemResponse,
  CreateGachaBannerRequest,
  UpdateGachaBannerRequest,
  AddGachaBannerItemRequest,
  PagedResponse,
} from "@/lib/types";

export const getById = async (id: number): Promise<GachaBannerDetailResponse> => {
  return get<GachaBannerDetailResponse>(`/api/gachabanners/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<GachaBannerResponse>> => {
  return get<PagedResponse<GachaBannerResponse>>(
    `/api/gachabanners?page=${page}&pageSize=${pageSize}`
  );
};

export const getAllItems = async (page = 1, pageSize = 10): Promise<PagedResponse<GachaBannerItemResponse>> => {
  return get<PagedResponse<GachaBannerItemResponse>>(
    `/api/gachabanners/items-paged?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return post<GachaBannerResponse>("/api/gachabanners", data);
};

export const update = async (id: number, data: UpdateGachaBannerRequest): Promise<GachaBannerResponse> => {
  return put<GachaBannerResponse>(`/api/gachabanners/${id}`, data);
};

export const addBannerItem = async (bannerId: number, data: AddGachaBannerItemRequest): Promise<GachaBannerItemResponse> => {
  return post<GachaBannerItemResponse>(`/api/gachabanners/${bannerId}/items`, data);
};
