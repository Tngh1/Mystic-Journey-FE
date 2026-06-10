'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Mail, Eye, ChevronLeft, ChevronRight, Trash2, Package } from 'lucide-react';
import { MailResponse, getAll, markAsRead, claimReward, remove } from '@/lib/api/mail';
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMailTypeColor(type: string): string {
  const typeLower = type?.toLowerCase() || '';
  switch (typeLower) {
    case 'system':
      return 'bg-gray-700 text-gray-300';
    case 'gift':
      return 'bg-green-900/50 text-green-400';
    case 'event':
      return 'bg-blue-900/50 text-blue-400';
    case 'compensation':
      return 'bg-orange-900/50 text-orange-400';
    default:
      return 'bg-gray-700 text-gray-300';
  }
}

export default function ManageMailboxPage() {
  const {
    data: mails,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refresh,
  } = usePagedQuery<MailResponse>({
    endpoint: '/api/mails',
    pageSize: 10,
  });

  const [selectedMail, setSelectedMail] = useState<MailResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [claimingId, setClaimingId] = useState<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSelectMail = async (mail: MailResponse) => {
    setSelectedMail(mail);
    if (!mail.isRead) {
      try {
        const updated = await markAsRead(mail.mailId);
        setSelectedMail(updated);
        refresh();
      } catch {
        // non-critical
      }
    }
  };

  const handleClaim = async () => {
    if (!selectedMail) return;
    if (selectedMail.isClaimed) return;
    try {
      setClaimingId(selectedMail.mailId);
      const updated = await claimReward(selectedMail.mailId);
      setSelectedMail(updated);
      refresh();
    } catch {
      // error handled by API
    } finally {
      setClaimingId(null);
    }
  };

  const handleDelete = async (mailId: number) => {
    if (!confirm('Are you sure you want to delete this mail?')) return;
    try {
      setDeletingId(mailId);
      await remove(mailId);
      if (selectedMail?.mailId === mailId) {
        setSelectedMail(null);
      }
      refresh();
    } catch {
      // error handled by API
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && mails.length === 0) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc032]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mailbox</h1>
            <p className="text-gray-400">View and manage player mail inbox</p>
          </div>
          <Link
            href="/manage-mailbox/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6ae2c] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Send Mail
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mail List */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#333]">
              <h2 className="text-lg font-semibold text-white">
                Inbox
                {loading && (
                  <span className="ml-2 inline-block w-4 h-4 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
                )}
              </h2>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#1a1a1a]">
                  <tr className="border-b border-[#333]">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Player</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Sent</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mails.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No mails found
                      </td>
                    </tr>
                  ) : (
                    mails.map((mail) => (
                      <tr
                        key={mail.mailId}
                        onClick={() => handleSelectMail(mail)}
                        className={`border-b border-[#222] hover:bg-[#252525] transition-colors cursor-pointer ${selectedMail?.mailId === mail.mailId ? 'bg-[#252525]' : ''
                          }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-400">{mail.mailId}</td>
                        <td className="px-4 py-3 text-sm text-white max-w-[120px]">
                          <div className="truncate">{mail.playerName || 'All Players'}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white max-w-[150px]">
                          <div className="truncate">{mail.title}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${getMailTypeColor(mail.type)}`}>
                            {mail.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {formatDate(mail.sentAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {mail.isRead ? (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                              Read
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(mail.mailId); }}
                            disabled={deletingId === mail.mailId}
                            className="p-1.5 rounded hover:bg-[#333] transition-colors disabled:opacity-50"
                            title="Delete mail"
                          >
                            <Trash2 className={`w-4 h-4 ${deletingId === mail.mailId ? 'text-gray-600' : 'text-red-400'}`} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#333]">
                <div className="text-sm text-gray-400">
                  {totalCount.toLocaleString()} total
                </div>
                <div className="flex items-center gap-2">
                  <select
                    title="Items per page"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-[#0d0d0d] border border-[#333] rounded px-2 py-1 text-sm text-white focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="p-2 hover:bg-[#333] rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-2 text-white">
                    {page}/{totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    className="p-2 hover:bg-[#333] rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mail Detail */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-[#333]">
              <h2 className="text-lg font-semibold text-white">Mail Detail</h2>
            </div>

            {selectedMail ? (
              <div className="p-6">
                {/* Mail Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-[#ffc032]" />
                    <span className={`px-2 py-1 rounded text-xs ${getMailTypeColor(selectedMail.type)}`}>
                      {selectedMail.type}
                    </span>
                    {!selectedMail.isRead && (
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-400 rounded text-xs">
                        New
                      </span>
                    )}
                    {selectedMail.isClaimed && (
                      <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                        Claimed
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedMail.title}</h3>
                  <div className="text-sm text-gray-400">
                    To: <span className="text-white">{selectedMail.playerName || 'All Players'}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Sent: <span className="text-white">{formatDate(selectedMail.sentAt)}</span>
                  </div>
                </div>

                {/* Rewards */}
                {(Number(selectedMail.attachedGold) > 0 || Number(selectedMail.attachedGems) > 0 || selectedMail.attachedItemName) && (
                  <div className="mb-6 p-4 bg-[#222] rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Attached Rewards
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {Number(selectedMail.attachedGold) > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 rounded">
                          <span className="text-yellow-400 text-sm font-medium">
                            {Number(selectedMail.attachedGold).toLocaleString()} Gold
                          </span>
                        </div>
                      )}
                      {Number(selectedMail.attachedGems) > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 rounded">
                          <span className="text-blue-400 text-sm font-medium">
                            {Number(selectedMail.attachedGems).toLocaleString()} Gems
                          </span>
                        </div>
                      )}
                      {selectedMail.attachedItemName && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/30 rounded">
                          <span className="text-purple-400 text-sm font-medium">
                            {selectedMail.attachedItemName}
                            {selectedMail.attachedItemQuantity > 1 && ` x${selectedMail.attachedItemQuantity}`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Claim Button */}
                    {!selectedMail.isClaimed && (
                      <button
                        onClick={handleClaim}
                        disabled={claimingId === selectedMail.mailId}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {claimingId === selectedMail.mailId ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4" />
                            Claim Reward
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Message</h4>
                  <div className="text-white whitespace-pre-wrap leading-relaxed">
                    {selectedMail.content}
                  </div>
                </div>

                {/* Expiry */}
                {selectedMail.expiredAt && (
                  <div className="text-sm text-gray-400">
                    Expires: <span className="text-white">{formatDate(selectedMail.expiredAt)}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-[#333] flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(selectedMail.mailId)}
                    disabled={deletingId === selectedMail.mailId}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Mail
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Eye className="w-12 h-12 mb-4" />
                <p>Select a mail to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
