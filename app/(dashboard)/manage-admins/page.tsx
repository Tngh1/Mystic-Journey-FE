'use client';

import Link from 'next/link';
import { ArrowLeft, Edit, Loader2, Plus, Shield, Users } from 'lucide-react';
import { AccountAdminResponse } from '@/lib/api/admin-account';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';

const roleColors: Record<string, string> = {
  'Super Admin': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  Player: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function ManageAdminsPage() {
  const {
    data: admins,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh,
  } = usePagedQuery<AccountAdminResponse>({
    endpoint: '/api/admin-accounts',
    pageSize: 10,
  });

  const handleDelete = async (admin: AccountAdminResponse) => {
    if (!confirm(`Delete account "${admin.userName}"?`)) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-accounts/${admin.accountId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
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
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc032] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Admins</h1>
                <p className="text-gray-400">Manage admin and moderator accounts</p>
              </div>
            </div>
            <Link
              href="/manage-admins/create"
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Admin
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Admins Table */}
        {loading && admins.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl p-12 border border-gray-800 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No accounts found</p>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Account ID</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Username</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Created</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Last Login</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.accountId}
                      className="border-b border-gray-800/50 hover:bg-[#222] transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">{admin.accountId.toString().slice(0, 8)}...</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#ffc032]/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-[#ffc032]" />
                          </div>
                          <div>
                            <p className="font-medium">{admin.userName}</p>
                            {admin.playerDisplayName && (
                              <p className="text-xs text-gray-500">Player: {admin.playerDisplayName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${roleColors[admin.roleName] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}
                        >
                          {admin.roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {admin.isActive ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(admin.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(admin.lastLogin)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/manage-admins/edit?id=${admin.accountId}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Accounts: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <select
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
