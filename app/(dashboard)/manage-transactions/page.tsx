"use client";

import { PurchaseHistoryResponse } from "@/lib/api/purchase";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Loader2 } from "lucide-react";

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
    endpoint: "/api/purchase-histories",
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
      Gold: "bg-orange-400/10 text-orange-400",
      Gems: "bg-blue-400/10 text-blue-400",
      USD: "bg-green-400/10 text-green-400",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[currency] || "bg-white/10 text-white/80"}`}>
        {currency}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Transactions</h1>
        <p className="text-white/50 text-sm">View and search all player purchase histories.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filter by player name..."
          onChange={(e) => setParams({ search: e.target.value || undefined })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 w-64"
        />
      </div>

      {error ? (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-red-400">
          {error}
          <button onClick={refresh} className="ml-4 underline cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">
              Purchase History
              {loading && (
                <span className="ml-3 inline-block w-4 h-4 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
              )}
            </h2>
          </div>

          {loading && transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
              <span className="text-white/40 text-sm mt-3">Loading...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/40">
              <p className="text-lg font-medium">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">ID</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Player Name</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Item Name</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Total Price</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Currency</th>
                      <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">Purchased At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap font-mono">#{tx.id}</td>
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap">{tx.playerName}</td>
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap">{tx.itemName}</td>
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap text-center">{tx.quantity}</td>
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap font-medium">{formatPrice(tx.totalPrice, tx.currency)}</td>
                        <td className="p-4 text-sm whitespace-nowrap">{getCurrencyBadge(tx.currency)}</td>
                        <td className="p-4 text-sm text-white/80 whitespace-nowrap">{formatDate(tx.purchasedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-white/50">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of{' '}
                  {totalCount.toLocaleString()} transactions
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-sm text-white">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
