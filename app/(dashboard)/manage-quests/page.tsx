'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quests";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { Scroll } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const typeColors: Record<string, string> = {
  Main: "text-blue-400",
  Side: "text-purple-400",
  Daily: "text-green-400",
  Event: "text-orange-400",
};

const statusColors: Record<string, string> = {
  NotStarted: "text-gray-400",
  InProgress: "text-yellow-400",
  Completed: "text-green-400",
  Claimed: "text-blue-400",
  Failed: "text-red-400",
};

const objectiveColors: Record<string, string> = {
  Explore: "text-cyan-400",
  Defeat: "text-red-400",
  Collect: "text-amber-400",
  Talk: "text-purple-400",
  OpenChest: "text-yellow-400",
  Interact: "text-teal-400",
};

const columns = [
  { key: "questId", label: "ID", sortable: true },
  { key: "title", label: "Title", sortable: true },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  {
    key: "defaultStatus",
    label: "Default Status",
    sortable: true,
    render: (val: string) => (
      <span className={`text-xs font-medium ${statusColors[val] || "text-gray-400"}`}>{val}</span>
    ),
  },
  { key: "mapName", label: "Map", sortable: true },
  {
    key: "objectiveType",
    label: "Objective",
    sortable: true,
    render: (val: string) => (
      <span className={`text-xs font-semibold ${objectiveColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  { key: "requiredLevel", label: "Lv.Req", sortable: true },
  { key: "targetAmount", label: "Target", sortable: true },
  { key: "rewardExperience", label: "EXP", sortable: true },
  { key: "rewardGold", label: "Gold", sortable: true },
  { key: "rewardGems", label: "Gems", sortable: true },
  {
    key: "rewardItemName",
    label: "Reward Item",
    sortable: true,
    render: (val: string | null) => (
      <span className="text-xs text-gray-400">{val ?? "—"}</span>
    ),
  },
  {
    key: "rewardSkillName",
    label: "Reward Skill",
    sortable: true,
    render: (_val: string | null, row: QuestResponse) => (
      <span className="text-xs text-gray-400">
        {row.rewardSkillName ?? (row.rewardSkillId ? `#${row.rewardSkillId}` : "-")}
      </span>
    ),
  },
  {
    key: "isActive",
    label: "Active",
    render: (val: boolean) => (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function ManageQuestsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("questId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = () => ({
    ...(search ? { search } : {}),
    ...(filterType ? { type: filterType } : {}),
    sortBy,
    sortOrder,
  });

  const { data: quests, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<QuestResponse>({
      endpoint: "/api/quests",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Scroll className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Quests</h1>
            <p className="text-sm text-gray-500">Create and modify game quests</p>
          </div>
        </div>
      </div>

      <FilterSortBar
        search={{ placeholder: "Search by title...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Types",
            value: filterType,
            onChange: handleFilterChange,
            options: [
              { value: "Main", label: "Main" },
              { value: "Side", label: "Side" },
              { value: "Daily", label: "Daily" },
              { value: "Event", label: "Event" },
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
        title="Quests"
        columns={columns}
        data={quests}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(q) => router.push(`/manage-quests/update?id=${q.questId}`)}
        idField="questId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
