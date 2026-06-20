import { get } from "./client";
import type {
  DashboardStatsResponse,
} from "@/lib/types";

export const getStats = async (): Promise<DashboardStatsResponse> => {
  return get<DashboardStatsResponse>("/api/dashboard/stats");
};
