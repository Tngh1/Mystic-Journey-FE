import { get } from "./client";
import type {
  DashboardStatsResponse,
} from "@/lib/types";

// ─── Admin APIs ───────────────────────────────────────────────────────
// Load the player's base stats with buffs and achievements, apply the saved equipment snapshot and achievement bonuses, then return the effective stat response.
export const getStats = async (): Promise<DashboardStatsResponse> => {
  return get<DashboardStatsResponse>("/api/dashboard/stats");
};
