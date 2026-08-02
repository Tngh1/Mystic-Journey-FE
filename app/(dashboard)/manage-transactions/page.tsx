"use client";

import { PurchaseHistoryResponse } from "@/lib/api/purchase-histories";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { CreditCard, Search, X } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import { useState } from "react";

export default function ManageTransactionsPage() {
  const [sortBy, setSortBy] = useState("purchaseHistoryId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTransaction, setSelectedTransaction] = useState<PurchaseHistoryResponse | null>(null);

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
    return `${Number(price).toLocaleString()}`;
  };

  const getCurrencyBadge = (currency: string) => {
    const styles: Record<string, string> = {
      Gold: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
      Gems: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
      USD: "bg-green-500/20 text-green-400 border border-green-500/30",
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${styles[currency] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
        {currency}
      </span>
    );
  };

  const columns = [
    { key: "purchaseHistoryId", label: "ID", sortable: true },
    { key: "playerName", label: "Player Name", sortable: true },
    { 
      key: "itemName", 
      label: "Item", 
      sortable: true,
      render: (val: string, item: PurchaseHistoryResponse) => (
        <div className="flex items-center gap-3">
          {item.itemIconUrl ? (
            <img src={item.itemIconUrl} alt={val} className="w-8 h-8 rounded object-cover border border-white/10 shrink-0 bg-[#111]" />
          ) : (
            <div className="w-8 h-8 rounded bg-white/5 border border-white/10 shrink-0" />
          )}
          <span className="font-medium">{val}</span>
        </div>
      )
    },
    { key: "quantity", label: "Quantity", sortable: true },
    {
      key: "totalPrice",
      label: "Total Price",
      sortable: true,
      render: (val: number, item: PurchaseHistoryResponse) => (
        <span className="text-[#ffc032] font-semibold">{formatPrice(val, item.currency)}</span>
      ),
    },
    {
      key: "currency",
      label: "Currency",
      sortable: true,
      render: (val: string) => getCurrencyBadge(val),
    },
    {
      key: "purchasedAt",
      label: "Purchased At",
      sortable: true,
      render: (val: string) => <span className="text-gray-400">{formatDate(val)}</span>,
    },
  ];

  const handleSortChange = (value: string) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <CreditCard className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Transactions</h1>
            <p className="text-sm text-gray-500">View and search all player purchase histories</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by player name..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      {/* Table */}
      <AdminTable
        title="Transactions"
        columns={columns}
        data={transactions}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="purchaseHistoryId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
        onRowClick={(item) => setSelectedTransaction(item)}
      />

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#151515]">
              <h2 className="text-lg font-bold text-white">Transaction Detail</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Item Info */}
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                {selectedTransaction.itemIconUrl ? (
                  <img src={selectedTransaction.itemIconUrl} alt={selectedTransaction.itemName || ""} className="w-16 h-16 rounded-lg object-cover bg-black border border-white/10" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-black border border-white/10" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#ffc032]">{selectedTransaction.itemName}</h3>
                  <p className="text-sm text-gray-400">Shop Item ID: #{selectedTransaction.shopItemId}</p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="font-mono text-white">#{selectedTransaction.purchaseHistoryId}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Player</span>
                  <span className="text-white font-medium">{selectedTransaction.playerName} <span className="text-xs text-gray-500">(#{selectedTransaction.playerProfileId})</span></span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Quantity</span>
                  <span className="text-white font-bold">x{selectedTransaction.quantity}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Total Price</span>
                  <span className="text-[#ffc032] font-bold text-base">{formatPrice(selectedTransaction.totalPrice, selectedTransaction.currency)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400">Currency</span>
                  {getCurrencyBadge(selectedTransaction.currency)}
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{formatDate(selectedTransaction.purchasedAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end bg-[#151515]">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
