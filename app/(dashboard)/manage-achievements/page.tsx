"use client";

import { useRouter } from "next/navigation";
import { AchievementResponse } from "@/lib/api/achievement";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageAchievementsPage() {
  const router = useRouter();

  const { data: achievements, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<AchievementResponse>({
      endpoint: "/api/achievements",
      pageSize: 10,
    });

  const handleDelete = async (achievement: AchievementResponse) => {
    if (!confirm(`Delete achievement "${achievement.name}"?`)) return;
    try {
      await apiClient.delete(`/api/achievements/${achievement.achievementId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const typeColors: Record<string, string> = {
    Combat: "bg-red-400/10 text-red-400",
    Exploration: "bg-green-400/10 text-green-400",
    Social: "bg-blue-400/10 text-blue-400",
    Collection: "bg-purple-400/10 text-purple-400",
    Progression: "bg-orange-400/10 text-orange-400",
  };

  const columns = [
    { key: "achievementId", label: "ID" },
    { key: "name", label: "Name" },
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
    { key: "requiredValue", label: "Required" },
    { key: "rewardGold", label: "Gold" },
    { key: "rewardGem", label: "Gems" },
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
          <h1 className="text-2xl font-bold text-white mb-2">Manage Achievements</h1>
          <p className="text-white/50 text-sm">
            Create and modify game achievements for players.
          </p>
        </div>
        <button
          onClick={() => router.push("/manage-achievements/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Achievement
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
          title="Game Achievements"
          columns={columns}
          idField="achievementId"
          data={achievements}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(achievement) => router.push(`/manage-achievements/edit?id=${achievement.achievementId}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
