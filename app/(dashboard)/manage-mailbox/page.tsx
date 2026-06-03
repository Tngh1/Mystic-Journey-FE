"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ArrowLeft, Search, Send } from "lucide-react";

export default function ManageMailboxPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  type MailboxItem = {
    id: number;
    recipientId: string;
    recipientName: string;
    subject: string;
    type: string;
    createdAt: string;
    isRead: boolean;
  };

  type ColumnKey = keyof MailboxItem;

  const columns: Array<{
    key: ColumnKey;
    label: string;
    render?: (val: MailboxItem[ColumnKey], item: MailboxItem) => React.ReactNode;
  }> = [
    { key: "id", label: "ID" },
    { key: "recipientId", label: "Recipient ID" },
    { key: "recipientName", label: "Recipient Name" },
    { key: "subject", label: "Subject" },
    { key: "type", label: "Type" },
    { key: "createdAt", label: "Sent At" },
    { 
      key: "isRead", 
      label: "Status",
      render: (val) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${val ? 'bg-emerald-400/10 text-emerald-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
          {val ? 'Read' : 'Unread'}
        </span>
      )
    },
  ];

  const mockData: MailboxItem[] = [
    { id: 1, recipientId: "P-001", recipientName: "Hero123", subject: "Welcome Gift!", type: "Gift", createdAt: "2024-03-01", isRead: true },
    { id: 2, recipientId: "P-002", recipientName: "MageKing", subject: "Event Announcement", type: "Event", createdAt: "2024-03-02", isRead: false },
    { id: 3, recipientId: "P-003", recipientName: "ShadowHunter", subject: "Account Inquiry Reply", type: "Support", createdAt: "2024-03-03", isRead: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Manage Mailbox</h1>
        <p className="text-white/50 text-sm">Send and manage player communications.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">Mailbox</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text" 
                placeholder="Search mailbox..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors w-full sm:w-64"
              />
            </div>
            <button 
              onClick={() => router.push("/manage-mailbox/create")}
              className="flex items-center gap-2 bg-[#ffc032] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#ffc032]/90 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Send className="w-4 h-4" /> Send Mail
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
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
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
      </div>
    </div>
  );
}
