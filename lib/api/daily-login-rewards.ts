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


// ─── Player APIs ───────────────────────────────────────────────────────
// Retrieves daily login reward calendar for the current active month.
export const getDailyLoginRewardsCurrentMonth = async (
  month?: number | null,
  year?: number | null
): Promise<DailyLoginRewardResponse[]> => {
  const qs = new URLSearchParams();
  if (month != null) qs.set("month", String(month)); // Specify month filter
  if (year != null) qs.set("year", String(year)); // Specify year filter
  const query = qs.toString() ? `?${qs}` : "";
  return get<DailyLoginRewardResponse[]>(`/api/dailyloginrewards/current-month${query}`); // GET /api/dailyloginrewards/current-month
};


// Retrieves paginated list of configured daily login calendar days.
export const getAllDailyLoginRewards = async (
  page = 1,
  pageSize = 31,
  month?: number | null,
  year?: number | null
): Promise<PagedResponse<DailyLoginRewardResponse>> => {
  const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (month != null) qs.set("month", String(month)); // Filter by calendar month
  if (year != null) qs.set("year", String(year)); // Filter by calendar year
  return get<PagedResponse<DailyLoginRewardResponse>>(`/api/dailyloginrewards?${qs}`); // GET /api/dailyloginrewards
};

// Retrieves calendar days for a specific month and year.
export const getRewardsByMonth = async (
  month: number | null,
  year: number | null
): Promise<DailyLoginRewardResponse[]> => {
  const qs = new URLSearchParams();
  if (month != null) qs.set("month", String(month));
  if (year != null) qs.set("year", String(year));
  const query = qs.toString() ? `?${qs}` : "";
  return get<DailyLoginRewardResponse[]>(`/api/dailyloginrewards/by-month${query}`); // GET /api/dailyloginrewards/by-month
};

// Fetches reward definition for a specific calendar day by reward ID.
export const getById = async (id: number): Promise<DailyLoginRewardResponse> =>
  get<DailyLoginRewardResponse>(`/api/dailyloginrewards/${id}`); // Query reward record

// ─── Admin APIs ───────────────────────────────────────────────────────
// Creates a new calendar reward entry for a specific day of the month.
export const createDailyLoginReward = async (
  data: CreateDailyLoginRewardRequest
): Promise<DailyLoginRewardResponse> =>
  post<DailyLoginRewardResponse>("/api/dailyloginrewards", data); // POST /api/dailyloginrewards

// Updates reward items or quantities for a calendar day.
export const updateDailyLoginReward = async (
  id: number,
  data: UpdateDailyLoginRewardRequest
): Promise<DailyLoginRewardResponse> =>
  put<DailyLoginRewardResponse>(`/api/dailyloginrewards/${id}`, data); // PUT /api/dailyloginrewards/{id}

// Deletes a calendar reward slot.
export const deleteDailyLoginReward = async (id: number): Promise<void> => {
  await del(`/api/dailyloginrewards/${id}`); // DELETE /api/dailyloginrewards/{id}
};
