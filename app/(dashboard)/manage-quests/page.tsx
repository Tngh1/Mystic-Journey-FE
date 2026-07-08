'use client';

import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quests";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Scroll, Search, Plus } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";

const typeColors: Record<string, string> = {
  Main: "text-blue-400",
  Side: "text-purple-400",
  Daily: "text-green-400",
  Event: "text-orange-400",
};

const statusColors: Record<string, string> = {
  NotStarted: "text-gray-400",
  InProgress: "text-yellow-400",
  Completed: "text-green-400",
  Claimed: "text-blue-400",
  Failed: "text-red-400",
};

const objectiveColors: Record<string, string> = {
  Explore: "text-cyan-400",
  Defeat: "text-red-400",
  Collect: "text-amber-400",
  Talk: "text-purple-400",
  OpenChest: "text-yellow-400",
  Interact: "text-teal-400",
};

const columns = [
  { key: "questId", label: "ID" },
  { key: "title", label: "Title" },
  {
    key: "type",
    label: "Type",
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  {
    key: "defaultStatus",
    label: "Default Status",
    render: (val: string) => (
      <span className={`text-xs font-medium ${statusColors[val] || "text-gray-400"}`}>{val}</span>
    ),
  },
  { key: "mapName", label: "Map" },
  {
    key: "objectiveType",
    label: "Objective",
    render: (val: string) => (
      <span className={`text-xs font-semibold ${objectiveColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "requiredLevel", label: "Lv.Req" },
  { key: "targetAmount", label: "Target" },
  { key: "rewardExperience", label: "EXP" },
  { key: "rewardGold", label: "Gold" },
  { key: "rewardGems", label: "Gems" },
  {
    key: "rewardItemName",
    label: "Reward Item",
    render: (val: string | null) => (
      <span className="text-xs text-gray-400">{val ?? "—"}</span>
    ),
  },
  {
    key: "rewardSkillName",
    label: "Reward Skill",
    render: (_val: string | null, row: QuestResponse) => (
      <span className="text-xs text-gray-400">
        {row.rewardSkillName ?? (row.rewardSkillId ? `#${row.rewardSkillId}` : "-")}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Active",
    render: (val: boolean) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function ManageQuestsPage() {
  const router = useRouter();

  const { data: quests, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<QuestResponse>({
      endpoint: "/api/quests",
      pageSize: 10,
    });

  const handleDelete = async (q: QuestResponse) => {
    if (!confirm(`Delete quest "${q.title}"?`)) return;
    try {
      await apiClient.delete(`/api/quests/${q.questId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Scroll className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Quests</h1>
            <p className="text-sm text-gray-500">Create and modify game quests</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <button
          onClick={() => router.push("/manage-quests/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Quest
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title={`Total Quests: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={quests}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}

        onUpdate={(q) => router.push(`/manage-quests/update?id=${q.questId}`)}
        onDelete={handleDelete}
        idField="questId"
      />
    </div>
  );
}
