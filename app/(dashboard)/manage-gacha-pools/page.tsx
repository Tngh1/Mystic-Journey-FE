'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GachaBannerResponse } from "@/lib/api/gacha-banners";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import { Gem } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const columns = [
  { key: "gachaBannerId", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "pullCost", label: "Pull Cost", sortable: true },
  { key: "pityLimit", label: "Pity Limit", sortable: true },
  { key: "startAt", label: "Start Date", sortable: true },
  { key: "endAt", label: "End Date", sortable: true },
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString();
}

export default function ManageGachaPoolsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("gachaBannerId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const buildParams = () => ({
    ...(search ? { search } : {}),
    ...(filterType ? { type: filterType } : {}),
    sortBy,
    sortOrder,
  });

  const { data: banners, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<GachaBannerResponse>({
      endpoint: '/api/gachabanners',
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

  const handleDelete = async (b: GachaBannerResponse) => {
    if (!confirm(`Delete gacha banner "${b.name}"?`)) return;
    try {
      await apiClient.delete(`/api/gachabanners/${b.gachaBannerId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const columnsWithDate = columns.map(col =>
    col.key === "startAt" || col.key === "endAt"
      ? { ...col, render: (val: string) => formatDate(val) }
      : col
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Gem className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Gacha</h1>
            <p className="text-sm text-gray-500">Configure banners and drop rates</p>
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
              { value: "Standard", label: "Standard" },
              { value: "Limited", label: "Limited" },
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
        title="Gacha Banners"
        columns={columnsWithDate}
        data={banners}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(b) => router.push(`/manage-gacha-pools/update?id=${b.gachaBannerId}`)}
        onDelete={handleDelete}
        idField="gachaBannerId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
