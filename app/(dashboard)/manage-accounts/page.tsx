"use client";

import { useState, useCallback } from "react";
import {
  Loader2, UserCog, Eye, Ban, CheckCircle, AlertCircle, X,
  Sword, Shield, Target, Heart, Zap, Trophy, Calendar, Activity,
  Coins, Gem, Users,
} from "lucide-react";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { showSuccessAlert, showErrorAlert, showConfirmAlert, showBanReasonPrompt } from "@/lib/utils/swal";
import apiClient, { get } from "@/lib/api/client";
import type { PlayerProfileResponse, PlayerStatsResponse } from "@/lib/types";
import AdminTable from "@/components/ui/AdminTable";
import PageHeader from "@/components/ui/PageHeader";
import FilterSortBar from "@/components/ui/FilterSortBar";

interface AccountWithPlayer {
  accountId: number;
  userName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  banReason: string | null;
  createdAt: string;
  playerProfileId: number | null;
  playerDisplayName: string | null;
  playerClass: string | null;
  playerLevel: number | null;
}

/* Không còn "Super Admin": role đã bỏ ở BE. Admin vẫn giữ trong bảng tra vì
   BE trả về roleName thật, và nếu DB còn hàng Admin cũ thì vẫn cần render được
   thay vì rơi về badge Player gây hiểu sai. */
const ROLE_CONFIG: Record<
  string,
  { icon: typeof Shield; color: string; bg: string; border: string }
