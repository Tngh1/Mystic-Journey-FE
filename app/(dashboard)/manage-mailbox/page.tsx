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
  Bell,
  Filter,
} from "lucide-react";
import { MailResponse, markAsRead, claimReward, remove } from "@/lib/api/mails";
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
    key: "title",
    label: "Title",
    render: (val: string, row: MailResponse) => {
      const typeConfig = MAIL_TYPE_CONFIG[row.type] ?? MAIL_TYPE_CONFIG["System"];
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
    render: (val: string) => {
      const typeConfig = MAIL_TYPE_CONFIG[val] ?? MAIL_TYPE_CONFIG["System"];
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

  const { data: mails, totalCount, loading, error, setParams, refresh } =
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
  const activeFiltersCount = [search, filterRead, filterClaimed].filter(
    (v) => v !== "" && v !== "all"
  ).length;
  const unreadCount = mails?.filter((m) => !m.isRead).length ?? 0;

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

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffc032]/15 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-[#ffc032]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Mails</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{unreadCount}</p>
            <p className="text-xs text-gray-500">Unread</p>
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {totalCount - unreadCount}
            </p>
            <p className="text-xs text-gray-500">Read</p>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4">
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
              className="w-full pl-10 pr-10 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
            {search && (
              <button
                aria-label="Clear search"
                onClick={() => {
                  setSearch("");
                  setParams(buildParams({}));
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#ffc032]/10 border-[#ffc032]/40 text-[#ffc032]"
                  : "bg-[#111] border-gray-700 text-gray-400 hover:text-white"
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
                className="px-3 py-2.5 text-gray-500 hover:text-red-400 text-sm transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Read Status
              </label>
              <div className="flex rounded-xl bg-[#111] p-1 gap-1 border border-gray-800">
                {[
                  { value: "all", label: "All" },
                  { value: "unread", label: "Unread" },
                  { value: "read", label: "Read" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilterRead(opt.value);
                      setPage(1);
                      setParams(buildParams(
                        opt.value !== "all" ? { isRead: opt.value === "read" } : {}
                      ));
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      filterRead === opt.value
                        ? "bg-[#ffc032] text-[#111]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                Claim Status
              </label>
              <div className="flex rounded-xl bg-[#111] p-1 gap-1 border border-gray-800">
                {[
                  { value: "all", label: "All" },
                  { value: "unclaimed", label: "Unclaimed" },
                  { value: "claimed", label: "Claimed" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilterClaimed(opt.value);
                      setPage(1);
                      setParams(buildParams(
                        opt.value !== "all" ? { isClaimed: opt.value === "claimed" } : {}
                      ));
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      filterClaimed === opt.value
                        ? "bg-[#ffc032] text-[#111]"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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
            className="opacity-60 hover:opacity-100"
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
            className="opacity-60 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Mail List */}
        <div className="min-w-0">
          <AdminTable
            title={`${totalCount.toLocaleString()} mail${totalCount !== 1 ? "s" : ""}`}
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
          <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Mail Detail
            </h2>
            {selectedMail && (
              <span className="text-xs text-gray-600 font-mono">
                #{selectedMail.mailId}
              </span>
            )}
          </div>

          {selectedMail ? (() => {
            const typeConfig = MAIL_TYPE_CONFIG[selectedMail.type] ?? MAIL_TYPE_CONFIG["System"];
            const TypeIcon = typeConfig.icon;
            const isActing = actionLoading === selectedMail.mailId;
            const hasReward =
              Number(selectedMail.attachedGold) > 0 ||
              Number(selectedMail.attachedGems) > 0 ||
              (selectedMail.attachedItems &&
                selectedMail.attachedItems.some((i) => i.quantity > 0));

            return (
              <div className="p-5 space-y-4">
                {/* Type + Status badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${typeConfig.bg} ${typeConfig.color} ${typeConfig.border}`}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {selectedMail.type}
                  </span>
                  {!selectedMail.isRead && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      New
                    </span>
                  )}
                  {selectedMail.isClaimed && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30">
                      Claimed
                    </span>
                  )}
                  {selectedMail.isDeleted && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30">
                      Deleted
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-tight">
                  {selectedMail.title}
                </h3>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Recipient</p>
                    <p className="text-sm text-white truncate" title={selectedMail.playerName || "All Players"}>
                      {selectedMail.playerName || "All Players"}
                    </p>
                  </div>
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Sent</p>
                    <p className="text-sm text-white leading-tight">{formatDate(selectedMail.sentAt)}</p>
                  </div>
                </div>

                {selectedMail.expiredAt && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">Expires</p>
                      <p className="text-sm text-orange-300">{formatDate(selectedMail.expiredAt)}</p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="bg-[#111] border border-gray-800 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Message
                  </p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMail.content || (
                      <span className="italic text-gray-600">No content</span>
                    )}
                  </p>
                </div>

                {/* Rewards */}
                {hasReward && (
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-4 space-y-3">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      Attached Rewards
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Number(selectedMail.attachedGold) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                          {Number(selectedMail.attachedGold).toLocaleString()} Gold
                        </span>
                      )}
                      {Number(selectedMail.attachedGems) > 0 && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          {Number(selectedMail.attachedGems).toLocaleString()} Gems
                        </span>
                      )}
                      {selectedMail.attachedItems &&
                        selectedMail.attachedItems.map((it, idx) =>
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
                    {!selectedMail.isClaimed && (
                      <button
                        onClick={handleClaim}
                        disabled={isActing}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/30 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
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
                    onClick={() => handleDelete(selectedMail)}
                    disabled={isActing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-xl text-sm font-medium transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Mail
                  </Link>
                </div>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center mb-4">
                <Eye className="w-7 h-7 text-gray-700" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">No mail selected</p>
              <p className="text-xs text-gray-600 mb-5">
                Click on a mail in the list to view its details
              </p>
              <Link
                href="/manage-mailbox/create"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#ffc032] text-[#111] rounded-xl text-sm font-bold hover:bg-[#ffd04c] transition-colors shadow-lg shadow-[#ffc032]/20"
              >
                <Plus className="w-4 h-4" />
                Send First Mail
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
