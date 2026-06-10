'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Eye, Edit, Settings, Plus } from 'lucide-react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { GameSettingResponse } from '@/lib/api/game';

const CATEGORIES = [
  "All",
  "Player",
  "Energy",
  "Shop",
  "System",
  "Events",
  "Battle",
  "Gacha",
  "Social",
];

const getTypeFromKey = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("enable") || lowerKey.includes("active") || lowerKey.includes("is")) {
    return "boolean";
  }
  if (lowerKey.includes("count") || lowerKey.includes("amount") || lowerKey.includes("level") || lowerKey.includes("rate") || lowerKey.includes("time")) {
    return "number";
  }
  if (lowerKey.includes("json") || lowerKey.includes("data") || lowerKey.includes("config")) {
    return "json";
  }
  return "string";
};

const getCategoryFromKey = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("player") || lowerKey.includes("xp") || lowerKey.includes("exp") || lowerKey.includes("level")) {
    return "Player";
  }
  if (lowerKey.includes("energy") || lowerKey.includes("stamina") || lowerKey.includes("mana")) {
    return "Energy";
  }
  if (lowerKey.includes("shop") || lowerKey.includes("price") || lowerKey.includes("cost") || lowerKey.includes("gem") || lowerKey.includes("gold")) {
    return "Shop";
  }
  if (lowerKey.includes("event") || lowerKey.includes("campaign")) {
    return "Events";
  }
  if (lowerKey.includes("battle") || lowerKey.includes("combat") || lowerKey.includes("pvp") || lowerKey.includes("dungeon")) {
    return "Battle";
  }
  if (lowerKey.includes("gacha") || lowerKey.includes("summon") || lowerKey.includes("draw")) {
    return "Gacha";
  }
  if (lowerKey.includes("social") || lowerKey.includes("friend") || lowerKey.includes("guild") || lowerKey.includes("chat")) {
    return "Social";
  }
  return "System";
};

const categoryColors: Record<string, string> = {
  Player: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Energy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Shop: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  System: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  Events: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  Battle: 'bg-red-500/20 text-red-400 border-red-500/30',
  Gacha: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Social: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

const typeColors: Record<string, string> = {
  boolean: 'bg-green-500/20 text-green-400',
  number: 'bg-blue-500/20 text-blue-400',
  string: 'bg-gray-500/20 text-gray-300',
  json: 'bg-purple-500/20 text-purple-400',
};

export default function ManageGameConfigPage() {
  const {
    data: settings,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
  } = usePagedQuery<GameSettingResponse>({
    endpoint: '/api/gamesettings',
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value || undefined });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  const filteredSettings = settings.filter((setting) => {
    const category = getCategoryFromKey(setting.key);
    return selectedCategory === "All" || category === selectedCategory;
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (loading && settings.length === 0) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
              <Settings className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Game Configuration</h1>
              <p className="text-gray-400">Manage game settings and system parameters</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by key..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchChange((e.target as HTMLInputElement).value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#ffc032] text-[#111] border border-[#ffc032]'
                      : 'bg-[#0d0d0d] text-gray-300 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Key</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No configurations found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((setting) => {
                    const category = getCategoryFromKey(setting.key);
                    const type = getTypeFromKey(setting.key);
                    return (
                      <tr
                        key={setting.gameSettingId}
                        className="border-b border-gray-800/50 hover:bg-[#222] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{setting.gameSettingId}</td>
                        <td className="px-6 py-4">
                          <span className="text-white font-mono font-medium">{setting.key}</span>
                          {setting.description && (
                            <p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={setting.description}>
                              {setting.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-sm bg-[#0d0d0d] px-3 py-1.5 rounded-lg text-[#ffc032] font-mono block max-w-xs truncate" title={setting.value || '-'}>
                            {setting.value || '-'}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[category] || categoryColors.System}`}>
                            {category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${typeColors[type] || typeColors.string}`}>
                            {type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {setting.isActive ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/manage-game-config/detail?id=${setting.key}`}
                              className="p-2 rounded-lg bg-[#0d0d0d] border border-gray-700 hover:border-gray-600 hover:bg-[#252525] transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </Link>
                            <Link
                              href={`/manage-game-config/edit?id=${setting.key}`}
                              className="p-2 rounded-lg bg-[#ffc032]/10 border border-[#ffc032]/30 hover:bg-[#ffc032]/20 hover:border-[#ffc032]/50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-[#ffc032]" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Configurations: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  aria-label="Select page size"
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
          )}
        </div>
      </div>
    </div>
  );
}
