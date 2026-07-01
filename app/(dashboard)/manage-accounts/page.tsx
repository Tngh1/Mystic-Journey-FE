"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Search,
  Loader2,
  UserCog,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  X,
  Sword,
  Shield,
  Target,
  Heart,
  Zap,
  Trophy,
  Mail,
  Calendar,
  Activity,
  Filter,
  Crown,
  Sparkles,
  Inbox,
  Coins,
  Gem,
  Users,
} from "lucide-react";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import apiClient from "@/lib/api/client";
import type { PlayerProfileResponse, PlayerStatsResponse } from "@/lib/types";

interface AccountWithPlayer {
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

const ROLES = ["Super Admin", "Admin", "Player", "Guest"];

const ROLE_CONFIG: Record<
  string,
  { icon: typeof Crown; color: string; bg: string; border: string }
> = {
  "Super Admin": { icon: Crown, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  Admin: { icon: Shield, color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  Player: { icon: UserCog, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
  Guest: { icon: Users, color: "text-gray-400", bg: "bg-gray-500/15", border: "border-gray-500/30" },
};

const CLASS_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; emoji: string }
> = {
  Knight: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", emoji: "⚔️" },
  Mage: { color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30", emoji: "🔮" },
  Archer: { color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30", emoji: "🏹" },
};

function formatDate(dateString: string | null) {
  if (!dateString) return "Never";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ManageAccountsPage() {
  const {
    data: accounts,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<AccountWithPlayer>({
    endpoint: "/api/adminaccounts",
    pageSize: 10,
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [banningId, setBanningId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [viewingAccount, setViewingAccount] = useState<AccountWithPlayer | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfileResponse | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStatsResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = totalCount;
    const active = accounts.filter((a) => a.isActive).length;
    const banned = accounts.filter((a) => !a.isActive).length;
    const withProfile = accounts.filter((a) => a.playerProfileId).length;
    return { total, active, banned, withProfile };
  }, [accounts, totalCount]);

  const activeFiltersCount =
    (searchKeyword ? 1 : 0) + (selectedRole ? 1 : 0);

  const buildParams = (overrides: Record<string, unknown> = {}) => ({
    ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}),
    ...(selectedRole ? { roleName: selectedRole } : {}),
    ...overrides,
  });

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setParams(buildParams({}));
  };

  const handleRoleFilter = (role: string) => {
    const next = selectedRole === role ? "" : role;
    setSelectedRole(next);
    setParams(
      next
        ? { ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}), roleName: next }
        : { ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}) }
    );
  };

  const clearAllFilters = () => {
    setSearchKeyword("");
    setSelectedRole("");
    setParams({});
    setPage(1);
  };

  const handleBan = async (account: AccountWithPlayer) => {
    if (!account.accountId) return;
    try {
      setBanningId(account.accountId);
      if (account.isActive) {
        await apiClient.post(`/api/adminaccounts/${account.accountId}/ban`);
        await showSuccessAlert(
          "Banned!",
          `Account "${account.userName}" has been banned.`
        );
      } else {
        await apiClient.post(`/api/adminaccounts/${account.accountId}/unban`);
        await showSuccessAlert(
          "Unbanned!",
          `Account "${account.userName}" has been unbanned.`
        );
      }
      refresh();
    } catch (err) {
      await showErrorAlert(
        "Error",
        err instanceof Error ? err.message : "Action failed."
      );
    } finally {
      setBanningId(null);
    }
  };

  const handleViewProfile = useCallback(async (account: AccountWithPlayer) => {
    setViewingAccount(account);
    setPlayerProfile(null);
    setPlayerStats(null);
    setProfileError(null);

    if (!account.playerProfileId) return;

    setLoadingProfile(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        apiClient.get<PlayerProfileResponse>(
          `/api/playerprofiles/${account.playerProfileId}`
        ),
        apiClient
          .get<PlayerStatsResponse>(
            `/api/playerprofiles/${account.playerProfileId}/stats`
          )
          .catch(() => null),
      ]);
      setPlayerProfile(profileRes.data);
      setPlayerStats(statsRes?.data ?? null);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to load player profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const closeModal = () => {
    setViewingAccount(null);
    setPlayerProfile(null);
    setPlayerStats(null);
    setProfileError(null);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffc032]/20">
            <UserCog className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Accounts</h1>
            <p className="text-sm text-gray-500">View and manage all user accounts</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc032]/15 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-[#ffc032]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Accounts</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.active.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <Ban className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.banned.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Banned</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.withProfile.toLocaleString()}</p>
            <p className="text-xs text-gray-500">With Profile</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
            {searchKeyword && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setSearchKeyword("");
                  setParams(
                    selectedRole ? { roleName: selectedRole } : {}
                  );
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
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
                className="px-3 py-2.5 text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Role
            </label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((role) => {
                const cfg = ROLE_CONFIG[role];
                const RoleIcon = cfg.icon;
                const active = selectedRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleFilter(role)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      active
                        ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                        : "bg-[#111] border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                    }`}
                  >
                    <RoleIcon className="w-4 h-4" />
                    {role}
                    {active && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm flex-1">{error}</p>
        </div>
      )}

      {/* Table */}
      {loading && accounts.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-4">
            <UserCog className="w-7 h-7 text-gray-700" />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">No accounts found</p>
          <p className="text-xs text-gray-600">
            Try a different search keyword or role filter
          </p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#161616]">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  const roleCfg =
                    ROLE_CONFIG[account.roleName] ?? ROLE_CONFIG["Player"];
                  const RoleIcon = roleCfg.icon;
                  return (
                    <tr
                      key={account.accountId}
                      className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center shrink-0 border border-gray-800">
                            <RoleIcon className={`w-4 h-4 ${roleCfg.color}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {account.userName}
                            </p>
                            <p className="text-xs text-gray-600 font-mono">
                              #{account.accountId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-400 truncate max-w-[200px]">
                          {account.email}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          {account.roleName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {account.playerProfileId ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                            <CheckCircle className="w-3 h-3" />
                            {account.playerDisplayName || "Active"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-semibold">
                            <AlertCircle className="w-3 h-3" />
                            No Profile
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            account.isActive
                              ? "bg-green-500/15 text-green-400 border-green-500/30"
                              : "bg-red-500/15 text-red-400 border-red-500/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              account.isActive ? "bg-green-400" : "bg-red-400"
                            }`}
                          />
                          {account.isActive ? "Active" : "Banned"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-gray-500">
                          {formatDate(account.lastLogin)}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewProfile(account)}
                            className="p-2 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-lg transition-colors"
                            aria-label="View profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {account.roleName === "Player" && (
                            <button
                              onClick={() => handleBan(account)}
                              disabled={banningId === account.accountId}
                              className={`p-2 rounded-lg border transition-colors disabled:opacity-50 ${
                                account.isActive
                                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                              }`}
                              aria-label={account.isActive ? "Ban account" : "Unban account"}
                              title={account.isActive ? "Ban" : "Unban"}
                            >
                              {banningId === account.accountId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : account.isActive ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                  className="px-3 py-1.5 bg-[#111] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-[#ffc032]"
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
                  className="p-1.5 px-3 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-gray-800"
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
      )}

      {/* Player Profile Modal */}
      {viewingAccount && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Account Profile</h2>
                <p className="text-sm text-gray-400">
                  {viewingAccount.userName} — {viewingAccount.email}
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingProfile ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
                </div>
              ) : profileError ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-red-400 text-sm flex-1">{profileError}</p>
                </div>
              ) : !viewingAccount.playerProfileId ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                    <AlertCircle className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Character Created
                  </h3>
                  <p className="text-gray-400 mb-1">
                    This account does not have a Player Profile yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    The player needs to complete the character creation process.
                  </p>
                </div>
              ) : playerProfile ? (
                <div className="space-y-5">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 bg-[#111] border border-gray-800 rounded-xl p-4">
                    <div className="w-16 h-16 rounded-full bg-[#ffc032]/15 flex items-center justify-center overflow-hidden border-2 border-[#ffc032]/40 shrink-0">
                      {playerProfile.avatarUrl ? (
                        <img
                          src={playerProfile.avatarUrl}
                          alt={playerProfile.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">
                          {CLASS_CONFIG[playerProfile.playerClass]?.emoji ?? "👤"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-white truncate">
                        {playerProfile.displayName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            CLASS_CONFIG[playerProfile.playerClass]?.color ??
                            "text-gray-300"
                          } ${
                            CLASS_CONFIG[playerProfile.playerClass]?.bg ??
                            "bg-gray-500/15"
                          } ${
                            CLASS_CONFIG[playerProfile.playerClass]?.border ??
                            "border-gray-500/30"
                          }`}
                        >
                          <span>
                            {CLASS_CONFIG[playerProfile.playerClass]?.emoji}
                          </span>
                          {playerProfile.playerClass}
                        </span>
                        <span className="text-[#ffc032] font-semibold text-sm">
                          Lv. {playerProfile.level}
                        </span>
                        {playerProfile.isBanned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="w-3 h-3 text-yellow-400" />
                        Gold
                      </p>
                      <p className="text-lg font-bold text-yellow-400">
                        {Number(playerProfile.gold).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Gem className="w-3 h-3 text-blue-400" />
                        Gems
                      </p>
                      <p className="text-lg font-bold text-blue-400">
                        {Number(playerProfile.gems).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-green-400" />
                        Energy
                      </p>
                      <p className="text-lg font-bold text-green-400">
                        {playerProfile.energy}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  {playerStats && (
                    <div className="bg-[#111] border border-gray-800 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Combat Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <StatRow
                          icon={Heart}
                          color="text-red-400"
                          label="HP"
                          value={`${playerStats.currentHp} / ${playerStats.maxHp}`}
                        />
                        <StatRow
                          icon={Sword}
                          color="text-orange-400"
                          label="Attack"
                          value={playerStats.atk}
                        />
                        <StatRow
                          icon={Shield}
                          color="text-blue-400"
                          label="Defense"
                          value={playerStats.def}
                        />
                        <StatRow
                          icon={Target}
                          color="text-pink-400"
                          label="Crit Rate"
                          value={`${playerStats.critRate}%`}
                        />
                        <StatRow
                          icon={Zap}
                          color="text-yellow-400"
                          label="Crit DMG"
                          value={`${playerStats.critDamage}%`}
                        />
                        <StatRow
                          icon={Trophy}
                          color="text-purple-400"
                          label="Wins / Losses"
                          value={`${playerStats.totalWins} / ${playerStats.totalLosses}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timeline
                    </h4>
                    <div className="space-y-2">
                      <TimelineRow
                        icon={Calendar}
                        label="Created"
                        value={formatDate(playerProfile.createdAt)}
                      />
                      <TimelineRow
                        icon={Activity}
                        label="Last Updated"
                        value={formatDate(playerProfile.updatedAt)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Heart;
  color: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 bg-[#1a1a1a] rounded-lg">
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <span className="text-xs text-gray-400">{label}:</span>
      <span className="text-sm font-semibold text-white ml-auto">{value}</span>
    </div>
  );
}

function TimelineRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#1a1a1a] rounded-lg">
      <span className="text-xs text-gray-400 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-sm font-medium text-white text-right">{value}</span>
    </div>
  );
}
