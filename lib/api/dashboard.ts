import apiClient, { handleApiError } from "./client";

export interface MonthlyStat {
  month: string;
  count: number;
  amount: number;
}

export interface DashboardStatsResponse {
  totalPlayers: number;
  totalAccounts: number;
  totalItems: number;
  totalMonsters: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyStats: MonthlyStat[];
}

export const getStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await apiClient.get<DashboardStatsResponse>("/api/dashboard/stats");
    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
