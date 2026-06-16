"use client";

import { useRouter } from "next/navigation";
import { ShopItemResponse } from "@/lib/api/shop";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Search, Loader2, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function ManageShopPage() {
  const router = useRouter();

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
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value || undefined });
  };

  const currencyColors: Record<string, string> = {
    Gold: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Gems: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    USD: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Shop</h1>
                <p className="text-gray-400">Manage shop items, pricing, and availability.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/manage-shop/create")}
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Add Shop Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Filter by item name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <select
              aria-label="Filter shop items by currency"
              onChange={(e) => setParams({ currency: e.target.value || undefined })}
              className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
            >
              <option value="">All currencies</option>
              <option value="Gold">Gold</option>
              <option value="Gems">Gems</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Currency</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && shopItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : shopItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No shop items found
                      </td>
                    </tr>
                  ) : (
                    shopItems.map((item) => (
                      <tr key={item.shopItemId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.shopItemId}</td>
                        <td className="px-6 py-4 text-white font-medium">{item.itemName}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400">💰 {item.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${currencyColors[item.currency] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
                            {item.currency}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {item.stock === -1 ? (
                            <span className="text-green-400">Unlimited</span>
                          ) : (
                            item.stock
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {item.isActive ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/manage-shop/update?id=${item.shopItemId}`)}
                            className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Shop Items: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
          </div>
        )}
      </div>
    </div>
  );
}
