"use client";

import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quest";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageQuestsPage() {
  const router = useRouter();

  const { data: quests, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<QuestResponse>({
      endpoint: "/api/quests",
      pageSize: 10,
    });

  const typeColors: Record<string, string> = {
    Main: "bg-blue-400/10 text-blue-400",
    Side: "bg-purple-400/10 text-purple-400",
    Daily: "bg-green-400/10 text-green-400",
    Event: "bg-orange-400/10 text-orange-400",
  };

  const columns = [
    { key: "questId", label: "ID" },
    { key: "title", label: "Title" },
    { key: "mapName", label: "Map" },
    {
      key: "type",
      label: "Type",
      render: (val: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${typeColors[val] || "bg-gray-400/10 text-gray-400"
            }`}
        >
          {val}
        </span>
      ),
    },
    { key: "objectiveType", label: "Objective" },
    { key: "targetAmount", label: "Target" },
    { key: "requiredLevel", label: "Level" },
    { key: "rewardExperience", label: "EXP" },
    { key: "rewardGold", label: "Gold" },
    { key: "rewardGems", label: "Gems" },
    {
      key: "isActive",
      label: "Status",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${val ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
            }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Manage Quests</h1>
          <p className="text-white/50 text-sm">Create and modify game quests for players.</p>
        </div>
        <button
          onClick={() => router.push("/manage-quests/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Quest
        </button>
      </div>

      {error ? (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-red-400">
          {error}
          <button onClick={refresh} className="ml-4 underline cursor-pointer">
            Retry
          </button>
        </div>
      ) : (
        <AdminTable
          title="Game Quests"
          columns={columns}
          idField="questId"
          data={quests}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(quest) => router.push(`/manage-quests/edit?id=${quest.questId}`)}
        />
      )}
    </div>
  );
}
