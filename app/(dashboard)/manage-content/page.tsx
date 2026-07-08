'use client';

import Link from "next/link";
import { Plus, Globe, GlobeLock, FileText, Image as ImageIcon } from 'lucide-react';
import { ContentResponse } from "@/lib/api/contents";
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
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value || undefined });
  };

  const handleTogglePublish = async (content: ContentResponse) => {
    setTogglingId(content.contentId);
    try {
      if (content.isPublished) {
        await apiClient.put(`/api/contents/${content.contentId}`, {
          title: content.title,
          summary: content.summary,
          thumbnailUrl: content.thumbnailUrl,
          categoryId: content.categoryId,
          isPublished: false,
        });
      } else {
        await apiClient.post(`/api/contents/${content.contentId}/publish`, {});
      }
      refresh();
    } catch (err) {
      await showErrorAlert(
        "Cannot Publish Content",
        err instanceof Error ? err.message : "Failed to toggle publish status"
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Content Management</h1>
            <p className="text-sm text-gray-500">Manage game articles and announcements</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Filter by title..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <Link
          href="/manage-content/create"
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Content
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thumbnail</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && contents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : contents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500">No content found</td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.contentId} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{content.contentId}</td>
                    <td className="px-5 py-3.5">
                      {content.thumbnailUrl ? (
                        <img src={content.thumbnailUrl} alt={content.title} className="w-14 h-10 object-cover rounded-lg bg-[#111]" />
                      ) : (
                        <div className="w-14 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-white">{content.title}</p>
                      <p className="text-xs text-gray-500">{content.slug}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-400">{content.categoryName || '-'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleTogglePublish(content)}
                        disabled={togglingId === content.contentId}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                          content.isPublished
                            ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400'
                            : 'bg-[#111] text-gray-400 border border-gray-700 hover:bg-green-500/20 hover:text-green-400'
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
                    <td className="px-5 py-3.5 text-sm text-gray-400">{content.createdByName || 'Unknown'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(content.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/manage-content/update?id=${content.contentId}`}
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
          <div className="px-5 py-3.5 border-t border-gray-800 flex items-center justify-between">
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
