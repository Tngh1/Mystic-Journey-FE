import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Inbox, AlertCircle, Loader2 } from "lucide-react";

interface Column<T extends object> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: never, item: T) => React.ReactNode;
}

interface ServerPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

interface AdminTableProps<T extends object> {
  title: string;
  columns: Column<T>[];
  data: T[];
  onCreate?: () => void;
  onUpdate?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  selectedId?: unknown;
  itemsPerPage?: number;
  idField?: string;
  serverSide?: boolean;
  pagination?: ServerPagination;
  loading?: boolean;
  error?: string | null;
  emptyTitle?: string;
  emptyHint?: string;
  onRetry?: () => void;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function AdminTable<T extends object>({
  title,
  columns,
  data,
  onCreate,
  onUpdate,
  onDelete,
  onRowClick,
  selectedId,
  itemsPerPage = 10,
  idField = "id",
  serverSide = false,
  pagination,
  loading = false,
  error = null,
  emptyTitle = "No data available",
  emptyHint,
  onRetry,
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = serverSide
    ? data
    : data.filter((item) =>
        columns.some((col) => {
          const value = (item as Record<string, unknown>)[col.key];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase());
        })
      );

  const totalItems = serverSide && pagination ? pagination.totalCount : filteredData.length;
  const currentPageSize = serverSide && pagination ? pagination.pageSize : itemsPerPage;
  const activePage = serverSide && pagination ? pagination.page : currentPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / currentPageSize));
  const safePage = Math.min(activePage, totalPages);
  const startIndex = serverSide && pagination ? 0 : (safePage - 1) * currentPageSize;
  const endIndex = serverSide && pagination ? totalItems : Math.min(startIndex + currentPageSize, totalItems);
  const currentData = serverSide && pagination ? data : filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    if (serverSide && pagination) {
      pagination.setPage(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  const columnCount = columns.length + (onUpdate || onDelete ? 1 : 0);

  const renderBody = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={columnCount} className="px-5 py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Failed to load data</p>
                <p className="text-xs text-white/50 mt-1 max-w-md">{error}</p>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="mt-1 px-4 h-9 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Try again
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    }

    if (loading && currentData.length === 0) {
      return Array.from({ length: 5 }).map((_, rowIdx) => (
        <tr key={`skeleton-${rowIdx}`} className="border-b border-gray-800/50">
          {columns.map((col) => (
            <td key={col.key} className="px-5 py-3.5">
              <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${50 + ((rowIdx * 17 + col.key.length * 11) % 40)}%` }} />
            </td>
          ))}
          {(onUpdate || onDelete) && (
            <td className="px-5 py-3.5 text-right">
              <div className="h-4 w-12 bg-white/5 rounded animate-pulse ml-auto" />
            </td>
          )}
        </tr>
      ));
    }

    if (currentData.length === 0) {
      return (
        <tr>
          <td colSpan={columnCount} className="px-5 py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                <Inbox className="w-7 h-7 text-white/40" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{emptyTitle}</p>
                {emptyHint && <p className="text-xs text-white/50 mt-1 max-w-md">{emptyHint}</p>}
              </div>
            </div>
          </td>
        </tr>
      );
    }

    return currentData.map((item, rowIndex) => {
      const rowId = (item as Record<string, unknown>)[idField];
      const isSelected = selectedId !== undefined && rowId === selectedId;
      return (
        <tr
          key={String(rowId ?? rowIndex)}
          onClick={() => onRowClick?.(item)}
          className={`border-b border-gray-800/50 hover:bg-[#1e1e1e]/70 transition-colors group ${
            onRowClick ? "cursor-pointer" : ""
          } ${isSelected ? "bg-[#252525]" : ""}`}
        >
          {columns.map((col) => (
            <td key={col.key} className="px-5 py-3.5 text-sm text-white/80 whitespace-nowrap">
              {col.render ? col.render((item as Record<string, unknown>)[col.key] as never, item) : String((item as Record<string, unknown>)[col.key] ?? "")}
            </td>
          ))}
          {(onUpdate || onDelete) && (
            <td className="px-5 py-3.5 text-right whitespace-nowrap">
              <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {onUpdate && (
                  <button
                    title="Update"
                    onClick={() => onUpdate(item)}
                    className="p-1.5 text-gray-500 hover:text-[#ffc032] hover:bg-[#ffc032]/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    title="Delete"
                    onClick={() => onDelete(item)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          {title}
          {loading && data.length > 0 && (
            <Loader2 className="w-3.5 h-3.5 text-[#ffc032] animate-spin" />
          )}
        </h2>
        <div className="flex items-center gap-3">
          {!serverSide && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors w-48"
              />
            </div>
          )}
          {onCreate && (
            <button
              onClick={onCreate}
              className="flex items-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#161616] sticky top-0 z-10">
            <tr className="border-b border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {(onUpdate || onDelete) && (
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      {!error && totalItems > 0 && (
        <div className="px-5 py-3.5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {serverSide && pagination ? (
              <>Showing {totalItems === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, totalItems)} of {totalItems}</>
            ) : (
              <>Showing {startIndex + 1}–{endIndex} of {totalItems}</>
            )}
          </p>
          <div className="flex items-center gap-2">
            {serverSide && pagination && (
              <select
                aria-label="Rows per page"
                value={currentPageSize}
                onChange={(e) => pagination.setPageSize(Number(e.target.value))}
                className="bg-[#111] border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-1.5">
              <button
                aria-label="Previous page"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ←
              </button>
              <span className="px-2 py-1 text-xs text-white">
                {safePage} / {totalPages}
              </span>
              <button
                aria-label="Next page"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}