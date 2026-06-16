"use client";

import { useRouter } from "next/navigation";
import { MonsterResponse } from "@/lib/api/monster";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Skull } from "lucide-react";

export default function ManageMonstersPage() {
  const router = useRouter();

  const { data: monsters, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<MonsterResponse>({
      endpoint: "/api/monsters",
      pageSize: 10,
    });

  const handleDelete = async (monster: MonsterResponse) => {
    if (!confirm(`Delete monster "${monster.name}"?`)) return;
    try {
      await apiClient.delete(`/api/monsters/${monster.monsterId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const typeColors: Record<string, string> = {
    Normal: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
    Elite: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Boss: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <Skull className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Monsters</h1>
                <p className="text-gray-400">Configure monster stats, types, and rewards.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/manage-monsters/create")}
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Add Monster
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Max HP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ATK</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">DEF</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">EXP Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Gold Reward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && monsters.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : monsters.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-12 text-center text-gray-400">
                        No monsters found
                      </td>
                    </tr>
                  ) : (
                    monsters.map((m) => (
                      <tr key={m.monsterId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                            {m.imageUrl ? (
                              <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span className="text-white/20 text-lg">👹</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{m.monsterId}</td>
                        <td className="px-6 py-4 text-white font-medium">{m.name}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${typeColors[m.type] || typeColors.Normal}`}>
                            {m.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#ffc032] font-semibold">{m.level}</td>
                        <td className="px-6 py-4 text-red-400">{m.maxHp.toLocaleString()}</td>
                        <td className="px-6 py-4 text-orange-400">{m.atk}</td>
                        <td className="px-6 py-4 text-blue-400">{m.def}</td>
                        <td className="px-6 py-4 text-purple-400">{m.experienceReward}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400">💰 {m.goldReward.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/manage-monsters/update?id=${m.monsterId}`)}
                              className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(m)}
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
                Total Monsters: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
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
                    Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(totalCount / pageSize)}
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
