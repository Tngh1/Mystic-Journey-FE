"use client";

import { useRouter } from "next/navigation";
import { MonsterResponse } from "@/lib/api/monster";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

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
    Normal: "text-gray-300 bg-gray-500/10",
    Elite: "text-blue-400 bg-blue-400/10",
    Boss: "text-red-400 bg-red-400/10",
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      render: (_: any, m: MonsterResponse) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
          {m.imageUrl ? (
            <img
              src={m.imageUrl}
              alt={m.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-white/20 text-lg">👹</span>
          )}
        </div>
      ),
    },
    { key: "monsterId", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "type",
      label: "Type",
      render: (val: string) => (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeColors[val] || ""}`}>
          {val}
        </span>
      ),
    },
    { key: "level", label: "Level" },
    { key: "maxHp", label: "Max HP" },
    { key: "atk", label: "ATK" },
    { key: "def", label: "DEF" },
    { key: "experienceReward", label: "EXP Reward" },
    { key: "goldReward", label: "Gold Reward" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Manage Monsters</h1>
          <p className="text-white/50 text-sm">Configure monster stats, types, and rewards.</p>
        </div>
        <button
          onClick={() => router.push("/manage-monsters/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Monster
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
          title="Monsters List"
          columns={columns}
          idField="monsterId"
          data={monsters.map((m) => ({
            ...m,
            goldReward: `💰 ${m.goldReward}`,
          }))}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(m) => router.push(`/manage-monsters/edit?id=${m.monsterId}`)}
          onDelete={undefined}
        />
      )}
    </div>
  );
}