> = {
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("accountId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [banningId, setBanningId] = useState<number | null>(null);

  const [viewingAccount, setViewingAccount] = useState<AccountWithPlayer | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfileResponse | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStatsResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Không gửi roleName: BE đã khoá danh sách ở Player và bỏ hẳn tham số đó.
  const buildParams = (overrides: Record<string, string | number | boolean | undefined> = {}) => ({
    ...(searchKeyword.trim() ? { search: searchKeyword.trim() } : {}),
    sortBy,
    sortOrder,
    ...overrides,
  });

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
    params: buildParams(),
  });

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPage(1);
    setParams(buildParams({ search: value.trim() || undefined }));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  const handleBan = async (account: AccountWithPlayer) => {
    if (!account.accountId) return;

    const isBanning = account.isActive;

    if (isBanning) {
      // Prompt nhập lý do — null nghĩa là admin đã huỷ
      const reason = await showBanReasonPrompt(account.userName);
      if (reason === null) return;

      try {
        setBanningId(account.accountId);
        await apiClient.post(`/api/adminaccounts/${account.accountId}/ban`, { banReason: reason || null });
        await showSuccessAlert("Banned!", `Account "${account.userName}" has been banned.`);
      } catch (err) {
        await showErrorAlert("Error", err instanceof Error ? err.message : "Action failed.");
      } finally {
        setBanningId(null);
        refresh();
      }
    } else {
      const confirm = await showConfirmAlert(
        "Unban Account",
        `Are you sure you want to unban "${account.userName}"? The player will regain access to the game.`,
        "Yes, Unban Account",
        "Cancel"
      );
      if (!confirm) return;

      try {
        setBanningId(account.accountId);
        await apiClient.post(`/api/adminaccounts/${account.accountId}/unban`);
        await showSuccessAlert("Unbanned!", `Account "${account.userName}" has been unbanned.`);
      } catch (err) {
        await showErrorAlert("Error", err instanceof Error ? err.message : "Action failed.");
      } finally {
        setBanningId(null);
        refresh();
      }
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
      const [profileData, statsData] = await Promise.all([
        get<PlayerProfileResponse>(`/api/playerprofiles/${account.playerProfileId}`),
        get<PlayerStatsResponse>(`/api/playerprofiles/${account.playerProfileId}/stats`).catch(() => null),
      ]);
      setPlayerProfile(profileData);
      setPlayerStats(statsData);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to load player profile.");
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

  const columns = [
    {
      key: "userName",
      label: "User",
      sortable: true,
      render: (_: unknown, account: AccountWithPlayer) => {
        const roleCfg = ROLE_CONFIG[account.roleName] ?? ROLE_CONFIG["Player"];
        const RoleIcon = roleCfg.icon;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#222] flex items-center justify-center shrink-0 border border-white/10">
              <RoleIcon className={`w-4 h-4 ${roleCfg.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{account.userName}</p>
              <p className="text-xs text-gray-600 font-mono">#{account.accountId}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      render: (val: string) => (
        <p className="text-sm text-gray-400 truncate max-w-[200px]">{val}</p>
      ),
    },
    {
      key: "roleName",
      label: "Role",
      sortable: true,
      render: (val: string) => {
        const roleCfg = ROLE_CONFIG[val] ?? ROLE_CONFIG["Player"];
        const RoleIcon = roleCfg.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleCfg.bg} ${roleCfg.color} ${roleCfg.border}`}>
            <RoleIcon className="w-3 h-3" />
            {val}
          </span>
        );
      },
    },
    {
      key: "playerProfileId",
      label: "Character & Class",
      sortable: false,
      render: (_: unknown, account: AccountWithPlayer) => {
        if (!account.playerProfileId) {
          return (
            <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              No Character
            </span>
          );
        }
        const clsName = account.playerClass || "Knight";
        const clsCfg = CLASS_CONFIG[clsName] ?? CLASS_CONFIG["Knight"];

        return (
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
              {account.playerDisplayName || "Active"}
            </span>
            <div className="flex items-center gap-1.5 text-xs flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${clsCfg.bg} ${clsCfg.color} ${clsCfg.border}`}
              >
                <span>{clsCfg.emoji}</span>
                {clsName}
              </span>
              {account.playerLevel != null && (
                <span className="text-[#ffc032] font-semibold text-[11px]">
                  Lv. {account.playerLevel}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (val: boolean, account: AccountWithPlayer) => (
        <div className="flex flex-col gap-1 min-w-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border w-fit ${
            val ? "bg-green-500/15 text-green-400 border-green-500/30" : "bg-red-500/15 text-red-400 border-red-500/30"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${val ? "bg-green-400" : "bg-red-400"}`} />
            {val ? "Active" : "Banned"}
          </span>
          {!val && account.banReason && (
            <p className="text-[11px] text-gray-500 truncate max-w-[180px]" title={account.banReason}>
              {account.banReason}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: unknown, account: AccountWithPlayer) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleViewProfile(account)}
            className="p-2 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-lg transition-colors cursor-pointer"
            aria-label="View profile"
          >
            <Eye className="w-4 h-4" />
          </button>
          {account.roleName === "Player" && (
            <button
              type="button"
              onClick={() => handleBan(account)}
              disabled={banningId === account.accountId}
              className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
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
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Accounts"
        subtitle="View and manage all user accounts"
        icon={UserCog}
      />

      {/* Chỉ còn ô tìm kiếm: danh sách luôn là Player nên select role không lọc
          được gì. `filters` là prop optional của FilterSortBar. */}
      <FilterSortBar
        search={{ placeholder: "Search by username or email...", icon: UserCog, value: searchKeyword, onChange: handleSearch }}
      />

      <AdminTable
        title="Accounts List"
        columns={columns}
        data={accounts}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No accounts found"
        emptyHint="Try a different search keyword or role filter."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="accountId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />

      {/* Player Profile Modal */}
      {viewingAccount && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Account Profile</h2>
                <p className="text-sm text-gray-400">
                  {viewingAccount.userName} — {viewingAccount.email}
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="p-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-lg transition-colors cursor-pointer"
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
                  <h3 className="text-xl font-bold text-white mb-2">No Character Created</h3>
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
                  <div className="flex items-center gap-4 bg-[#111] border border-white/10 rounded-xl p-4">
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
                            CLASS_CONFIG[playerProfile.playerClass]?.color ?? "text-gray-300"
                          } ${
                            CLASS_CONFIG[playerProfile.playerClass]?.bg ?? "bg-gray-500/15"
                          } ${
                            CLASS_CONFIG[playerProfile.playerClass]?.border ?? "border-gray-500/30"
                          }`}
                        >
                          <span>{CLASS_CONFIG[playerProfile.playerClass]?.emoji}</span>
                          {playerProfile.playerClass}
                        </span>
                        <span className="text-[#ffc032] font-semibold text-sm">
                          Lv. {playerProfile.level ?? 1}
                        </span>
                        {!viewingAccount.isActive && (
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
                    <div className="bg-[#111] border border-white/10 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="w-3 h-3 text-yellow-400" />
                        Gold
                      </p>
                      <p className="text-lg font-bold text-yellow-400">
                        {Number(playerProfile.gold ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Gem className="w-3 h-3 text-blue-400" />
                        Gems
                      </p>
                      <p className="text-lg font-bold text-blue-400">
                        {Number(playerProfile.gems ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#111] border border-white/10 rounded-xl p-3 space-y-1">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-green-400" />
                        Energy
                      </p>
                      <p className="text-lg font-bold text-green-400">
                        {playerProfile.energy ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  {playerStats && (
                    <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Combat Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <StatRow icon={Heart} color="text-red-400" label="HP" value={`${playerStats.currentHp} / ${playerStats.maxHp}`} />
                        <StatRow icon={Sword} color="text-orange-400" label="Attack" value={playerStats.atk} />
                        <StatRow icon={Shield} color="text-blue-400" label="Defense" value={playerStats.def} />
                        <StatRow icon={Target} color="text-pink-400" label="Crit Rate" value={`${playerStats.critRate}%`} />
                        <StatRow icon={Zap} color="text-yellow-400" label="Crit DMG" value={`${playerStats.critDamage}%`} />
                        <StatRow icon={Trophy} color="text-purple-400" label="Wins / Losses" value={`${playerStats.totalWins} / ${playerStats.totalLosses}`} />
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Timeline
                    </h4>
                    <div className="space-y-2">
                      <TimelineRow icon={Calendar} label="Created" value={formatDate(playerProfile.createdAt)} />
                      <TimelineRow icon={Activity} label="Last Updated" value={formatDate(playerProfile.updatedAt)} />
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
    <div className="flex items-center gap-2.5 px-3 py-2 bg-[#111111] rounded-lg">
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
    <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#111111] rounded-lg">
      <span className="text-xs text-gray-400 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="text-sm font-medium text-white text-right">{value}</span>
    </div>
  );
}
