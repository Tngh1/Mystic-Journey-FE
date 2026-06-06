"use client";

import { useRouter } from "next/navigation";
import { GachaBannerResponse } from "@/lib/api/gacha";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageGachaPoolsPage() {
  const router = useRouter();

  const { data: banners, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<GachaBannerResponse>({
      endpoint: "/api/gacha-banners",
      pageSize: 10,
    });

  const handleDelete = async (item: GachaBannerResponse) => {
    if (!confirm(`Delete gacha banner "${item.name}"?`)) return;
    try {
      await apiClient.delete(`/api/gacha-banners/${item.id}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete banner");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Banner Name" },
    { key: "type", label: "Type" },
    { key: "pullCost", label: "Pull Cost (Gems)" },
    { key: "pityLimit", label: "Pity Limit" },
    {
      key: "isActive",
      label: "Status",
      render: (val: boolean) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${val ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
          }`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "startAt",
      label: "Start Date",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: "endAt",
      label: "End Date",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Manage Gacha Pools</h1>
          <p className="text-white/50 text-sm">Configure banners, drop rates, and costs for the gacha system.</p>
        </div>
        <button
          onClick={() => router.push("/manage-gacha-pools/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Gacha Banner
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
          title="Gacha Banners"
          columns={columns}
          data={banners}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(item) => router.push(`/manage-gacha-pools/edit?id=${item.id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
