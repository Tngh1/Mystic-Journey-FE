'use client';

import { useRouter } from "next/navigation";
import { FileText, Globe, GlobeLock, Image as ImageIcon, Edit2 } from 'lucide-react';
import { useEffect, useState } from "react";
import { getCategories, ContentResponse, CategoryResponse } from "@/lib/api/contents";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils/swal";
import AdminTable from "@/components/ui/AdminTable";
import PageHeader from "@/components/ui/PageHeader";
import FilterSortBar from "@/components/ui/FilterSortBar";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ManageContentPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [sortBy, setSortBy] = useState('contentId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(Array.isArray(res) ? res : []))
      .catch(console.error);
  }, []);

  const buildParams = (overrides: Record<string, string | number | boolean | undefined> = {}) => {
    const catVal = overrides.categoryId !== undefined ? overrides.categoryId : (selectedCategory ? Number(selectedCategory) : undefined);
    return {
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(catVal !== undefined ? { categoryId: catVal } : {}),
      sortBy,
      sortOrder,
      ...overrides,
    };
  };

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
    params: buildParams(),
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    setParams(buildParams({ search: value || undefined }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setPage(1);
    setParams(buildParams({ categoryId: value ? Number(value) : undefined }));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
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
      await showSuccessAlert(
        "Success!",
        content.isPublished ? "Content unpublished successfully." : "Content published successfully."
      );
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

  const columns = [
    { key: 'contentId', label: 'ID', sortable: true },
    {
      key: 'thumbnailUrl',
      label: 'Thumbnail',
      sortable: false,
      render: (_: unknown, content: ContentResponse) =>
        content.thumbnailUrl ? (
          <img src={content.thumbnailUrl} alt={content.title} className="w-14 h-10 object-cover rounded-lg bg-[#111]" />
        ) : (
          <div className="w-14 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </div>
        ),
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (_: unknown, content: ContentResponse) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{content.title}</p>
          <p className="text-xs text-gray-500 truncate">{content.slug}</p>
        </div>
      ),
    },
    {
      key: 'categoryName',
      label: 'Category',
      sortable: true,
      render: (val: string) => <span className="text-xs text-gray-400">{val || '-'}</span>,
    },
    {
      key: 'isPublished',
      label: 'Published',
      sortable: true,
      render: (_: unknown, content: ContentResponse) => (
        <button
          type="button"
          onClick={() => handleTogglePublish(content)}
          disabled={togglingId === content.contentId}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
            content.isPublished
              ? 'bg-green-500/20 text-green-400 hover:bg-red-500/20 hover:text-red-400'
              : 'bg-[#111] text-gray-400 border border-white/10 hover:bg-green-500/20 hover:text-green-400'
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
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (val: string) => <span className="text-sm text-gray-400">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_: unknown, content: ContentResponse) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => router.push(`/manage-content/update?id=${content.contentId}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Update
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        subtitle="Manage game articles and announcements"
        icon={FileText}
        actions={[
          {
            label: "Create Content",
            icon: FileText,
            onClick: () => router.push("/manage-content/create"),
          },
        ]}
      />

      <FilterSortBar
        search={{ placeholder: "Filter by title...", icon: FileText, value: searchTerm, onChange: handleSearch }}
        filters={[
          {
            key: "category",
            label: "All Categories",
            options: categories.map((c) => ({ value: String(c.categoryContentId), label: c.name })),
            value: selectedCategory,
            onChange: handleCategoryChange,
          },
        ]}
      />

      <AdminTable
        title="Content List"
        columns={columns}
        data={contents}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No content found"
        emptyHint="Try a different search or create new content."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="contentId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
