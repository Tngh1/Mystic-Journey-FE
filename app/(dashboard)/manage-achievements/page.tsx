'use client';

import { useRouter } from "next/navigation";
import { AchievementResponse } from "@/lib/api/achievements";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Trophy, Search, Plus } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";

const typeColors: Record<string, string> = {
  Combat: "text-red-400",
  Exploration: "text-green-400",
  Social: "text-blue-400",
  Collection: "text-purple-400",
  Progression: "text-orange-400",
};

const columns = [
  { key: "achievementId", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "type",
    label: "Type",
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "requiredValue", label: "Required" },
  {
    key: "isActive",
    label: "Status",
    render: (val: boolean) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function ManageAchievementsPage() {
  const router = useRouter();

  const { data: achievements, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<AchievementResponse>({
      endpoint: "/api/achievements",
      pageSize: 10,
    });

  const handleDelete = async (a: AchievementResponse) => {
    if (!confirm(`Delete achievement "${a.name}"?`)) return;
    try {
      await apiClient.delete(`/api/achievements/${a.achievementId}`);
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
            <Trophy className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Achievements</h1>
            <p className="text-sm text-gray-500">Create and modify game achievements</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <button
          onClick={() => router.push("/manage-achievements/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Achievement
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title={`Total Achievements: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={achievements}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}

        onUpdate={(a) => router.push(`/manage-achievements/update?id=${a.achievementId}`)}
        onDelete={handleDelete}
        idField="achievementId"
      />
    </div>
  );
}
