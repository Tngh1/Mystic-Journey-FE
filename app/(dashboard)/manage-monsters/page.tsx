'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MonsterResponse } from "@/lib/api/monsters";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Skull } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const typeColors: Record<string, string> = {
  Normal: "text-gray-300",
  Elite: "text-blue-400",
  Boss: "text-red-400",
};

const columns = [
  {
    key: "imageUrl",
    label: "Image",
    sortable: false,
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
  { key: "monsterId", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "level", label: "Level", sortable: true },
  { key: "maxHp", label: "Max HP", sortable: true },
  { key: "atk", label: "ATK", sortable: true },
  { key: "def", label: "DEF", sortable: true },
  { key: "experienceReward", label: "EXP", sortable: true },
  { key: "goldReward", label: "Gold", sortable: true },
];

export default function ManageMonstersPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("monsterId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = () => ({
    ...(search ? { search } : {}),
    ...(filterType ? { type: filterType } : {}),
    sortBy,
    sortOrder,
  });

  const { data: monsters, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<MonsterResponse>({
      endpoint: "/api/monsters",
      pageSize: 10,
      params: buildParams(),
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setParams(buildParams());
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setPage(1);
    setParams(buildParams());
  };

  const handleSortChange = (value: string) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
    setPage(1);
    setParams(buildParams());
  };

  const handleOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setPage(1);
    setParams(buildParams());
  };

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

      <FilterSortBar
        search={{ placeholder: "Search by name...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Types",
            value: filterType,
            onChange: handleFilterChange,
            options: [
              { value: "Normal", label: "Normal" },
              { value: "Elite", label: "Elite" },
              { value: "Boss", label: "Boss" },
            ],
          },
        ]}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title="Monsters"
        columns={columns}
        data={monsters}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(m) => router.push(`/manage-monsters/update?id=${m.monsterId}`)}
        onDelete={handleDelete}
        idField="monsterId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
