'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit, Search, Loader2, Shield, User, Ban, CheckCircle } from 'lucide-react';
import { PlayerProfileResponse } from '@/lib/api/player-profile';
import { banPlayer, unbanPlayer } from '@/lib/api/account';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { showSuccessAlert, showErrorAlert } from '@/lib/utils/swal';

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

  const [selectedClass, setSelectedClass] = useState('');

  const handleClassFilter = (className: string) => {
    if (selectedClass === className) {
      setSelectedClass('');
      setParams({});
    } else {
      setSelectedClass(className);
      setParams({ level: className });
    }
  };

  const handleSearch = (keyword: string) => {
    setParams({ search: keyword || undefined });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const [banningId, setBanningId] = useState<number | null>(null);

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

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
              <User className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Manage Players</h1>
              <p className="text-gray-400">View and manage all player profiles</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by display name..."
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <button
              onClick={() => { setSelectedClass(''); setParams({}); }}
              className="px-6 py-3 bg-[#333] text-gray-300 font-semibold rounded-xl hover:bg-[#444] transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Class Filters */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-3">Filter by Class:</p>
            <div className="flex flex-wrap gap-2">
              {['Knight', 'Mage', 'Archer'].map((className) => (
                <button
                  key={className}
                  onClick={() => handleClassFilter(className)}
                  className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${selectedClass === className
                      ? 'bg-[#ffc032] text-[#111] border-[#ffc032]'
                      : 'bg-[#0d0d0d] text-gray-300 border-gray-700 hover:border-gray-600'
                    }`}
                >
                  <span>{classIcons[className]}</span>
                  {className}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* players Table */}
        {loading && players.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
          </div>
        ) : players.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No players found</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Display Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Class</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Level</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Gold</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Gems</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Energy</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.playerProfileId ?? `player-${index}`} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">{player.playerProfileId ?? 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#ffc032]/20 flex items-center justify-center overflow-hidden">
                            {player.avatarUrl ? (
                              <img src={player.avatarUrl} alt={player.displayName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-5 h-5 text-[#ffc032]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{player.displayName}</p>
                            <p className="text-xs text-gray-500">{player.accountEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${classColors[player.playerClass] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}
                        >
                          <span>{classIcons[player.playerClass]}</span>
                          {player.playerClass}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#ffc032] font-semibold">{player.level}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400">💰 {Number(player.gold).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-400">💎 {Number(player.gems).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-400">⚡ {player.energy}</span>
                      </td>
                      <td className="px-6 py-4">
                        {player.isBanned ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/manage-players/edit?id=${player.playerProfileId ?? ''}`}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium mb-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleBan(player)}
                          disabled={banningId === player.playerProfileId}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
                            player.isBanned
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          } disabled:opacity-50`}
                        >
                          {banningId === player.playerProfileId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : player.isBanned ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                          {player.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-gray-500">
                Total Players: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  aria-label="Select players page size"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-[#0d0d0d] border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-sm text-white">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
