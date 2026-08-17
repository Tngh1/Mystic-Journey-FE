import { get, post, put, del } from "./client";
import type { ContentResponse, ContentDetailResponse, CategoryResponse, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse, CreateContentWithBlocksRequest } from "@/lib/types";
export type { ContentResponse, ContentDetailResponse, CategoryResponse, UpdateContentRequest, CreateCategoryRequest, CreateBlockRequest, UpdateBlockRequest, BlockResponse, PagedResponse, CreateContentWithBlocksRequest } from "@/lib/types";

// Fetches article content and structured layout blocks by content ID.
export const getById = async (id: number): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/${id}`); // Query article details
};

// Fetches public announcement or guide by slug string.
export const getBySlug = async (slug: string): Promise<ContentDetailResponse> => {
  return get<ContentDetailResponse>(`/api/contents/slug/${slug}`); // GET /api/contents/slug/{slug}
};

// Retrieves list of child content blocks (text, image, banner) for an article.
export const getBlocks = async (contentId: number): Promise<BlockResponse[]> => {
  const detail = await get<ContentDetailResponse>(`/api/contents/${contentId}`); // Query article
  return detail?.blocks ?? []; // Extract blocks array
};

// Retrieves paginated list of CMS articles with filter parameters.
export const getAll = async (page = 1, pageSize = 100, filters?: { search?: string; isPublished?: boolean; categoryId?: number }): Promise<PagedResponse<ContentResponse>> => {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters?.search) params.set("search", filters.search); // Append search keyword
  if (filters?.isPublished !== undefined) params.set("isPublished", String(filters.isPublished)); // Filter published status
  if (filters?.categoryId !== undefined) params.set("categoryId", String(filters.categoryId)); // Filter category ID
  return get<PagedResponse<ContentResponse>>(`/api/contents?${params}`); // GET /api/contents
};

// Retrieves all active content categories.
export const getCategories = async (): Promise<CategoryResponse[]> => {
  return get<CategoryResponse[]>("/api/contents/categories"); // GET /api/contents/categories
};

// ─── Admin APIs ───────────────────────────────────────────────────────
// Creates an article together with nested content blocks.
export const createWithBlocks = async (
  data: CreateContentWithBlocksRequest
): Promise<ContentDetailResponse> => {
  return post<ContentDetailResponse>("/api/contents/with-blocks", data); // POST /api/contents/with-blocks
};

// Updates article title, summary, or category.
export const update = async (id: number, data: UpdateContentRequest): Promise<ContentResponse> => {
  return put<ContentResponse>(`/api/contents/${id}`, data); // PUT /api/contents/{id}
};

// Toggles published visibility status for an article.
export const publish = async (id: number): Promise<ContentResponse> => {
  return post<ContentResponse>(`/api/contents/${id}/publish`, {}); // POST /api/contents/{id}/publish
};

// Creates a new content category.
export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  return post<CategoryResponse>("/api/contents/categories", data); // POST /api/contents/categories
};

// Appends a new layout block to an existing content article.
export const createBlock = async (data: CreateBlockRequest): Promise<BlockResponse> => {
  return post<BlockResponse>("/api/contents/blocks", data); // POST /api/contents/blocks
};

// Updates a content block's body text, styling, or asset URL.
export const updateBlock = async (id: number, data: UpdateBlockRequest): Promise<BlockResponse> => {
  return put<BlockResponse>(`/api/contents/blocks/${id}`, data); // PUT /api/contents/blocks/{id}
};

// Removes a content block from an article.
export const removeBlock = async (id: number): Promise<void> => {
  await del(`/api/contents/blocks/${id}`); // DELETE /api/contents/blocks/{id}
};

// Updates category name or description.
export const updateCategory = async (id: number, data: CreateCategoryRequest): Promise<CategoryResponse> => {
  return put<CategoryResponse>(`/api/contents/categories/${id}`, data); // PUT /api/contents/categories/{id}
};
