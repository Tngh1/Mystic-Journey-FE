'use client';

import Link from "next/link";
import { Plus, Pencil, Globe, GlobeLock, FileText, Image as ImageIcon, Type } from 'lucide-react';
import { ContentResponse } from "@/lib/api/content";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { useState } from "react";
import { showErrorAlert } from "@/lib/utils/swal";

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

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value || undefined });
  };

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleTogglePublish = async (content: ContentResponse) => {
    setTogglingId(content.contentId);
    try {
      if (content.isPublished) {
        // Unpublish: use the update endpoint with isPublished: false
        await apiClient.put(`/api/contents/${content.contentId}`, {
          title: content.title,
          summary: content.summary,
          thumbnailUrl: content.thumbnailUrl,
          categoryId: content.categoryId,
          isPublished: false,
        });
      } else {
        // Publish: use the dedicated publish endpoint
        await apiClient.post(`/api/contents/${content.contentId}/publish`, {});
      }
      refresh();
    } catch (err) {
      // Surface the server-side message (e.g. inactive-category validation) as-is
      await showErrorAlert(
        "Cannot Publish Content",
        err instanceof Error ? err.message : "Failed to toggle publish status"
      );
    } finally {
      setTogglingId(null);
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
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <FileText className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Content Management</h1>
                <p className="text-gray-400">Manage game articles and announcements</p>
              </div>
            </div>
            <Link
              href="/manage-content/create"
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Add Content
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter by title..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
          </div>
        </div>

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
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Thumbnail</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Title</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Category</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Published</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Created By</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Created</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      No content found
                    </td>
                  </tr>
                ) : (
                  contents.map((content) => (
                    <tr key={content.contentId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-400 font-mono">{content.contentId}</td>
                      <td className="px-4 py-4">
                        {content.thumbnailUrl ? (
                          <img 
                            src={content.thumbnailUrl} 
                            alt={content.title} 
                            className="w-16 h-12 object-cover rounded-lg bg-[#0d0d0d]"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-[#222] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{content.title}</div>
                        <div className="text-xs text-gray-500">{content.slug}</div>
                        {content.summary && (
                          <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                            {content.summary}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-[#333] text-gray-300 rounded-lg text-xs font-medium">
                          {content.categoryName || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleTogglePublish(content)}
                          disabled={togglingId === content.contentId}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                            content.isPublished
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                              : 'bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400 hover:border hover:border-green-500/30'
                          }`}
                        >
                          {togglingId === content.contentId ? (
                            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : content.isPublished ? (
                            <Globe className="w-3 h-3" />
                          ) : (
                            <GlobeLock className="w-3 h-3" />
                          )}
                          {content.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-300 font-medium">
                          {content.createdByName || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {formatDate(content.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/manage-content/update?id=${content.contentId}`}
                          className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Contents: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
