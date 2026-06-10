"use client";

import { PurchaseHistoryResponse } from "@/lib/api/purchase";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Loader2, CreditCard } from "lucide-react";

export default function ManageTransactionsPage() {
  const {
    data: transactions,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<PurchaseHistoryResponse>({
    endpoint: '/api/purchasehistories',
    pageSize: 10,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      return `$${Number(price).toFixed(2)}`;
    }
    return `${Number(price).toLocaleString()} ${currency}`;
  };

  const getCurrencyBadge = (currency: string) => {
    const styles: Record<string, string> = {
      Gold: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      Gems: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      USD: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${styles[currency] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
        {currency}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Manage Transactions</h1>
              <p className="text-gray-400">View and search all player purchase histories.</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Filter by player name..."
                onChange={(e) => setParams({ search: e.target.value || undefined })}
                className="w-full pl-4 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Item Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Total Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Currency</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Purchased At</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.purchaseHistoryId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">#{tx.purchaseHistoryId}</td>
                        <td className="px-6 py-4 text-white font-medium">{tx.playerName}</td>
                        <td className="px-6 py-4 text-gray-300">{tx.itemName}</td>
                        <td className="px-6 py-4 text-center text-gray-300">{tx.quantity}</td>
                        <td className="px-6 py-4 text-[#ffc032] font-semibold">{formatPrice(tx.totalPrice, tx.currency)}</td>
                        <td className="px-6 py-4">{getCurrencyBadge(tx.currency)}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(tx.purchasedAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Transactions: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
                  <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">←</button>
                  <span className="px-3 py-1 text-sm text-white">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">→</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
