import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, Inbox, AlertCircle, Loader2, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

/* The ledger every manage-* screen writes into: a steel-plate register with a
   dark head strip, parchment-dim column labels and gold only on the one Create
   action. Plate, not wood — the admin keep is rolled steel on a forge floor;
   the wood belongs to the wiki.

   Was a `rounded-2xl` #111111 card with `rounded-lg` rows, `rounded-full` empty
   /error medallions and #ffc032 / #1e1e1e / #252525 hardcoded throughout. The
   pager's bare "←" / "→" glyphs are now Lucide chevrons in 44px hit areas — the
   old ones were 27px and below the touch floor. */

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
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
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
  sortBy,
  sortOrder,
  onSort,
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

  const getSortIcon = (key: string) => {
    if (sortBy !== key) {
      return <ArrowUpDown className="h-3 w-3 text-parchment-dim/60" aria-hidden="true" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-3 w-3 text-accent" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3 w-3 text-accent" aria-hidden="true" />
    );
  };

  const columnCount = columns.length + (onUpdate || onDelete ? 1 : 0);

  const renderBody = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={columnCount} className="px-5 py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center border-2 border-black/60 bg-heraldry-crimson shadow-sm">
                <AlertCircle className="h-6 w-6 text-parchment" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-fg">Failed to load data</p>
                <p className="mx-auto mt-1 max-w-md text-xs text-fg-muted">{error}</p>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="pixel-press mt-1 h-11 cursor-pointer border-2 border-black/60 bg-iron px-4 text-xs font-black uppercase tracking-[0.1em] text-parchment shadow-sm transition-colors hover:border-accent hover:text-accent"
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
        <tr key={`skeleton-${rowIdx}`} className="border-b border-iron-light/20">
          {columns.map((col) => (
            <td key={col.key} className="px-5 py-3.5">
              <div
                className="h-4 animate-pulse bg-iron-light/25"
                style={{ width: `${50 + ((rowIdx * 17 + col.key.length * 11) % 40)}%` }}
              />
            </td>
          ))}
          {(onUpdate || onDelete) && (
            <td className="px-5 py-3.5 text-right">
              <div className="ml-auto h-4 w-12 animate-pulse bg-iron-light/25" />
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
              <span className="flex h-14 w-14 items-center justify-center border-2 border-black/60 bg-iron shadow-sm">
                <Inbox className="h-7 w-7 text-parchment-dim" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-fg">{emptyTitle}</p>
                {emptyHint && <p className="mx-auto mt-1 max-w-md text-xs text-fg-muted">{emptyHint}</p>}
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
          className={[
            "group border-b border-iron-light/20 transition-colors hover:bg-iron-light/12",
            onRowClick ? "cursor-pointer" : "",
            /* Selected also gets a gold left edge, so the row is not marked by
               fill alone. */
            isSelected ? "bg-accent/12 shadow-[inset_3px_0_0_var(--color-accent)]" : "",
          ].join(" ")}
        >
          {columns.map((col) => (
            <td key={col.key} className="whitespace-nowrap px-5 py-3.5 text-sm text-parchment">
              {col.render
                ? col.render((item as Record<string, unknown>)[col.key] as never, item)
                : String((item as Record<string, unknown>)[col.key] ?? "")}
            </td>
          ))}
          {(onUpdate || onDelete) && (
            <td className="whitespace-nowrap px-5 py-3.5 text-right">
              <div className="flex items-center justify-end gap-1">
                {onUpdate && (
                  <button
                    title="Update"
                    aria-label="Update"
                    onClick={() => onUpdate(item)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent text-parchment-dim transition-colors hover:border-accent hover:text-accent"
                  >
                    <Edit2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                {onDelete && (
                  <button
                    title="Delete"
                    aria-label="Delete"
                    onClick={() => onDelete(item)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-transparent text-parchment-dim transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
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
    <div className="pixel-bevel-plate overflow-hidden border-2 border-black/60">
      {/* Head strip */}
      <div className="flex flex-col justify-between gap-3 border-b-2 border-black/60 bg-iron-dark px-4 py-3 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-accent">
          {title}
          {loading && data.length > 0 && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" aria-hidden="true" />
          )}
        </h2>
        <div className="flex items-center gap-2">
          {!serverSide && (
            <div className="flex items-center gap-2 border-2 border-black/60 bg-surface-2 px-2.5 focus-within:border-accent">
              <Search className="h-4 w-4 shrink-0 text-parchment-dim" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search..."
                aria-label={`Search ${title}`}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="h-11 w-40 min-w-0 bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none sm:w-48"
              />
            </div>
          )}
          {onCreate && (
            <button
              onClick={onCreate}
              className="pixel-press flex h-11 cursor-pointer items-center gap-2 border-2 border-accent bg-accent px-4 text-xs font-black uppercase tracking-[0.1em] text-on-accent shadow-sm transition-colors hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Create
            </button>
          )}
        </div>
      </div>

      {/* Register */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-iron-dark/95">
            <tr className="border-b-2 border-black/60">
              {columns.map((col) => {
                const sortable = Boolean(col.sortable && onSort);
                return (
                  <th
                    key={col.key}
                    aria-sort={
                      sortable && sortBy === col.key
                        ? sortOrder === "asc" ? "ascending" : "descending"
                        : undefined
                    }
                    onClick={() => sortable && onSort?.(col.key)}
                    className={`whitespace-nowrap px-5 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-parchment-dim ${
                      sortable ? "cursor-pointer transition-colors hover:text-accent" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {sortable && getSortIcon(col.key)}
                    </div>
                  </th>
                );
              })}
              {(onUpdate || onDelete) && (
                <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-[0.15em] text-parchment-dim">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
      </div>

      {/* Foot strip / pager */}
      {!error && totalItems > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t-2 border-black/60 bg-iron-dark px-4 py-2.5 sm:flex-row">
          <p className="text-[11px] tabular-nums text-parchment-dim">
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
                className="h-11 cursor-pointer border-2 border-black/60 bg-surface-2 px-2 text-xs text-fg focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-1">
              <button
                aria-label="Previous page"
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage === 1}
                className="pixel-press flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="px-2 text-xs tabular-nums text-parchment">
                {safePage} / {totalPages}
              </span>
              <button
                aria-label="Next page"
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="pixel-press flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
