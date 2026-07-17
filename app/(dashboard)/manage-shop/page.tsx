"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gem, Package, Plus, RefreshCcw, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import type { ShopItemResponse } from "@/lib/api/shop-items";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import AdminTable from "@/components/ui/AdminTable";

const CURRENCY_FILTERS = [
  { value: "", label: "All Currencies" },
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
];

const SECTION_FILTERS = [
  { value: "", label: "All Sections" },
  { value: "Fixed", label: "Fixed" },
  { value: "DailyDeal", label: "Daily Deal" },
];

const STATUS_FILTERS = [
  { value: "", label: "All Status" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const currencyTone: Record<string, string> = {
  Gold: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
  Gems: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
};

function buildParams(filters: {
  searchTerm: string;
  currency: string;
  shopSection: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  return {
    ...(filters.searchTerm.trim() ? { search: filters.searchTerm.trim() } : {}),
    ...(filters.currency ? { currency: filters.currency } : {}),
    ...(filters.shopSection ? { shopSection: filters.shopSection } : {}),
    ...(filters.status ? { isActive: filters.status === "true" } : {}),
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };
}

function formatCurrency(value: number, currency: string) {
  return `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

function stockLabel(stock: number) {
  if (stock < 0) return "Unlimited";
  if (stock === 0) return "Sold out";
  return stock.toLocaleString();
}

function limitLabel(daily: number, weekly: number) {
  const dailyText = daily > 0 ? `D ${daily}` : "D none";
  const weeklyText = weekly > 0 ? `W ${weekly}` : "W none";
  return `${dailyText} / ${weeklyText}`;
}

function formatDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function availabilityLabel(item: ShopItemResponse) {
  const now = Date.now();
  const from = item.availableFrom ? new Date(item.availableFrom).getTime() : null;
  const to = item.availableTo ? new Date(item.availableTo).getTime() : null;

  if (!item.isActive) return { label: "Inactive", tone: "text-red-300 bg-red-500/10 border-red-500/20" };
  if (from && from > now) return { label: "Scheduled", tone: "text-blue-300 bg-blue-500/10 border-blue-500/20" };
  if (to && to < now) return { label: "Expired", tone: "text-orange-300 bg-orange-500/10 border-orange-500/20" };
  if (!from && !to) return { label: "Always", tone: "text-green-300 bg-green-500/10 border-green-500/20" };
  return { label: "Live", tone: "text-green-300 bg-green-500/10 border-green-500/20" };
}

export default function ManageShopPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("shopItemId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    data: shopItems,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<ShopItemResponse>({
    endpoint: "/api/shopitems",
    pageSize: 10,
    params: buildParams({ searchTerm, currency: filterCurrency, shopSection: filterSection, status: filterStatus, sortBy, sortOrder }),
  });

  const pageStats = useMemo(() => {
    const fixed = shopItems.filter((item) => item.shopSection === "Fixed").length;
    const dailyDeals = shopItems.filter((item) => item.shopSection === "DailyDeal").length;
    const active = shopItems.filter((item) => item.isActive).length;
    const soldOut = shopItems.filter((item) => item.stock === 0).length;
    return { fixed, dailyDeals, active, soldOut };
  }, [shopItems]);

  const applyFilters = (next?: Partial<{ searchTerm: string; currency: string; shopSection: string; status: string; sortBy: string; sortOrder: "asc" | "desc" }>) => {
    const merged = {
      searchTerm,
      currency: filterCurrency,
      shopSection: filterSection,
      status: filterStatus,
      sortBy,
      sortOrder,
      ...next,
    };
    setParams(buildParams(merged));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    applyFilters({ sortBy: value, sortOrder: nextOrder });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCurrency("");
    setFilterSection("");
    setFilterStatus("");
    setPage(1);
    setParams(buildParams({ searchTerm: "", currency: "", shopSection: "", status: "", sortBy, sortOrder }));
  };

  const columns = [
    { key: "shopItemId", label: "ID", sortable: true },
    {
      key: "name",
      label: "Item",
      sortable: true,
      render: (_: never, item: ShopItemResponse) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            {item.itemIconUrl ? (
              <img
                src={item.itemIconUrl}
                alt={item.itemName || "Shop item"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Package className="h-4 w-4 text-white/35" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{item.itemName || `Item #${item.itemId}`}</p>
            <p className="mt-0.5 text-xs text-white/40">#{item.itemId}{item.itemType ? ` / ${item.itemType}` : ""}</p>
          </div>
        </div>
      ),
    },
    {
      key: "shopSection",
      label: "Section",
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-200">
          {value === "DailyDeal" ? "Daily Deal" : "Fixed"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (value: number, item: ShopItemResponse) => (
        <span className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold ${currencyTone[item.currency] || "border-white/10 bg-white/5 text-white/70"}`}>
          {item.currency === "Gems" ? <Gem className="h-3.5 w-3.5" /> : <Coins className="h-3.5 w-3.5" />}
          {formatCurrency(value, item.currency)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (value: number) => (
        <span className={value === 0 ? "font-semibold text-red-300" : value < 0 ? "font-semibold text-green-300" : "font-semibold text-white/80"}>
          {stockLabel(value)}
        </span>
      ),
    },
    {
      key: "limits",
      label: "Limits",
      render: (_: never, item: ShopItemResponse) => (
        <span className="text-xs font-semibold text-white/65">{limitLabel(item.dailyPurchaseLimit, item.weeklyPurchaseLimit)}</span>
      ),
    },
    {
      key: "availableFrom",
      label: "Availability",
      render: (_: never, item: ShopItemResponse) => {
        const availability = availabilityLabel(item);
        return (
          <div className="min-w-[150px]">
            <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${availability.tone}`}>{availability.label}</span>
            {(item.availableFrom || item.availableTo) && (
              <p className="mt-1 text-xs text-white/40">
                {formatDate(item.availableFrom) || "Now"} - {formatDate(item.availableTo) || "No end"}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (value: boolean) => (
        <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${value ? "border-green-500/20 bg-green-500/10 text-green-300" : "border-red-500/20 bg-red-500/10 text-red-300"}`}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ffc032] text-[#111]">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Shop</h1>
            <p className="text-sm text-white/45">Items, pricing, stock, and availability windows</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            title="Refresh"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:text-white"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => router.push("/manage-shop/create")}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#ffc032] px-4 text-sm font-semibold text-[#111] transition-colors hover:bg-[#ffd04c]"
          >
            <Plus className="h-4 w-4" />
            Create Shop Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Total</p>
          <p className="mt-2 text-2xl font-black text-white">{totalCount.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Active On Page</p>
          <p className="mt-2 text-2xl font-black text-green-300">{pageStats.active}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Daily Deals</p>
          <p className="mt-2 text-2xl font-black text-purple-200">{pageStats.dailyDeals}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Sold Out</p>
          <p className="mt-2 text-2xl font-black text-red-300">{pageStats.soldOut}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white/70">
          <SlidersHorizontal className="h-4 w-4 text-[#ffc032]" />
          Filters
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_180px_160px_100px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search item name"
              value={searchTerm}
              onChange={(event) => {
                const value = event.target.value;
                setSearchTerm(value);
                setPage(1);
                applyFilters({ searchTerm: value });
              }}
              className="h-10 w-full rounded-lg border border-white/10 bg-[#0d0d0d] pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#ffc032] focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by currency"
            value={filterCurrency}
            onChange={(event) => {
              const value = event.target.value;
              setFilterCurrency(value);
              setPage(1);
              applyFilters({ currency: value });
            }}
            className="h-10 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white focus:border-[#ffc032] focus:outline-none"
          >
            {CURRENCY_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            aria-label="Filter by shop section"
            value={filterSection}
            onChange={(event) => {
              const value = event.target.value;
              setFilterSection(value);
              setPage(1);
              applyFilters({ shopSection: value });
            }}
            className="h-10 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white focus:border-[#ffc032] focus:outline-none"
          >
            {SECTION_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            aria-label="Filter by active status"
            value={filterStatus}
            onChange={(event) => {
              const value = event.target.value;
              setFilterStatus(value);
              setPage(1);
              applyFilters({ status: value });
            }}
            className="h-10 rounded-lg border border-white/10 bg-[#0d0d0d] px-3 text-sm text-white focus:border-[#ffc032] focus:outline-none"
          >
            {STATUS_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="h-10 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm font-semibold text-white/65 transition-colors hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">{error}</p>
          <button type="button" onClick={refresh} className="mt-2 text-sm text-red-200 underline">Retry</button>
        </div>
      )}

      <AdminTable
        title="Shop Items"
        columns={columns}
        data={shopItems}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(item) => router.push(`/manage-shop/update?id=${item.shopItemId}`)}
        idField="shopItemId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
        emptyTitle="No shop items found"
        emptyHint="Try another filter or create a new shop item."
      />
    </div>
  );
}