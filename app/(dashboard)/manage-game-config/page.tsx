'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Edit } from 'lucide-react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { GameSettingResponse } from '@/lib/api/game';

const CATEGORIES = ['All', 'Player', 'Energy', 'Shop', 'System', 'Events', 'Battle', 'Gacha', 'Social'];

const getCategoryFromKey = (key: string): string => {
  const k = key.toLowerCase();
  if (/xp|exp|level/.test(k)) return 'Player';
  if (/energy|stamina|mana/.test(k)) return 'Energy';
  if (/shop|price|cost|gem|gold/.test(k)) return 'Shop';
  if (/event|campaign/.test(k)) return 'Events';
  if (/battle|combat|pvp|dungeon/.test(k)) return 'Battle';
  if (/gacha|summon|draw/.test(k)) return 'Gacha';
  if (/social|friend|guild|chat/.test(k)) return 'Social';
  return 'System';
};

const categoryColors: Record<string, string> = {
  Player: 'text-blue-400',
  Energy: 'text-green-400',
  Shop: 'text-yellow-400',
  System: 'text-gray-300',
  Events: 'text-pink-400',
  Battle: 'text-red-400',
  Gacha: 'text-purple-400',
  Social: 'text-cyan-400',
};

const typeColors: Record<string, string> = {
  boolean: 'text-green-400',
  number: 'text-blue-400',
  string: 'text-gray-300',
  json: 'text-purple-400',
};

const getTypeFromKey = (key: string): string => {
  const k = key.toLowerCase();
  if (/enable|active|is/.test(k)) return 'boolean';
  if (/count|amount|rate|time/.test(k)) return 'number';
  if (/json|data|config/.test(k)) return 'json';
  return 'string';
};

export default function ManageGameConfigPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const filteredSettings = settings.filter((s) => {
    const cat = getCategoryFromKey(s.key);
    return selectedCategory === 'All' || cat === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Game Configuration</h1>
            <p className="text-sm text-gray-500">Manage game settings and system parameters</p>
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
              placeholder="Search by key..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setParams({ search: e.target.value || undefined });
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && filteredSettings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredSettings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No configurations found</td>
                </tr>
              ) : (
                filteredSettings.map((setting) => {
                  const category = getCategoryFromKey(setting.key);
                  const type = getTypeFromKey(setting.key);
                  return (
                    <tr key={setting.gameSettingId} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{setting.gameSettingId}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-white font-mono">{setting.key}</span>
                        {setting.description && (
                          <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">{setting.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <code className="text-xs bg-[#111] px-2.5 py-1 rounded text-[#ffc032] font-mono">
                          {setting.value || '-'}
                        </code>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold ${categoryColors[category] || 'text-gray-300'}`}>
                          {category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-medium ${typeColors[type] || 'text-gray-300'}`}>
                          {type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${setting.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {setting.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/manage-game-config/detail?id=${setting.key}`}
                            className="p-1.5 rounded-lg bg-[#111] border border-gray-700 hover:border-gray-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            href={`/manage-game-config/update?id=${setting.key}`}
                            className="p-1.5 rounded-lg bg-[#ffc032]/10 border border-[#ffc032]/30 hover:border-[#ffc032]/50 transition-colors"
                            title="Update"
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
