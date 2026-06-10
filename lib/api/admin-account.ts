import { get, post, put, del } from "./client";
import type {
  AccountAdminResponse,
  CreateAdminAccountRequest,
  UpdateAdminAccountRequest,
  PagedResponse,
} from "@/lib/types";

export const getById = async (id: number): Promise<AccountAdminResponse> => {
  return get<AccountAdminResponse>(`/api/adminaccounts/${id}`);
};

export const getAll = async (page = 1, pageSize = 10): Promise<PagedResponse<AccountAdminResponse>> => {
  return get<PagedResponse<AccountAdminResponse>>(
    `/api/adminaccounts?page=${page}&pageSize=${pageSize}`
  );
};

export const create = async (data: CreateAdminAccountRequest): Promise<AccountAdminResponse> => {
  return post<AccountAdminResponse>("/api/adminaccounts", data);
};

export const update = async (id: number, data: UpdateAdminAccountRequest): Promise<AccountAdminResponse> => {
  return put<AccountAdminResponse>(`/api/adminaccounts/${id}`, data);
};
