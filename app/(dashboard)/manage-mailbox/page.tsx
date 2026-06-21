"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Plus,
  Search,
  Trash2,
  Package,
  Eye,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  Gift,
  Crown,
  Zap,
  Inbox,
} from "lucide-react";
import { MailResponse, markAsRead, claimReward, remove } from "@/lib/api/mail";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import AdminTable from "@/components/ui/AdminTable";

const MAIL_TYPE_CONFIG: Record<
  string,
  { icon: typeof Star; color: string; bg: string; border: string }
> = {
  System: { icon: Star, color: "text-gray-300", bg: "bg-gray-500/15", border: "border-gray-500/30" },
  Gift: { icon: Gift, color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30" },
  Event: { icon: Crown, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  Compensation: { icon: Zap, color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const columns = [
  { key: "mailId", label: "#" },
  {
    key: "playerName",
    label: "Player",
    render: (val: string) => (
      <p className="text-sm text-white truncate max-w-[120px]">
        {val || "All Players"}
      </p>
    ),
  },
  {
    key: "title",
    label: "Title",
    render: (val: string) => (
      <p className="text-sm text-white truncate max-w-[200px]">{val}</p>
    ),
  },
  {
    key: "type",
    label: "Type",
    render: (val: string) => {
      const typeConfig = MAIL_TYPE_CONFIG[val] ?? MAIL_TYPE_CONFIG["System"];
      const TypeIcon = typeConfig.icon;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
        >
          <TypeIcon className="w-3 h-3" />
          {val}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (_: any, mail: MailResponse) => (
      <div className="flex flex-col gap-1 items-start">
        {!mail.isRead && (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
            New
          </span>
        )}
        {mail.isClaimed && (
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
            Claimed
          </span>
        )}
      </div>
    ),
  },
];

export default function ManageMailboxPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [filterClaimed, setFilterClaimed] = useState<string>("all");

  const { data: mails, totalCount, loading, error, setPageSize: setQP, setParams, refresh } =
    usePagedQuery<MailResponse>({
      endpoint: "/api/mails",
      pageSize: 10,
      params: {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(filterRead !== "all" ? { isRead: filterRead === "read" } : {}),
        ...(filterClaimed !== "all" ? { isClaimed: filterClaimed === "claimed" } : {}),
      },
    });

  const [selectedMail, setSelectedMail] = useState<MailResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectMail = async (mail: MailResponse) => {
    setSelectedMail(mail);
    if (!mail.isRead) {
      try {
        const updated = await markAsRead(mail.mailId);
        setSelectedMail(updated);
        refresh();
      } catch {
        // silently continue
      }
    }
  };

  const handleClaim = async () => {
    if (!selectedMail || selectedMail.isClaimed) return;
    try {
      setActionLoading(selectedMail.mailId);
      const updated = await claimReward(selectedMail.mailId);
      setSelectedMail(updated);
      refresh();
      showToast("success", "Reward claimed!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to claim reward.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (mail: MailResponse) => {
    if (!confirm(`Delete mail "${mail.title}"?`)) return;
    try {
      setActionLoading(mail.mailId);
      await remove(mail.mailId, mail.playerProfileId);
      if (selectedMail?.mailId === mail.mailId) setSelectedMail(null);
      showToast("success", "Mail deleted.");
      refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete mail.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Mail className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Mailbox</h1>
            <p className="text-sm text-gray-500">Create and manage player mail</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setParams({
                  ...(e.target.value.trim() ? { search: e.target.value.trim() } : {}),
                  ...(filterRead !== "all" ? { isRead: filterRead === "read" } : {}),
                  ...(filterClaimed !== "all" ? { isClaimed: filterClaimed === "claimed" } : {}),
                });
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter by read status"
            value={filterRead}
            onChange={(e) => {
              setFilterRead(e.target.value);
              setPage(1);
              setParams({
                ...(search.trim() ? { search: search.trim() } : {}),
                ...(e.target.value !== "all" ? { isRead: e.target.value === "read" } : {}),
                ...(filterClaimed !== "all" ? { isClaimed: filterClaimed === "claimed" } : {}),
              });
            }}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <select
            aria-label="Filter by claim status"
            value={filterClaimed}
            onChange={(e) => {
              setFilterClaimed(e.target.value);
              setPage(1);
              setParams({
                ...(search.trim() ? { search: search.trim() } : {}),
                ...(filterRead !== "all" ? { isRead: filterRead === "read" } : {}),
                ...(e.target.value !== "all" ? { isClaimed: e.target.value === "claimed" } : {}),
              });
            }}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
          >
            <option value="all">All Claims</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
          </select>
          {(search || filterRead !== "all" || filterClaimed !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterRead("all");
                setFilterClaimed("all");
                setPage(1);
                setParams({});
              }}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-sm transition-colors shrink-0 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
        <Link
          href="/manage-mailbox/create"
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Send Mail
        </Link>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            toastMsg.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm flex-1">{toastMsg.text}</p>
          <button onClick={() => setToastMsg(null)} aria-label="Dismiss notification" className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button onClick={() => setParams({})} aria-label="Dismiss error" className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Mail List */}
        <div className="min-w-0">
          <AdminTable
            title={`Total Mails: ${totalCount.toLocaleString()}`}
            columns={columns}
            data={mails}
            loading={loading}
            serverSide
            pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
            onDelete={handleDelete}
            onRowClick={handleSelectMail}
            selectedId={selectedMail?.mailId}
            idField="mailId"
          />
        </div>

        {/* Mail Detail Panel */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden h-fit xl:sticky xl:top-6">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Mail Detail</h2>
          </div>

          {selectedMail ? (() => {
            const typeConfig = MAIL_TYPE_CONFIG[selectedMail.type] ?? MAIL_TYPE_CONFIG["System"];
            const TypeIcon = typeConfig.icon;
            const isActing = actionLoading === selectedMail.mailId;
            const hasReward =
              Number(selectedMail.attachedGold) > 0 ||
              Number(selectedMail.attachedGems) > 0 ||
              (selectedMail.attachedItemId && selectedMail.attachedItemQuantity > 0);

            return (
              <div className="p-5 space-y-4">
                {/* Type badge + read status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}>
                    <TypeIcon className="w-3 h-3" />
                    {selectedMail.type}
                  </span>
                  {!selectedMail.isRead && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      New
                    </span>
                  )}
                  {selectedMail.isClaimed && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                      Claimed
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-tight">{selectedMail.title}</h3>

                {/* Meta */}
                <div className="space-y-1 text-xs text-gray-500">
                  <p>
                    <span className="text-gray-400">To:</span>{" "}
                    <span className="text-white">{selectedMail.playerName || "All Players"}</span>
                  </p>
                  <p>
                    <span className="text-gray-400">Sent:</span>{" "}
                    <span className="text-white">{formatDate(selectedMail.sentAt)}</span>
                  </p>
                  {selectedMail.expiredAt && (
                    <p>
                      <span className="text-gray-400">Expires:</span>{" "}
                      <span className="text-orange-400">{formatDate(selectedMail.expiredAt)}</span>
                    </p>
                  )}
                </div>

                {/* Rewards */}
                {hasReward && (
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      Attached Rewards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Number(selectedMail.attachedGold) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                          {Number(selectedMail.attachedGold).toLocaleString()} Gold
                        </span>
                      )}
                      {Number(selectedMail.attachedGems) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {Number(selectedMail.attachedGems).toLocaleString()} Gems
                        </span>
                      )}
                      {selectedMail.attachedItemName && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          {selectedMail.attachedItemName}
                          {selectedMail.attachedItemQuantity > 1 && ` x${selectedMail.attachedItemQuantity}`}
                        </span>
                      )}
                    </div>
                    {!selectedMail.isClaimed && (
                      <button
                        onClick={handleClaim}
                        disabled={isActing}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      >
                        {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                        Claim Reward
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="bg-[#111] border border-gray-800 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMail.content || <span className="italic text-gray-600">No content</span>}
                  </p>
                </div>

                {/* Delete action */}
                <button
                  onClick={() => handleDelete(selectedMail)}
                  disabled={isActing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50 w-full justify-center"
                >
                  {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete Mail
                </button>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <Eye className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Select a mail to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
