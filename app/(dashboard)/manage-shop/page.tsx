"use client";

import { useRouter } from "next/navigation";
import { ShopItemResponse, remove } from "@/lib/api/shop-items";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Search, ShoppingBag, Plus } from "lucide-react";
import { useState } from "react";
import AdminTable from "@/components/ui/AdminTable";

const currencyColors: Record<string, string> = {
  Gold: "text-yellow-400",
  Gems: "text-blue-400",
  USD: "text-green-400",
};

export default function ManageShopPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCurrency, setFilterCurrency] = useState("");

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
    endpoint: '/api/shopitems',
    pageSize: 10,
    params: {
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(filterCurrency ? { currency: filterCurrency } : {}),
    },
  });

  const handleDelete = async (item: ShopItemResponse) => {
    if (!confirm(`Are you sure you want to delete "${item.itemName}" from the shop?`)) return;
    try {
      await remove(item.shopItemId);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete shop item");
    }
  };

  const columns = [
    { key: "shopItemId", label: "ID" },
    {
      key: "itemName",
      label: "Item Name",
      render: (val: string, item: ShopItemResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={item.itemIconUrl || "/images/demo.jpg"}
              alt={val}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
            />
          </div>
          <span className="font-medium text-white">{val}</span>
        </div>
      )
    },
    {
      key: "price",
      label: "Price",
      render: (val: number) => <span className="text-yellow-400 font-semibold">{val.toLocaleString()}</span>
    },
    {
      key: "currency",
      label: "Currency",
      render: (val: string) => <span className={`font-semibold ${currencyColors[val] || "text-gray-300"}`}>{val}</span>
    },
    {
      key: "stock",
      label: "Stock",
      render: (val: number) => val === -1 ? <span className="text-green-400 font-medium">Unlimited</span> : val.toLocaleString()
    },
    {
      key: "dailyPurchaseLimit",
      label: "Daily Limit",
      render: (val: number) => val === 0 ? <span className="text-gray-400">None</span> : val.toLocaleString()
    },
    {
      key: "isActive",
      label: "Status",
      render: (val: boolean) => (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Shop</h1>
            <p className="text-sm text-gray-500">Manage items, pricing, and availability</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
                setParams({
                  ...(e.target.value ? { search: e.target.value } : {}),
                  ...(filterCurrency ? { currency: filterCurrency } : {}),
                });
              }}
              className="w-full pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter by currency"
            value={filterCurrency}
            onChange={(e) => {
              setFilterCurrency(e.target.value);
              setPage(1);
              setParams({
                ...(searchTerm ? { search: searchTerm } : {}),
                ...(e.target.value ? { currency: e.target.value } : {}),
              });
            }}
            className="px-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0 cursor-pointer"
          >
            <option value="">All Currencies</option>
            <option value="Gold">Gold</option>
            <option value="Gems">Gems</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <button
          onClick={() => router.push("/manage-shop/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Shop Item
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title={`Total Shop Items: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={shopItems}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(item) => router.push(`/manage-shop/update?id=${item.shopItemId}`)}
        onDelete={handleDelete}
        idField="shopItemId"
      />
    </div>
  );
}
