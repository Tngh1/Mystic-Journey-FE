'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DungeonConfigResponse } from "@/lib/api/dungeons";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Castle } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const difficultyColors: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-orange-400",
  Nightmare: "text-red-400",
};

const columns = [
  { key: "dungeonConfigId", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "levelRequirement", label: "Required Level", sortable: true },
  {
    key: "difficulty",
    label: "Difficulty",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${difficultyColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "maxMembers", label: "Max Players", sortable: true },
  {
    key: "isActive",
    label: "Status",
    sortable: true,
    render: (val: boolean) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function ManageDungeonsPage() {
  const router = useRouter();

  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("dungeonConfigId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = () => ({
    ...(search ? { search } : {}),
    ...(filterDifficulty ? { type: filterDifficulty } : {}),
    sortBy,
    sortOrder,
  });

  const { data: dungeons, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<DungeonConfigResponse>({
      endpoint: "/api/dungeons",
      pageSize: 10,
      params: buildParams(),
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setParams(buildParams());
  };

  const handleFilterChange = (value: string) => {
    setFilterDifficulty(value);
    setPage(1);
    setParams(buildParams());
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
    setParams(buildParams());
  };

  const handleOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setPage(1);
    setParams(buildParams());
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

      <FilterSortBar
        search={{ placeholder: "Search by name...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "difficulty",
            label: "All Difficulties",
            value: filterDifficulty,
            onChange: handleFilterChange,
            options: [
              { value: "Easy", label: "Easy" },
              { value: "Medium", label: "Medium" },
              { value: "Hard", label: "Hard" },
              { value: "Nightmare", label: "Nightmare" },
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
        title="Dungeons"
        columns={columns}
        data={dungeons}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(d) => router.push(`/manage-dungeons/update?id=${d.dungeonConfigId}`)}
        idField="dungeonConfigId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
