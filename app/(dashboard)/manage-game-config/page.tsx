'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowLeft, Loader2, Trash2, Eye, Edit } from 'lucide-react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import apiClient from '@/lib/api/client';
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
    refresh,
  } = usePagedQuery<GameSettingResponse>({
    endpoint: '/api/game-settings',
    pageSize: 10,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value || undefined });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this configuration?")) {
      return;
    }
    try {
      setDeletingId(id);
      await apiClient.delete(`/api/game-settings/${id}`);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete configuration");
    } finally {
      setDeletingId(null);
    }
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
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#ffc032]" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Game Configuration</h1>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by key..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ffc032] w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ffc032]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Button */}
            <Link
              href="/manage-game-config/create"
              className="flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Config
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Key</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Updated At</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc032]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSettings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      No configurations found
                    </td>
                  </tr>
                ) : (
                  filteredSettings.map((setting) => (
                    <tr
                      key={setting.id}
                      className="border-b border-[#333] hover:bg-[#252525] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-300">{setting.id}</td>
                      <td className="px-4 py-3 text-sm text-white font-mono">{setting.key}</td>
                      <td className="px-4 py-3 text-sm text-gray-300 max-w-xs truncate">
                        {setting.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                        {setting.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-[#252525] text-[#ffc032] rounded text-xs">
                          {getTypeFromKey(setting.key)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${setting.isActive
                              ? "bg-green-900/30 text-green-400"
                              : "bg-red-900/30 text-red-400"
                            }`}
                        >
                          {setting.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {setting.updatedAt ? new Date(setting.updatedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/manage-game-config/detail?id=${setting.id}`}
                            className="p-1.5 rounded hover:bg-[#333] transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            href={`/manage-game-config/edit?id=${setting.id}`}
                            className="p-1.5 rounded hover:bg-[#333] transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-[#ffc032]" />
                          </Link>
                          <button
                            onClick={() => handleDelete(setting.id)}
                            disabled={deletingId === setting.id}
                            className="p-1.5 rounded hover:bg-[#333] transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2
                              className={`w-4 h-4 ${deletingId === setting.id ? "text-gray-500" : "text-red-400"
                                }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#333]">
              <div className="text-sm text-gray-400">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of{' '}
                {totalCount.toLocaleString()} configurations
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-sm text-white focus:outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 hover:bg-[#333] rounded transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                <span className="px-3 py-1 text-sm text-white">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 hover:bg-[#333] rounded transition-colors text-gray-40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
