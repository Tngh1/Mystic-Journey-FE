"use client";

import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quest";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Scroll, Loader2 } from "lucide-react";

export default function ManageQuestsPage() {
  const router = useRouter();

  const { data: quests, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<QuestResponse>({
      endpoint: "/api/quests",
      pageSize: 10,
    });

  const handleDelete = async (quest: QuestResponse) => {
    if (!confirm(`Delete quest "${quest.title}"?`)) return;
    try {
      await apiClient.delete(`/api/quests/${quest.questId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const typeColors: Record<string, string> = {
    Main: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Side: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    Daily: "bg-green-500/20 text-green-400 border border-green-500/30",
    Event: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <Scroll className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Quests</h1>
                <p className="text-gray-400">Create and modify game quests for players.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/manage-quests/create")}
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Add Quest
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">EXP Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Gold Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Gems Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && quests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : quests.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                        No quests found
                      </td>
                    </tr>
                  ) : (
                    quests.map((quest) => (
                      <tr key={quest.questId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{quest.questId}</td>
                        <td className="px-6 py-4 text-white font-medium">{quest.title}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${typeColors[quest.type] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>
                            {quest.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#ffc032] font-semibold">Lv. {quest.requiredLevel}</td>
                        <td className="px-6 py-4 text-purple-400">{quest.rewardExperience}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400">💰 {quest.rewardGold}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-blue-400">💎 {quest.rewardGems}</span>
                        </td>
                        <td className="px-6 py-4">
                          {quest.isActive ? (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/manage-quests/update?id=${quest.questId}`)}
                              className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(quest)}
                              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Quests: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
                  <option value={50}>50 / page</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-sm text-white">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
