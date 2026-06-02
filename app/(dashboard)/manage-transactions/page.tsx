"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Search, Download } from "lucide-react";

export default function ManageTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "playerId", label: "Player ID" },
    { key: "playerName", label: "Player Name" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "currency", label: "Currency" },
    { key: "createdAt", label: "Date" },
    { 
      key: "status", 
      label: "Status",
      render: (val: string) => {
        const styles: Record<string, string> = {
          Completed: "bg-emerald-400/10 text-emerald-400",
          Pending: "bg-yellow-400/10 text-yellow-400",
          Failed: "bg-red-400/10 text-red-400",
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[val]}`}>{val}</span>;
      }
    },
  ];

  const mockData = [
    { id: "TXN-001", playerId: "P-001", playerName: "Hero123", type: "Purchase", amount: 4.99, currency: "USD", createdAt: "2024-03-01", status: "Completed" },
    { id: "TXN-002", playerId: "P-002", playerName: "MageKing", type: "Purchase", amount: 9.99, currency: "USD", createdAt: "2024-03-02", status: "Completed" },
    { id: "TXN-003", playerId: "P-003", playerName: "ShadowHunter", type: "Refund", amount: 4.99, currency: "USD", createdAt: "2024-03-03", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Transactions</h1>
        <p className="text-white/50 text-sm">View and manage all payment transactions.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors w-full sm:w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
              <span className="text-white/40">-</span>
              <input 
                type="date" 
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {columns.map((col) => (
                  <th key={col.key} className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-sm text-white/80 whitespace-nowrap">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-white/50">
          <div>Showing {mockData.length} results</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-white/10 rounded bg-[#ffc032]/10 text-[#ffc032] border-[#ffc032]/20 cursor-pointer">1</button>
            <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 hover:text-white transition-colors cursor-pointer">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
