import apiClient, { handleApiError } from "./client";

export interface GachaBannerResponse {
  id: number;
  name: string;
  type: string;
  pullCost: number;
  pityLimit: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

export interface GachaBannerItemResponse {
  id: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  itemRarity: string | null;
  dropRate: number;
  isFeatured: boolean;
}

export interface GachaBannerDetailResponse extends GachaBannerResponse {
  bannerItems: GachaBannerItemResponse[];
}

export interface CreateGachaBannerRequest {
  name: string;
  type?: string;
  pullCost?: number;
  pityLimit?: number;
  isActive?: boolean;
  startAt: string;
  endAt: string;
}

export type UpdateGachaBannerRequest = CreateGachaBannerRequest;

export const getById = async (id: number): Promise<GachaBannerDetailResponse> => {
  try {
    const response = await apiClient.get<GachaBannerDetailResponse>(`/api/gacha-banners/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: GachaBannerResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: GachaBannerResponse[] }>(
      `/api/gacha-banners?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAllItems = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: GachaBannerItemResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: GachaBannerItemResponse[] }>(
      `/api/gacha-banners/items-paged?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateGachaBannerRequest): Promise<GachaBannerResponse> => {
  try {
    const response = await apiClient.post<GachaBannerResponse>("/api/gacha-banners", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateGachaBannerRequest): Promise<GachaBannerResponse> => {
  try {
    const response = await apiClient.put<GachaBannerResponse>(`/api/gacha-banners/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const addBannerItem = async (bannerId: number, data: { itemId: number; dropRate: number; isFeatured?: boolean }): Promise<GachaBannerItemResponse> => {
  try {
    const response = await apiClient.post<GachaBannerItemResponse>(`/api/gacha-banners/${bannerId}/items`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/gacha-banners/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
