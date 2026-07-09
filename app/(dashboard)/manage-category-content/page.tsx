'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { CategoryResponse } from '@/lib/api/contents';

export default function ManageCategoryContentPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: categories,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setParams,
    refresh,
  } = usePagedQuery<CategoryResponse>({
    endpoint: '/api/contents/categories',
    pageSize: 10,
  });

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setParams({ search: keyword || undefined });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <svg className="w-7 h-7 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Category Content</h1>
            <p className="text-sm text-gray-500">Create and manage content categories</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <Link
          href="/manage-category-content/create"
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No categories found</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.categoryContentId} className="border-b border-white/10/50 hover:bg-[#1e1e1e] transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{cat.categoryContentId}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-white">{cat.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{cat.slug}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 max-w-xs truncate">{cat.description || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${cat.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">
                      {new Date(cat.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/manage-category-content/update?id=${cat.categoryContentId}`}
                        className="px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold cursor-pointer"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-gray-500">Total: {totalCount.toLocaleString()}</div>
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Previous page"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
