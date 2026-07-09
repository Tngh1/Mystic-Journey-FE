'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AchievementResponse } from "@/lib/api/achievements";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Trophy } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const typeColors: Record<string, string> = {
  Combat: "text-red-400",
  Exploration: "text-green-400",
  Social: "text-blue-400",
  Collection: "text-purple-400",
  Progression: "text-orange-400",
};

const columns = [
  { key: "achievementId", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "description", label: "Description", sortable: true },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "requiredValue", label: "Required", sortable: true },
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

export default function ManageAchievementsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("achievementId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = () => ({
    ...(search ? { search } : {}),
    ...(filterType ? { type: filterType } : {}),
    sortBy,
    sortOrder,
  });

  const { data: achievements, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<AchievementResponse>({
      endpoint: "/api/achievements",
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

      <FilterSortBar
        search={{ placeholder: "Search by name...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Types",
            value: filterType,
            onChange: handleFilterChange,
            options: [
              { value: "Combat", label: "Combat" },
              { value: "Exploration", label: "Exploration" },
              { value: "Social", label: "Social" },
              { value: "Collection", label: "Collection" },
              { value: "Progression", label: "Progression" },
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
        title="Achievements"
        columns={columns}
        data={achievements}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(a) => router.push(`/manage-achievements/update?id=${a.achievementId}`)}
        onDelete={handleDelete}
        idField="achievementId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
