import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

interface ServerPagination {
  page: number;
  pageSize: number;
  totalCount: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  itemsPerPage?: number;
  /** Enable server-side pagination */
  serverSide?: boolean;
  /** Provide server-side pagination state when serverSide=true */
  pagination?: ServerPagination;
  /** Loading state for server-side mode */
  loading?: boolean;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

export default function AdminTable({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  itemsPerPage = 10,
  serverSide = false,
  pagination,
  loading = false,
}: AdminTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side pagination
  const filteredData = serverSide
    ? data
    : data.filter((item) => {
        return columns.some((col) => {
          const value = item[col.key];
          if (typeof value === "string") {
            return value.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return String(value ?? "").toLowerCase().includes(searchTerm.toLowerCase());
        });
      });

  const totalItems = serverSide && pagination ? pagination.totalCount : filteredData.length;
  const currentPageSize = serverSide && pagination ? pagination.pageSize : itemsPerPage;
  const activePage = serverSide && pagination ? pagination.page : currentPage;
  const totalPages = Math.max(1, Math.ceil(totalItems / currentPageSize));

  const safePage = Math.min(activePage, totalPages);
  const startIndex = serverSide && pagination ? (safePage - 1) * currentPageSize : (safePage - 1) * currentPageSize;
  const endIndex = Math.min(startIndex + currentPageSize, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    if (serverSide && pagination) {
      pagination.setPage(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (size: number) => {
    if (serverSide && pagination) {
      pagination.setPageSize(size);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (safePage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (safePage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = safePage - 1; i <= safePage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">
          {title}
          {loading && (
            <span className="ml-3 inline-block w-4 h-4 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
          )}
        </h2>
        <div className="flex items-center gap-3">
          {!serverSide && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors w-full sm:w-64"
              />
            </div>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 bg-[#ffc032] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffc032]/90 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading && currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="p-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
                    <span className="text-white/40 text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="p-8 text-center text-white/40"
                >
                  No data available
                </td>
              </tr>
            ) : (
              currentData.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-sm text-white/80 whitespace-nowrap">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-white/50 hover:text-[#ffc032] hover:bg-[#ffc032]/10 rounded transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Page size selector for server-side */}
        {serverSide && pagination && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">Rows per page:</span>
            <select
              value={currentPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-white/50">
          {totalItems === 0 ? (
            "No results"
          ) : (
            <>
              Showing{" "}
              {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of{" "}
              {totalItems.toLocaleString()} results
              {serverSide && pagination && (
                <span className="ml-2 text-white/30">
                  (server-side pagination)
                </span>
              )}
            </>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={`ellipsis-${index}`} className="px-2 text-white/50">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum as number)}
                  className={`min-w-[32px] px-2 py-1 rounded text-sm font-medium transition-colors cursor-pointer ${
                    safePage === pageNum
                      ? "bg-[#ffc032]/10 text-[#ffc032] border border-[#ffc032]/20"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
