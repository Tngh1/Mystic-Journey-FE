"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/api/dashboard";
import PageLoader from "@/components/ui/PageLoader";
import {
  Users, UserCircle, Package, Ghost, CreditCard, DollarSign,
  TrendingUp, BarChart3, LayoutDashboard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import MonthlyChart from "@/components/ui/MonthlyChart";

interface DashboardStats {
  totalPlayers: number;
  totalAccounts: number;
  totalItems: number;
  totalMonsters: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyStats: Array<{ month: string; count: number; amount: number }>;
}

interface StatCardData {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "default" | "gold";
}

function StatCard({ label, value, icon: Icon, tone }: StatCardData) {
  const iconClass =
    tone === "gold"
      ? "bg-[#ffc032]/10 text-[#ffc032]"
      : "bg-white/5 text-white/70";
  const valueClass = tone === "gold" ? "text-[#ffc032]" : "text-white";
  return (
    <div className="group bg-[#111111] border border-white/10 rounded-2xl p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-white/50 text-sm mb-1.5 truncate">{label}</p>
          <p className={`text-2xl font-bold truncate ${valueClass}`}>{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
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
    return <PageLoader />;
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
  // Chart reads left→right as oldest→newest (table shows newest first).
  const chartData = [...topMonths].reverse();
  const avgRevenue =
    stats.totalTransactions > 0 ? stats.totalRevenue / stats.totalTransactions : 0;
  const fmtMoney = (n: number) =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const entityStats: StatCardData[] = [
    { label: "Total Players", value: stats.totalPlayers.toLocaleString(), icon: Users, tone: "default" },
    { label: "Total Accounts", value: stats.totalAccounts.toLocaleString(), icon: UserCircle, tone: "default" },
    { label: "Total Items", value: stats.totalItems.toLocaleString(), icon: Package, tone: "default" },
    { label: "Total Monsters", value: stats.totalMonsters.toLocaleString(), icon: Ghost, tone: "default" },
  ];

  const revenueStats: StatCardData[] = [
    { label: "Total Transactions", value: stats.totalTransactions.toLocaleString(), icon: CreditCard, tone: "default" },
    { label: "Total Revenue", value: fmtMoney(stats.totalRevenue), icon: DollarSign, tone: "gold" },
    { label: "Avg Revenue / Txn", value: fmtMoney(avgRevenue), icon: TrendingUp, tone: "gold" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffc032]/20">
          <LayoutDashboard className="w-7 h-7 text-[#111]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/50 text-sm mt-0.5">Overview of the Mystic Journey game system.</p>
        </div>
      </div>

      {/* Entity stats */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Game Entities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {entityStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* Revenue stats */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Economy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {revenueStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* Monthly Chart */}
      {topMonths.length > 0 && (
        <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#ffc032]" />
            <h2 className="text-lg font-bold text-white">Monthly Overview</h2>
          </div>
          <MonthlyChart
            categories={chartData.map((m) => m.month)}
            transactions={chartData.map((m) => m.count)}
            revenue={chartData.map((m) => m.amount)}
          />
        </section>
      )}

      {/* Monthly Stats Table */}
      <section className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[#ffc032]" />
          <h2 className="text-lg font-bold text-white">Monthly Statistics</h2>
        </div>
        {topMonths.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs font-semibold uppercase tracking-wider pb-3">Month</th>
                  <th className="text-right text-white/50 text-xs font-semibold uppercase tracking-wider pb-3">Transactions</th>
                  <th className="text-right text-white/50 text-xs font-semibold uppercase tracking-wider pb-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topMonths.map((month, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 text-white">{month.month}</td>
                    <td className="py-3 text-right text-white">{month.count.toLocaleString()}</td>
                    <td className="py-3 text-right text-[#ffc032] font-semibold">
                      {fmtMoney(month.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/40 text-sm text-center py-4">No monthly data available.</p>
        )}
      </section>
    </div>
  );
}
