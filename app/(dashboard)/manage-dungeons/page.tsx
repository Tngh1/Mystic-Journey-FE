"use client";

import { useRouter } from "next/navigation";
import { DungeonConfigResponse } from "@/lib/api/dungeon";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageDungeonsPage() {
  const router = useRouter();

  const { data: dungeons, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<DungeonConfigResponse>({
      endpoint: "/api/dungeons",
      pageSize: 10,
    });

  const handleDelete = async (dungeon: DungeonConfigResponse) => {
    if (!confirm(`Delete dungeon "${dungeon.name}"?`)) return;
    try {
      await apiClient.delete(`/api/dungeons/${dungeon.dungeonConfigId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const columns = [
    { key: "dungeonConfigId", label: "ID" },
    { key: "name", label: "Dungeon Name" },
    { key: "levelRequirement", label: "Required Level" },
    { key: "difficulty", label: "Difficulty" },
    { key: "maxMembers", label: "Max Players" },
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
          <h1 className="text-2xl font-bold text-white mb-2">Manage Dungeons</h1>
          <p className="text-white/50 text-sm">Configure dungeon settings, requirements, and capacity.</p>
        </div>
        <button
          onClick={() => router.push("/manage-dungeons/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Dungeon
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
          title="Dungeon Configurations"
          columns={columns}
          idField="dungeonConfigId"
          data={dungeons}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(d) => router.push(`/manage-dungeons/edit?id=${d.dungeonConfigId}`)}
          onDelete={undefined}
        />
      )}
    </div>
  );
}
