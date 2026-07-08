"use client";

import Link from "next/link";
import {
  Plus,
  Shield,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Calendar,
  Users,
  Crown,
  Filter,
  Activity,
  Inbox,
} from "lucide-react";
import type { AccountAdminResponse } from "@/lib/api/admin-accounts";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { useState, useMemo } from "react";

const ROLE_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  "Super Admin": { color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  Admin: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  Player: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ManageAdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  const buildParams = () => {
    const params: Record<string, string | number | boolean | undefined> = { roleName: "Admin" };
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (statusFilter !== "all") params.isActive = statusFilter === "active";
    return params;
  };

  const {
    data: admins,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<AccountAdminResponse>({
    endpoint: "/api/adminaccounts",
    pageSize: 10,
    params: buildParams(),
  });

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setParams(buildParams());
  };

  const handleStatusFilter = (status: "all" | "active" | "inactive") => {
    setStatusFilter(status);
    setParams(buildParams());
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setParams({ roleName: "Admin" });
    setPage(1);
  };

  const activeFiltersCount =
    (searchTerm ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  const stats = useMemo(() => {
    const active = admins.filter((a) => a.isActive).length;
    const inactive = admins.length - active;
    return { total: totalCount, active, inactive };
  }, [admins, totalCount]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffc032]/20">
            <Shield className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Admins</h1>
            <p className="text-sm text-gray-500">
              Manage admin and moderator accounts
            </p>
          </div>
        </div>
        <Link
          href="/manage-admins/create"
          className="flex items-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#ffd04c] transition-colors shadow-lg shadow-[#ffc032]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc032]/15 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-[#ffc032]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Admins</p>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.active.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-gray-500/15 flex items-center justify-center shrink-0">
            <X className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.inactive.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Inactive</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
            {searchTerm && (
              <button
                aria-label="Clear search"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#ffc032]/10 border-[#ffc032]/40 text-[#ffc032]"
                  : "bg-[#111] border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#ffc032] text-[#111] text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 text-gray-500 hover:text-red-400 text-sm transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Status
            </label>
            <div className="flex rounded-xl bg-[#111] p-1 gap-1 border border-gray-800 max-w-md">
              {[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    handleStatusFilter(opt.value as "all" | "active" | "inactive")
                  }
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    statusFilter === opt.value
                      ? "bg-[#ffc032] text-[#111]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <button
            onClick={refresh}
            className="text-red-300 text-sm underline hover:text-red-200 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-[#161616]">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#ffc032]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading admins...</span>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center">
                        <Shield className="w-7 h-7 text-gray-700" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No admins found</p>
                      <p className="text-xs text-gray-600">
                        Try a different search or status filter
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const roleCfg = ROLE_CONFIG[admin.roleName] ?? ROLE_CONFIG["Admin"];
                  return (
                    <tr
                      key={admin.accountId}
                      className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center shrink-0 border border-red-500/30">
                            <Shield className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {admin.userName}
                            </p>
                            <p className="text-xs text-gray-600 font-mono">
                              #{admin.accountId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                          <p className="text-sm text-gray-400 truncate max-w-[220px]">
                            {admin.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}
                        >
                          <Crown className="w-3 h-3" />
                          {admin.roleName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            admin.isActive
                              ? "bg-green-500/15 text-green-400 border-green-500/30"
                              : "bg-red-500/15 text-red-400 border-red-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              admin.isActive ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(admin.createdAt)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/manage-admins/update?id=${admin.accountId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-lg text-xs font-semibold transition-all"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          Update
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-800 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Page <span className="text-white">{page}</span> of{" "}
              <span className="text-white">{totalPages}</span> ·{" "}
              <span className="text-white">{totalCount.toLocaleString()}</span>{" "}
              total
            </div>
            <div className="flex items-center gap-2">
              <select
                aria-label="Page size"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-3 py-1.5 bg-[#111] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ffc032] cursor-pointer"
              >
                {[10, 25, 50].map((s) => (
                  <option key={s} value={s}>
                    {s} / page
                  </option>
                ))}
              </select>
              <button
                aria-label="Previous page"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 px-3 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-gray-800 cursor-pointer"
              >
                ←
              </button>
              <span className="px-2 py-1 text-xs text-white bg-[#111] border border-gray-800 rounded-lg min-w-12.5 text-center">
                {page} / {totalPages}
              </span>
              <button
                aria-label="Next page"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 px-3 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-gray-800"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
