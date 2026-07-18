import { get, post, put, del } from "./client";
import type {
  DailyLoginRewardResponse,
  CreateDailyLoginRewardRequest,
  UpdateDailyLoginRewardRequest,
  PagedResponse,
} from "@/lib/types";

export type {
  DailyLoginRewardResponse,
  CreateDailyLoginRewardRequest,
  UpdateDailyLoginRewardRequest,
} from "@/lib/types";

// ── GAME API ──────────────────────────────────────────────────────────────────

export const getDailyLoginRewardsCurrentMonth = async (
  month?: number | null,
  year?: number | null
): Promise<DailyLoginRewardResponse[]> => {
  const qs = new URLSearchParams();
  if (month != null) qs.set("month", String(month));
  if (year != null) qs.set("year", String(year));
  const query = qs.toString() ? `?${qs}` : "";
  return get<DailyLoginRewardResponse[]>(`/api/dailyloginrewards/current-month${query}`);
};

// ── ADMIN APIs ────────────────────────────────────────────────────────────────

// Lấy danh sách phân trang (month=null → defaults, month+year → overrides tháng đó)
export const getAllDailyLoginRewards = async (
  page = 1,
  pageSize = 31,
  month?: number | null,
  year?: number | null
): Promise<PagedResponse<DailyLoginRewardResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (month != null) qs.set("month", String(month));
  if (year != null) qs.set("year", String(year));
  return get<PagedResponse<DailyLoginRewardResponse>>(`/api/dailyloginrewards?${qs}`);
};

// Lấy 31 ô calendar của 1 tháng (bao gồm fallback về default)
// month=null/year=null → lấy bộ Default
export const getRewardsByMonth = async (
  month: number | null,
  year: number | null
): Promise<DailyLoginRewardResponse[]> => {
  const qs = new URLSearchParams();
  if (month != null) qs.set("month", String(month));
  if (year != null) qs.set("year", String(year));
  const query = qs.toString() ? `?${qs}` : "";
  return get<DailyLoginRewardResponse[]>(`/api/dailyloginrewards/by-month${query}`);
};

export const getById = async (id: number): Promise<DailyLoginRewardResponse> =>
  get<DailyLoginRewardResponse>(`/api/dailyloginrewards/${id}`);

export const createDailyLoginReward = async (
  data: CreateDailyLoginRewardRequest
): Promise<DailyLoginRewardResponse> =>
  post<DailyLoginRewardResponse>("/api/dailyloginrewards", data);

export const updateDailyLoginReward = async (
  id: number,
  data: UpdateDailyLoginRewardRequest
): Promise<DailyLoginRewardResponse> =>
  put<DailyLoginRewardResponse>(`/api/dailyloginrewards/${id}`, data);

export const deleteDailyLoginReward = async (id: number): Promise<void> => {
  await del(`/api/dailyloginrewards/${id}`);
};