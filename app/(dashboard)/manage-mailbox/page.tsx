'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Mail, Eye, Trash2, Package, CreditCard, Loader2 } from 'lucide-react';
import { MailResponse, markAsRead, claimReward, remove } from '@/lib/api/mail';
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
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    case 'gift':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'event':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'compensation':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
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
        <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Mailbox</h1>
                <p className="text-gray-400">View and manage player mail inbox</p>
              </div>
            </div>
            <Link
              href="/manage-mailbox/create"
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Send Mail
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mail List */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
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
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Player</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mails.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        No mails found
                      </td>
                    </tr>
                  ) : (
                    mails.map((mail) => (
                      <tr
                        key={mail.mailId}
                        onClick={() => handleSelectMail(mail)}
                        className={`border-b border-gray-800/50 hover:bg-[#222] transition-colors cursor-pointer ${selectedMail?.mailId === mail.mailId ? 'bg-[#222]' : ''}`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-400">{mail.mailId}</td>
                        <td className="px-6 py-4 text-sm text-white">
                          <div className="truncate">{mail.playerName || 'All Players'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <div className="truncate">{mail.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getMailTypeColor(mail.type)}`}>
                            {mail.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {mail.isRead ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/30">
                              Read
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(mail.mailId); }}
                            disabled={deletingId === mail.mailId}
                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
                <div className="text-sm text-gray-400">
                  Total: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
                  </select>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1} className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">←</button>
                    <span className="px-3 py-1 text-sm text-white">{page} / {totalPages}</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">→</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mail Detail */}
          <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Mail Detail</h2>
            </div>

            {selectedMail ? (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-[#ffc032]" />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMailTypeColor(selectedMail.type)}`}>
                      {selectedMail.type}
                    </span>
                    {!selectedMail.isRead && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">New</span>
                    )}
                    {selectedMail.isClaimed && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Claimed</span>
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

                {(Number(selectedMail.attachedGold) > 0 || Number(selectedMail.attachedGems) > 0 || selectedMail.attachedItemName) && (
                  <div className="mb-6 p-4 bg-[#222] rounded-xl">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Attached Rewards
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {Number(selectedMail.attachedGold) > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-lg">
                          <span className="text-yellow-400 text-sm font-medium">💰 {Number(selectedMail.attachedGold).toLocaleString()} Gold</span>
                        </div>
                      )}
                      {Number(selectedMail.attachedGems) > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-lg">
                          <span className="text-blue-400 text-sm font-medium">💎 {Number(selectedMail.attachedGems).toLocaleString()} Gems</span>
                        </div>
                      )}
                      {selectedMail.attachedItemName && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-lg">
                          <span className="text-purple-400 text-sm font-medium">
                            {selectedMail.attachedItemName}
                            {selectedMail.attachedItemQuantity > 1 && ` x${selectedMail.attachedItemQuantity}`}
                          </span>
                        </div>
                      )}
                    </div>
                    {!selectedMail.isClaimed && (
                      <button
                        onClick={handleClaim}
                        disabled={claimingId === selectedMail.mailId}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {claimingId === selectedMail.mailId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Package className="w-4 h-4" />
                        )}
                        Claim Reward
                      </button>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Message</h4>
                  <div className="text-white whitespace-pre-wrap leading-relaxed">
                    {selectedMail.content}
                  </div>
                </div>

                {selectedMail.expiredAt && (
                  <div className="text-sm text-gray-400">
                    Expires: <span className="text-white">{formatDate(selectedMail.expiredAt)}</span>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(selectedMail.mailId)}
                    disabled={deletingId === selectedMail.mailId}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg font-medium transition-colors disabled:opacity-50"
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
