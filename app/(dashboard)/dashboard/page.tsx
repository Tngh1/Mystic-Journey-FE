"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/api/dashboard";
import { Loader2 } from "lucide-react";

interface DashboardStats {
  totalPlayers: number;
  totalAccounts: number;
  totalItems: number;
  totalMonsters: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyStats: Array<{ month: string; count: number; amount: number }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc032]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-red-400">
          {error || "No data available"}
        </div>
      </div>
    );
  }

  const topMonths = stats.monthlyStats.slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/50 text-sm">Overview of the Mystic Journey game system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Players</p>
          <p className="text-2xl font-bold text-white">{stats.totalPlayers.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Accounts</p>
          <p className="text-2xl font-bold text-white">{stats.totalAccounts.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Items</p>
          <p className="text-2xl font-bold text-white">{stats.totalItems.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Monsters</p>
          <p className="text-2xl font-bold text-white">{stats.totalMonsters.toLocaleString()}</p>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-[#ffc032]">
            ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-1">Avg Revenue</p>
          <p className="text-2xl font-bold text-[#ffc032]">
            ${stats.totalTransactions > 0
              ? (stats.totalRevenue / stats.totalTransactions).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : "0.00"}
          </p>
        </div>
      </div>

      {/* Monthly Stats Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Monthly Statistics</h2>
        {topMonths.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-sm font-medium pb-3">Month</th>
                  <th className="text-right text-white/50 text-sm font-medium pb-3">Transactions</th>
                  <th className="text-right text-white/50 text-sm font-medium pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topMonths.map((month, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 text-white">{month.month}</td>
                    <td className="py-3 text-right text-white">{month.count.toLocaleString()}</td>
                    <td className="py-3 text-right text-[#ffc032] font-semibold">
                      ${month.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/40 text-sm text-center py-4">No monthly data available.</p>
        )}
      </div>
    </div>
  );
}
