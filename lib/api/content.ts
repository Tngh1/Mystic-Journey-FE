import apiClient, { handleApiError } from "./client";

export interface ContentResponse {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnailUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface BlockResponse {
  id: number;
  title: string;
  contentId: number;
  contentData: string | null;
  mediaUrl: string | null;
  caption: string | null;
  blockType: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ContentDetailResponse extends ContentResponse {
  blocks: BlockResponse[];
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateContentRequest {
  title: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId?: number;
  isPublished?: boolean;
  isActive?: boolean;
}

export type UpdateContentRequest = CreateContentRequest;

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
}

export interface CreateBlockRequest {
  title: string;
  contentId: number;
  contentData?: string;
  mediaUrl?: string;
  caption?: string;
  blockType?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateBlockRequest = Partial<CreateBlockRequest>;

export const getById = async (id: number): Promise<ContentDetailResponse> => {
  try {
    const response = await apiClient.get<ContentDetailResponse>(`/api/contents/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getBySlug = async (slug: string): Promise<ContentDetailResponse> => {
  try {
    const response = await apiClient.get<ContentDetailResponse>(`/api/contents/slug/${slug}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: ContentResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: ContentResponse[] }>(
      `/api/contents?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await apiClient.get<CategoryResponse[]>("/api/contents/categories");
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateContentRequest): Promise<ContentResponse> => {
  try {
    const response = await apiClient.post<ContentResponse>("/api/contents", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateContentRequest): Promise<ContentResponse> => {
  try {
    const response = await apiClient.put<ContentResponse>(`/api/contents/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const publish = async (id: number): Promise<ContentResponse> => {
  try {
    const response = await apiClient.post<ContentResponse>(`/api/contents/${id}/publish`, {});
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createCategory = async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
  try {
    const response = await apiClient.post<CategoryResponse>("/api/contents/categories", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const createBlock = async (data: CreateBlockRequest): Promise<BlockResponse> => {
  try {
    const response = await apiClient.post<BlockResponse>("/api/contents/blocks", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const updateBlock = async (id: number, data: UpdateBlockRequest): Promise<BlockResponse> => {
  try {
    const response = await apiClient.put<BlockResponse>(`/api/contents/blocks/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const removeBlock = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/contents/blocks/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
