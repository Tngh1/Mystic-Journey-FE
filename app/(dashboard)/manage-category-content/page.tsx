'use client';

import { useRouter } from 'next/navigation';
import { FolderOpen, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import { CategoryResponse } from '@/lib/api/contents';
import AdminTable from '@/components/ui/AdminTable';
import PageHeader from '@/components/ui/PageHeader';
import FilterSortBar from '@/components/ui/FilterSortBar';

// Renders the format date view component.
// Returns the JSX element hierarchy for the page view.
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Renders the manage category content page view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
export default function ManageCategoryContentPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('categoryContentId');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Renders the build params view component.
  // Returns the JSX element hierarchy for the page view.
  const buildParams = (overrides: Record<string, string | number | boolean | undefined> = {}) => ({
    ...(searchTerm ? { search: searchTerm } : {}),
    sortBy,
    sortOrder,
    ...overrides,
  });

  const {
    data: categories,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<CategoryResponse>({
    endpoint: '/api/contents/categories',
    pageSize: 10,
    params: buildParams(),
  });

  // Renders the handle search view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSearch = (keyword: string) => {
    setSearchTerm(keyword);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ search: keyword || undefined }));
  };

  // Renders the handle sort change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  const columns = [
    { key: 'categoryContentId', label: 'ID', sortable: true },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (val: string) => <span className="text-sm font-medium text-white">{val}</span>,
    },
    {
      key: 'slug',
      label: 'Slug',
      sortable: true,
      render: (val: string) => <span className="text-sm text-gray-400">{val}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (val: string) => (
        <span className="text-sm text-gray-400 max-w-xs truncate block">{val || '-'}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (val: boolean) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {val ? 'Active' : 'Inactive'}
        </span>
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
      render: (_: unknown, cat: CategoryResponse) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => router.push(`/manage-category-content/update?id=${cat.categoryContentId}`)}  // Navigate to the next page and push to history stack
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
        title="Manage Category Content"
        subtitle="Create and manage content categories"
        icon={FolderOpen}
        actions={[
          {
            label: "Create Category",
            icon: FolderOpen,
            onClick: () => router.push("/manage-category-content/create"),  // Navigate to the next page and push to history stack
          },
        ]}
      />

      <FilterSortBar
        search={{ placeholder: "Search categories...", icon: FolderOpen, value: searchTerm, onChange: handleSearch }}
      />

      <AdminTable
        title="Categories List"
        columns={columns}
        data={categories}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No categories found"
        emptyHint="Try a different search or create a new category."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="categoryContentId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
