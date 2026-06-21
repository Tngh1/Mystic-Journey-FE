'use client';

import React, { useState, useCallback } from 'react';
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
  Trophy
} from 'lucide-react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';
import apiClient from '@/lib/api/client';
import type { PlayerProfileResponse, PlayerStatsResponse } from '@/lib/types';

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  Player: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Guest: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const classColors: Record<string, string> = {
  Knight: 'bg-red-500/20 text-red-400 border-red-500/30',
  Mage: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Archer: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const classIcons: Record<string, string> = {
  Knight: '⚔️',
  Mage: '🔮',
  Archer: '🏹',
};

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
    endpoint: '/api/adminaccounts',
    pageSize: 10,
  });

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [banningId, setBanningId] = useState<number | null>(null);

  const [viewingAccount, setViewingAccount] = useState<AccountWithPlayer | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfileResponse | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStatsResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setParams({ search: keyword || undefined });
  };

  const handleRoleFilter = (role: string) => {
    if (selectedRole === role) {
      setSelectedRole('');
      setParams({ ...(searchKeyword ? { search: searchKeyword } : {}) });
    } else {
      setSelectedRole(role);
      setParams({ ...(searchKeyword ? { search: searchKeyword } : {}), roleName: role });
    }
  };

  const handleBan = async (account: AccountWithPlayer) => {
    if (!account.accountId) return;
    try {
      setBanningId(account.accountId);
      if (account.isActive) {
        await apiClient.post(`/api/adminaccounts/${account.accountId}/ban`);
        await showSuccessAlert('Banned!', `Account "${account.userName}" has been banned.`);
      } else {
        await apiClient.post(`/api/adminaccounts/${account.accountId}/unban`);
        await showSuccessAlert('Unbanned!', `Account "${account.userName}" has been unbanned.`);
      }
      refresh();
    } catch (err) {
      await showErrorAlert('Error', err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBanningId(null);
    }
  };

  const handleViewProfile = useCallback(async (account: AccountWithPlayer) => {
    setViewingAccount(account);
    setPlayerProfile(null);
    setPlayerStats(null);
    setProfileError(null);

    if (!account.playerProfileId) {
      return;
    }

    setLoadingProfile(true);
    try {
      const [profileRes, statsRes] = await Promise.all([
        apiClient.get<PlayerProfileResponse>(`/api/playerprofiles/${account.playerProfileId}`),
        apiClient.get<PlayerStatsResponse>(`/api/playerprofiles/${account.playerProfileId}/stats`).catch(() => null),
      ]);
      setPlayerProfile(profileRes.data);
      setPlayerStats(statsRes?.data ?? null);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to load player profile.');
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <UserCog className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Accounts</h1>
            <p className="text-sm text-gray-500">View and manage all user accounts</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter by role"
            value={selectedRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors"
          >
            <option value="">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Player">Player</option>
            <option value="Guest">Guest</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Accounts Table */}
      {loading && accounts.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <UserCog className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-gray-400">No accounts found</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.accountId} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{account.accountId}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ffc032]/20 flex items-center justify-center shrink-0">
                          <UserCog className="w-5 h-5 text-[#ffc032]" />
                        </div>
                        <p className="text-sm font-medium text-white">{account.userName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{account.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${roleColors[account.roleName]?.split(' ')[1] || 'text-gray-300'}`}>
                        {account.roleName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {account.playerProfileId ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          {account.playerDisplayName || 'Active'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-yellow-400 font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          No Profile
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${account.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {account.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(account.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewProfile(account)}
                          className="px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold"
                        >
                          View
                        </button>
                        {account.roleName === 'Player' && (
                          <button
                            onClick={() => handleBan(account)}
                            disabled={banningId === account.accountId}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                              account.isActive
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {banningId === account.accountId ? <Loader2 className="w-4 h-4 animate-spin" /> : account.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            {account.isActive ? 'Ban' : 'Unban'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalCount > 0 && (
            <div className="px-5 py-3.5 border-t border-gray-800 flex items-center justify-between">
              <div className="text-xs text-gray-500">Total: {totalCount.toLocaleString()}</div>
              <div className="flex items-center gap-1.5">
                <button
                  aria-label="Previous page"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="px-2 py-1 text-xs text-white">
                  {page} / {totalPages}
                </span>
                <button
                  aria-label="Next page"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-[#ffc032]">Account Profile</h2>
                <p className="text-sm text-gray-400">{viewingAccount.userName} &mdash; {viewingAccount.email}</p>
              </div>
              <button
                onClick={closeModal}
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
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400">{profileError}</p>
                </div>
              ) : !viewingAccount.playerProfileId ? (
                /* No Player Profile */
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Character Created</h3>
                  <p className="text-gray-400 mb-2">
                    This account does not have a Player Profile yet.
                  </p>
                  <p className="text-sm text-gray-500">
                    The player needs to complete the character creation process.
                  </p>
                </div>
              ) : playerProfile ? (
                /* Has Player Profile */
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 bg-[#222] rounded-xl p-4">
                    <div className="w-16 h-16 rounded-full bg-[#ffc032]/20 flex items-center justify-center overflow-hidden border-2 border-[#ffc032]">
                      {playerProfile.avatarUrl ? (
                        <img src={playerProfile.avatarUrl} alt={playerProfile.displayName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{classIcons[playerProfile.playerClass] || '👤'}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{playerProfile.displayName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold border ${classColors[playerProfile.playerClass] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}
                        >
                          <span>{classIcons[playerProfile.playerClass]}</span>
                          {playerProfile.playerClass}
                        </span>
                        <span className="text-[#ffc032] font-semibold">Lv. {playerProfile.level}</span>
                        {playerProfile.isBanned && (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Banned
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#222] rounded-xl p-3 text-center">
                      <p className="text-yellow-400 text-lg font-bold">💰 {Number(playerProfile.gold).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Gold</p>
                    </div>
                    <div className="bg-[#222] rounded-xl p-3 text-center">
                      <p className="text-blue-400 text-lg font-bold">💎 {Number(playerProfile.gems).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Gems</p>
                    </div>
                    <div className="bg-[#222] rounded-xl p-3 text-center">
                      <p className="text-green-400 text-lg font-bold">⚡ {playerProfile.energy}</p>
                      <p className="text-xs text-gray-400">Energy</p>
                    </div>
                  </div>

                  {/* Stats */}
                  {playerStats && (
                    <div className="bg-[#222] rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Combat Stats</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">HP:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.currentHp} / {playerStats.maxHp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-gray-300">Attack:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.atk}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Defense:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.def}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-pink-400" />
                          <span className="text-sm text-gray-300">Crit Rate:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.critRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Crit DMG:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.critDamage}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Wins / Losses:</span>
                          <span className="text-sm font-semibold text-white">{playerStats.totalWins} / {playerStats.totalLosses}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="bg-[#222] rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{formatDate(playerProfile.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Updated:</span>
                        <span className="text-white">{formatDate(playerProfile.updatedAt)}</span>
                      </div>
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
