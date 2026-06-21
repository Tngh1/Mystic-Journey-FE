'use client';

import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { AccountAdminResponse } from '@/lib/api/admin-account';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { useState } from 'react';
import apiClient from '@/lib/api/client';

const roleColors: Record<string, string> = {
  'Super Admin': 'text-purple-400',
  Admin: 'text-red-400',
  Player: 'text-blue-400',
};

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ManageAdminsPage() {
  const [searchTerm, setSearchTerm] = useState('');

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
    endpoint: '/api/adminaccounts',
    pageSize: 10,
    params: { roleName: 'Admin' },
  });

  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setParams({ roleName: 'Admin', search: keyword || undefined });
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Admins</h1>
            <p className="text-sm text-gray-500">Manage admin and moderator accounts</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <Link
          href="/manage-admins/create"
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Admin
        </Link>
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
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No accounts found</td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.accountId} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{admin.accountId}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#ffc032]/20 flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-[#ffc032]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{admin.userName}</p>
                          {admin.playerDisplayName && (
                            <p className="text-xs text-gray-500">Player: {admin.playerDisplayName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{admin.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-sm font-semibold ${roleColors[admin.roleName] || 'text-gray-300'}`}>
                        {admin.roleName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${admin.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(admin.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">

                        <Link
                          href={`/manage-admins/update?id=${admin.accountId}`}
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
