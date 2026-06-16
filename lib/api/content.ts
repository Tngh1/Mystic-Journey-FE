import { get, post, put, del } from "./client";
import type { ContentResponse, ContentDetailResponse, CategoryResponse, CreateContentRequest, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse } from "@/lib/types";
export type { ContentResponse, ContentDetailResponse, CategoryResponse, CreateContentRequest, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse } from "@/lib/types";

export const getById = async (id: number): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/${id}`);
};

export const getBySlug = async (slug: string): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/slug/${slug}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<ContentResponse>> => {
  return get<PagedResponse<ContentResponse>>(
    `/api/contents?page=${page}&pageSize=${pageSize}`
  );
};

export const getCategories = async (): Promise<CategoryResponse[]> => {
  return get<CategoryResponse[]>("/api/contents/categories");
};

export const create = async (data: CreateContentRequest): Promise<ContentResponse> => {
  return post<ContentResponse>("/api/contents", data);
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

export const getCategoriesPaged = async (page = 1, pageSize = 10): Promise<PagedResponse<CategoryResponse>> => {
  return get<PagedResponse<CategoryResponse>>(`/api/contents/categories-paged?page=${page}&pageSize=${pageSize}`);
};
