"use client";

import { PurchaseHistoryResponse } from "@/lib/api/purchase-histories";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { CreditCard, Search } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";

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
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${styles[currency] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
        {currency}
      </span>
    );
  };

  const columns = [
    { key: "purchaseHistoryId", label: "ID" },
    { key: "playerName", label: "Player Name" },
    { key: "itemName", label: "Item Name" },
    { key: "quantity", label: "Quantity" },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (val: number, item: PurchaseHistoryResponse) => (
        <span className="text-[#ffc032] font-semibold">{formatPrice(val, item.currency)}</span>
      ),
    },
    {
      key: "currency",
      label: "Currency",
      render: (val: string) => getCurrencyBadge(val),
    },
    {
      key: "purchasedAt",
      label: "Purchased At",
      render: (val: string) => <span className="text-gray-400">{formatDate(val)}</span>,
    },
  ];

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
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter by player name..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
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
        title={`Total Transactions: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={transactions}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="purchaseHistoryId"
      />
    </div>
  );
}
