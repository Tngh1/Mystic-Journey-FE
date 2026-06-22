'use client';

import { useRouter } from "next/navigation";
import { ShopItemResponse } from "@/lib/api/shop";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Search, ShoppingBag, Plus } from "lucide-react";
import { useState } from "react";

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

  const currencyColors: Record<string, string> = {
    Gold: "text-yellow-400",
    Gems: "text-blue-400",
    USD: "text-green-400",
  };

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

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
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
            className="px-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
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

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && shopItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : shopItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">No shop items found</td>
                </tr>
              ) : (
                shopItems.map((item) => (
                  <tr key={item.shopItemId} className="border-b border-gray-800/50 hover:bg-[#1e1e1e] transition-colors group">
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{item.shopItemId}</td>
                    <td className="px-5 py-3.5 text-sm text-white font-medium">{item.itemName}</td>
                    <td className="px-5 py-3.5 text-sm text-yellow-400">{item.price}</td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold ${currencyColors[item.currency] || "text-gray-300"}`}>{item.currency}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-300">
                      {item.stock === -1 ? <span className="text-green-400">Unlimited</span> : item.stock}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${item.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => router.push(`/manage-shop/update?id=${item.shopItemId}`)}
                        className="px-3 py-1.5 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-xs font-semibold"
                      >
                        Update
                      </button>
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
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                className="p-1.5 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
