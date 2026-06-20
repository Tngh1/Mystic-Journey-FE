'use client';

import Link from "next/link";
import { Plus, Pencil, Globe, GlobeLock, ChevronLeft, ChevronRight } from "lucide-react";
import { ContentResponse } from "@/lib/api/content";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ManageContentPage() {
  const {
    data: contents,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<ContentResponse>({
    endpoint: '/api/contents',
    pageSize: 10,
  });

  const handleTogglePublish = async (content: ContentResponse) => {
    try {
      await apiClient.post(`/api/contents/${content.contentId}/publish`, {});
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle publish status');
    }
  };

  if (loading && contents.length === 0) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc032]"></div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
            <p className="text-gray-400">Manage game articles and announcements</p>
          </div>
          <Link
            href="/manage-content/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6ae2c] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Content
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by title..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffc032] w-64"
          />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Published</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Created</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No content found
                    </td>
                  </tr>
                ) : (
                  contents.map((content) => (
                    <tr
                      key={content.contentId}
                      className="border-b border-[#222] hover:bg-[#252525] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-400">{content.contentId}</td>
                      <td className="px-4 py-3 text-sm text-white max-w-[300px]">
                        <div className="truncate font-medium">{content.title}</div>
                        <div className="text-xs text-gray-500 truncate">{content.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-[#333] text-gray-300 rounded text-xs">
                          {content.categoryName || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleTogglePublish(content)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${content.isPublished
                              ? 'bg-green-900/50 text-green-400 hover:bg-green-800/50'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                        >
                          {content.isPublished ? (
                            <>
                              <Globe className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <GlobeLock className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {content.isActive ? (
                          <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDate(content.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/manage-content/edit?id=${content.contentId}`}
                            className="p-2 hover:bg-[#333] rounded-lg transition-colors text-gray-400 hover:text-[#ffc032]"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
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
                {totalCount.toLocaleString()} entries
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
                  className="p-2 hover:bg-[#333] rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1 text-sm text-white">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="p-2 hover:bg-[#333] rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
