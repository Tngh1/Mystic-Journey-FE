'use client';

import { useRouter } from "next/navigation";
import { DungeonConfigResponse } from "@/lib/api/dungeons";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Castle, Search, Plus } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-orange-400",
  Nightmare: "text-red-400",
};

const columns = [
  { key: "dungeonConfigId", label: "ID" },
  { key: "name", label: "Name" },
  { key: "levelRequirement", label: "Required Level" },
  {
    key: "difficulty",
    label: "Difficulty",
    render: (val: string) => (
      <span className={`font-semibold ${difficultyColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "maxMembers", label: "Max Players" },
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

export default function ManageDungeonsPage() {
  const router = useRouter();

  const { data: dungeons, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<DungeonConfigResponse>({
      endpoint: "/api/dungeons",
      pageSize: 10,
    });

  const handleDelete = async (d: DungeonConfigResponse) => {
    if (!confirm(`Delete dungeon "${d.name}"?`)) return;
    try {
      await apiClient.delete(`/api/dungeons/${d.dungeonConfigId}`);
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
            <Castle className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Dungeons</h1>
            <p className="text-sm text-gray-500">Configure dungeon settings and requirements</p>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => {
              setPage(1);
              setParams({ search: e.target.value || undefined });
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#111] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <button
          onClick={() => router.push("/manage-dungeons/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Dungeon
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title={`Total Dungeons: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={dungeons}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}

        onUpdate={(d) => router.push(`/manage-dungeons/update?id=${d.dungeonConfigId}`)}
        onDelete={handleDelete}
        idField="dungeonConfigId"
      />
    </div>
  );
}
