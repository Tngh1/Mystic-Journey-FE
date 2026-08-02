import { get, post, put, del } from "./client";
import type { ContentResponse, ContentDetailResponse, CategoryResponse, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse, CreateContentWithBlocksRequest } from "@/lib/types";
export type { ContentResponse, ContentDetailResponse, CategoryResponse, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse, CreateContentWithBlocksRequest } from "@/lib/types";

export const getById = async (id: number): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/${id}`);
};

export const getBySlug = async (slug: string): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/slug/${slug}`);
};

/**
 * Lấy danh sách block của một content thông qua detail endpoint
 * (BE không có endpoint GET list blocks riêng, nên phải gọi /api/contents/{id}).
 */
export const getBlocks = async (contentId: number): Promise<BlockResponse[]> => {
  const detail = await get<ContentDetailResponse>(`/api/contents/${contentId}`);
  return detail?.blocks ?? [];
};

export const getAll = async (page = 1, pageSize = 100, filters?: { search?: string; isPublished?: boolean; categoryId?: number }): Promise<PagedResponse<ContentResponse>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters?.search) params.set("search", filters.search);
  if (filters?.isPublished !== undefined) params.set("isPublished", String(filters.isPublished));
  if (filters?.categoryId !== undefined) params.set("categoryId", String(filters.categoryId));
  return get<PagedResponse<ContentResponse>>(`/api/contents?${params}`);
};

export const getCategories = async (): Promise<CategoryResponse[]> => {
  return get<CategoryResponse[]>("/api/contents/categories");
};

export const createWithBlocks = async (
  data: CreateContentWithBlocksRequest
): Promise<ContentDetailResponse> => {
  return post<ContentDetailResponse>("/api/contents/with-blocks", data);
};

export const update = async (id: number, data: UpdateContentRequest): Promise<ContentResponse> => {
  return put<ContentResponse>(`/api/contents/${id}`, data);
};

export const publish = async (id: number): Promise<ContentResponse> => {
  return post<ContentResponse>(`/api/contents/${id}/publish`, {});
};

export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  return post<CategoryResponse>("/api/contents/categories", data);
};

export const createBlock = async (data: CreateBlockRequest): Promise<BlockResponse> => {
  return post<BlockResponse>("/api/contents/blocks", data);
};

export const updateBlock = async (id: number, data: UpdateBlockRequest): Promise<BlockResponse> => {
  return put<BlockResponse>(`/api/contents/blocks/${id}`, data);
};

export const removeBlock = async (id: number): Promise<void> => {
  await del(`/api/contents/blocks/${id}`);
};

export const updateCategory = async (id: number, data: CreateCategoryRequest): Promise<CategoryResponse> => {
  return put<CategoryResponse>(`/api/contents/categories/${id}`, data);
};
