import apiClient, { handleApiError } from "./client";

export interface AccountAdminResponse {
  accountId: number;
  userName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  playerProfileId: number | null;
  playerDisplayName: string | null;
}

export interface CreateAdminAccountRequest {
  userName: string;
  email: string;
  password: string;
  roleId: number;
  displayName?: string;
  playerClass?: string;
  isActive?: boolean;
}

export interface UpdateAdminAccountRequest {
  fullName?: string;
  email?: string;
  roleId?: number;
  isActive?: boolean;
  newPassword?: string;
}

export const getById = async (id: number): Promise<AccountAdminResponse> => {
  try {
    const response = await apiClient.get<AccountAdminResponse>(`/api/admin-accounts/${id}`);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const getAll = async (page = 1, pageSize = 10): Promise<{ totalCount: number; items: AccountAdminResponse[] }> => {
  try {
    const response = await apiClient.get<{ totalCount: number; items: AccountAdminResponse[] }>(
      `/api/admin-accounts?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const create = async (data: CreateAdminAccountRequest): Promise<AccountAdminResponse> => {
  try {
    const response = await apiClient.post<AccountAdminResponse>("/api/admin-accounts", data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const update = async (id: number, data: UpdateAdminAccountRequest): Promise<AccountAdminResponse> => {
  try {
    const response = await apiClient.put<AccountAdminResponse>(`/api/admin-accounts/${id}`, data);
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const remove = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/admin-accounts/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
