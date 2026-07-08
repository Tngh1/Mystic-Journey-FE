'use client';

import { useRouter } from "next/navigation";
import { MonsterResponse } from "@/lib/api/monsters";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Skull, Search, Plus } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";

const typeColors: Record<string, string> = {
  Normal: "text-gray-300",
  Elite: "text-blue-400",
  Boss: "text-red-400",
};

const columns = [
  {
    key: "imageUrl",
    label: "Image",
    render: (_: unknown, m: MonsterResponse) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
        <img
          src={m.imageUrl || "/images/demo.jpg"}
          alt={m.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
        />
      </div>
    ),
  },
  { key: "monsterId", label: "ID" },
  { key: "name", label: "Name" },
  {
    key: "type",
    label: "Type",
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "level", label: "Level" },
  { key: "maxHp", label: "Max HP" },
  { key: "atk", label: "ATK" },
  { key: "def", label: "DEF" },
  { key: "experienceReward", label: "EXP" },
  { key: "goldReward", label: "Gold" },
];

export default function ManageMonstersPage() {
  const router = useRouter();

  const { data: monsters, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<MonsterResponse>({
      endpoint: "/api/monsters",
      pageSize: 10,
    });

  const handleDelete = async (m: MonsterResponse) => {
    if (!confirm(`Delete monster "${m.name}"?`)) return;
    try {
      await apiClient.delete(`/api/monsters/${m.monsterId}`);
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
            <Skull className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Monsters</h1>
            <p className="text-sm text-gray-500">Configure monster stats and rewards</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name..."
            onChange={(e) => setParams({ search: e.target.value || undefined })}
            className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
          />
        </div>
        <button
          onClick={() => router.push("/manage-monsters/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Monster
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title={`Total Monsters: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={monsters}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}

        onUpdate={(m) => router.push(`/manage-monsters/update?id=${m.monsterId}`)}
        onDelete={handleDelete}
        idField="monsterId"
      />
    </div>
  );
}
