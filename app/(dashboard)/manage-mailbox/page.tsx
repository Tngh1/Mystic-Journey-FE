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
  Filter,
} from "lucide-react";
import { MailboxResponse, markAsRead, claimReward, remove } from "@/lib/api/mailboxes";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import AdminTable from "@/components/ui/AdminTable";

const MAILBOX_TYPE_CONFIG: Record<
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
  { key: "mailboxId", label: "#", sortable: true },
  {
    key: "title",
    label: "Title",
    sortable: true,
    render: (val: string, row: MailboxResponse) => {
      const typeConfig = MAILBOX_TYPE_CONFIG[row.type] ?? MAILBOX_TYPE_CONFIG["System"];
      const TypeIcon = typeConfig.icon;
      const isUnread = !row.isRead;
      return (
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${isUnread ? "bg-[#ffc032]" : "bg-gray-600"}`}
            title={isUnread ? "Unread" : "Read"}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-medium truncate max-w-[160px] ${isUnread ? "text-white font-semibold" : "text-gray-400"}`}
              >
                {val}
              </span>
            </div>
            {row.playerName && (
              <span className="text-[10px] text-gray-600 truncate">
                → {row.playerName}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (val: string) => {
      const typeConfig = MAILBOX_TYPE_CONFIG[val] ?? MAILBOX_TYPE_CONFIG["System"];
      const TypeIcon = typeConfig.icon;
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
        >
          <TypeIcon className="w-3 h-3" />
          {val}
        </span>
      );
    },
  },
  {
    key: "sentAt",
    label: "Sent",
    sortable: true,
    render: (val: string) => (
      <span className="text-xs text-gray-500">{formatDate(val)}</span>
    ),
  },
];

export default function ManageMailboxPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [filterClaimed, setFilterClaimed] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("mailboxId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: mailboxes, totalCount, loading, error, setParams, refresh } =
    usePagedQuery<MailboxResponse>({
      endpoint: "/api/mailboxes",
      pageSize: 10,
      params: {
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(filterRead !== "all" ? { isRead: filterRead === "read" } : {}),
        ...(filterClaimed !== "all" ? { isClaimed: filterClaimed === "claimed" } : {}),
      },
    });

  const [selectedMailbox, setSelectedMailbox] = useState<MailboxResponse | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeFiltersCount = [search, filterRead, filterClaimed].filter(
    (v) => v !== "" && v !== "all"
  ).length;

  const showToast = (type: "success" | "error", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSelectMailbox = async (mailbox: MailboxResponse) => {
    setSelectedMailbox(mailbox);
    if (!mailbox.isRead) {
      try {
        const updated = await markAsRead(mailbox.mailboxId);
        setSelectedMailbox(updated);
        refresh();
      } catch {
        // silently continue
      }
    }
  };

  const handleClaim = async () => {
    if (!selectedMailbox || selectedMailbox.isClaimed) return;
    try {
      setActionLoading(selectedMailbox.mailboxId);
      const updated = await claimReward(selectedMailbox.mailboxId);
      setSelectedMailbox(updated);
      refresh();
      showToast("success", "Reward claimed!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to claim reward.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (mailbox: MailboxResponse) => {
    if (!confirm(`Delete mailbox "${mailbox.title}"?`)) return;
    try {
      setActionLoading(mailbox.mailboxId);
      await remove(mailbox.mailboxId, mailbox.playerProfileId);
      if (selectedMailbox?.mailboxId === mailbox.mailboxId) setSelectedMailbox(null);
      showToast("success", "Mailbox deleted.");
      refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete mailbox.");
    } finally {
      setActionLoading(null);
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setFilterRead("all");
    setFilterClaimed("all");
    setPage(1);
    setParams({});
  };

  const buildParams = (overrides: Record<string, unknown> = {}) => ({
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(filterRead !== "all" ? { isRead: filterRead === "read" } : {}),
    ...(filterClaimed !== "all" ? { isClaimed: filterClaimed === "claimed" } : {}),
    ...overrides,
  });

  const handleSortChange = (value: string) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0 shadow-lg shadow-[#ffc032]/20">
            <Mail className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Mailbox</h1>
            <p className="text-sm text-gray-500">Create and manage player mail</p>
          </div>
        </div>
        <Link
          href="/manage-mailbox/create"
          className="flex items-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#ffd04c] transition-colors shadow-lg shadow-[#ffc032]/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Send Mail
        </Link>
      </div>

      {/* Filters Row */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4">
        {/* Top row: search + toggle + send */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                setParams(buildParams(
                  e.target.value.trim() ? { search: e.target.value.trim() } : {}
                ));
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setParams(buildParams({}));
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#ffc032]/10 border-[#ffc032]/40 text-[#ffc032]"
                  : "bg-[#111] border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#ffc032] text-[#111] text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 text-gray-500 hover:text-red-400 text-sm transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="filter-read" className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Read Status
              </label>
              <select
                id="filter-read"
                value={filterRead}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterRead(value);
                  setPage(1);
                  setParams(buildParams(
                    value !== "all" ? { isRead: value === "read" } : {}
                  ));
                }}
                className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors cursor-pointer"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>

            <div>
              <label htmlFor="filter-claim" className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Claim Status
              </label>
              <select
                id="filter-claim"
                value={filterClaimed}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterClaimed(value);
                  setPage(1);
                  setParams(buildParams(
                    value !== "all" ? { isClaimed: value === "claimed" } : {}
                  ));
                }}
                className="w-full px-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors cursor-pointer"
              >
                <option value="all">All</option>
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed">Claimed</option>
              </select>
            </div>
          </div>
        )}
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
          <button
            onClick={() => setToastMsg(null)}
            aria-label="Dismiss notification"
            className="opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button
            onClick={() => setParams({})}
            aria-label="Dismiss error"
            className="opacity-60 hover:opacity-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Mailbox List */}
        <div className="min-w-0">
          <AdminTable
            title="Mailboxes"
            columns={columns}
            data={mailboxes}
            loading={loading}
            serverSide
            pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
            onRowClick={handleSelectMailbox}
            selectedId={selectedMailbox?.mailboxId}
            idField="mailboxId"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSortChange}
          />
        </div>

        {/* Mailbox Detail Panel */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden h-fit xl:sticky xl:top-6">
          <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Mailbox Detail
            </h2>
            {selectedMailbox && (
              <span className="text-xs text-gray-600 font-mono">
                #{selectedMailbox.mailboxId}
              </span>
            )}
          </div>

          {selectedMailbox ? (() => {
            const typeConfig = MAILBOX_TYPE_CONFIG[selectedMailbox.type] ?? MAILBOX_TYPE_CONFIG["System"];
            const TypeIcon = typeConfig.icon;
            const isActing = actionLoading === selectedMailbox.mailboxId;
            const hasReward =
              Number(selectedMailbox.attachedGold) > 0 ||
              Number(selectedMailbox.attachedGems) > 0 ||
              (selectedMailbox.attachedItems &&
                selectedMailbox.attachedItems.some((i) => i.quantity > 0));

            return (
              <div className="p-5 space-y-4">
                {/* Type + Status badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {selectedMailbox.type}
                  </span>
                  {!selectedMailbox.isRead && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      New
                    </span>
                  )}
                  {selectedMailbox.isClaimed && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                      Claimed
                    </span>
                  )}
                  {selectedMailbox.isDeleted && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                      Deleted
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedMailbox.title}
                </h3>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#111] border border-white/10 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recipient</p>
                    <p className="text-sm text-white truncate" title={selectedMailbox.playerName || "All Players"}>
                      {selectedMailbox.playerName || "All Players"}
                    </p>
                  </div>
                  <div className="bg-[#111] border border-white/10 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sent</p>
                    <p className="text-sm text-white leading-tight">{formatDate(selectedMailbox.sentAt)}</p>
                  </div>
                </div>

                {selectedMailbox.expiredAt && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">Expires</p>
                      <p className="text-sm text-orange-300">{formatDate(selectedMailbox.expiredAt)}</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Message
                  </p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMailbox.content || (
                      <span className="italic text-gray-600">No content</span>
                    )}
                  </p>
                </div>

                {/* Rewards */}
                {hasReward && (
                  <div className="bg-[#111] border border-white/10 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      Attached Rewards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Number(selectedMailbox.attachedGold) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                          {Number(selectedMailbox.attachedGold).toLocaleString()} Gold
                        </span>
                      )}
                      {Number(selectedMailbox.attachedGems) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {Number(selectedMailbox.attachedGems).toLocaleString()} Gems
                        </span>
                      )}
                      {selectedMailbox.attachedItems &&
                        selectedMailbox.attachedItems.map((it, idx) =>
                          it.itemName ? (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            >
                              {it.itemName}
                              {it.quantity > 1 && ` x${it.quantity}`}
                            </span>
                          ) : null
                        )}
                    </div>
                    {!selectedMailbox.isClaimed && (
                      <button
                        onClick={handleClaim}
                        disabled={isActing}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isActing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Claim Reward
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleDelete(selectedMailbox)}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isActing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                  <Link
                    href="/manage-mailbox/create"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-xl text-sm font-medium transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    New Mailbox
                  </Link>
                </div>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-gray-700" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">No mailbox selected</p>
              <p className="text-xs text-gray-600 mb-5">
                Click on a mailbox in the list to view its details
              </p>
              <Link
                href="/manage-mailbox/create"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ffc032] text-[#111] rounded-xl text-sm font-bold hover:bg-[#ffd04c] transition-colors shadow-lg shadow-[#ffc032]/20"
              >
                <Plus className="w-4 h-4" />
                Send First Mailbox
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
