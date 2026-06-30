'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, User, Ban, CheckCircle } from 'lucide-react';
import { PlayerProfileResponse } from '@/lib/api/player-profiles';
import { banPlayer, unbanPlayer } from '@/lib/api/admin-accounts';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';

const classColors: Record<string, string> = {
  Knight: 'text-red-400',
  Mage: 'text-purple-400',
  Archer: 'text-green-400',
};

export default function ManagePlayersPage() {
  const {
    data: players,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<PlayerProfileResponse>({
    endpoint: '/api/playerprofiles',
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [banningId, setBanningId] = useState<number | null>(null);

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setParams({
      ...(keyword ? { search: keyword } : {}),
      ...(selectedClass ? { level: selectedClass } : {}),
    });
  };

  const handleClassFilter = (cls: string) => {
    const next = selectedClass === cls ? '' : cls;
    setSelectedClass(next);
    setParams({
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(next ? { level: next } : {}),
    });
  };

  const handleBan = async (player: PlayerProfileResponse) => {
    if (player.playerProfileId == null || player.accountId == null) return;
    try {
      setBanningId(player.playerProfileId);
      if (player.isBanned) {
        await unbanPlayer(player.accountId);
        await showSuccessAlert('Unbanned!', `${player.displayName} has been unbanned.`);
      } else {
        await banPlayer(player.accountId);
        await showSuccessAlert('Banned!', `${player.displayName} has been banned.`);
      }
      refresh();
    } catch (err) {
      await showErrorAlert('Error', err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBanningId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Players</h1>
            <p className="text-sm text-gray-500">View and manage all player profiles</p>
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
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter by class"
            value={selectedClass}
            onChange={(e) => handleClassFilter(e.target.value)}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors"
          >
            <option value="">All Classes</option>
            <option value="Knight">Knight</option>
            <option value="Mage">Mage</option>
            <option value="Archer">Archer</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gold</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gems</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && players.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : players.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500">No players found</td>
                </tr>
              ) : (
                players.map((player, index) => (
                  <tr key={player.playerProfileId ?? `player-${index}`} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{player.playerProfileId ?? 'N/A'}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ffc032]/20 flex items-center justify-center shrink-0 overflow-hidden">
                          {player.avatarUrl ? (
                            <img src={player.avatarUrl} alt={player.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-[#ffc032]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{player.displayName}</p>
                          <p className="text-xs text-gray-500">{player.accountEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${classColors[player.playerClass] || 'text-gray-300'}`}>
                        {player.playerClass}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#ffc032]">{player.level}</td>
                    <td className="px-5 py-3.5 text-sm text-yellow-400">{Number(player.gold).toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-blue-400">{Number(player.gems).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${player.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {player.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleBan(player)}
                          disabled={banningId === player.playerProfileId}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            player.isBanned
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          }`}
                          title={player.isBanned ? 'Unban' : 'Ban'}
                        >
                          {banningId === player.playerProfileId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : player.isBanned ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/manage-players/update?id=${player.playerProfileId ?? ''}`}
                          className="px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold"
                        >
                          Update
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                {page} / {Math.max(1, Math.ceil(totalCount / pageSize))}
              </span>
              <button
                aria-label="Next page"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(totalCount / pageSize)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
