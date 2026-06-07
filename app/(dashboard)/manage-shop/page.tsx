"use client";

import { useRouter } from "next/navigation";
import { ShopItemResponse } from "@/lib/api/shop";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageShopPage() {
  const router = useRouter();

  const { data: shopItems, totalCount, loading, error, page, pageSize, setPage, setPageSize, refresh } =
    usePagedQuery<ShopItemResponse>({
      endpoint: "/api/shop-items",
      pageSize: 10,
    });

  const handleDelete = async (item: ShopItemResponse) => {
    if (!confirm(`Delete shop item "${item.itemName}"?`)) return;
    try {
      await apiClient.delete(`/api/shop-items/${item.id}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "itemName", label: "Item Name" },
    { key: "price", label: "Price" },
    { key: "currency", label: "Currency" },
    {
      key: "stock",
      label: "Stock",
      render: (val: number) => (val === -1 ? "Unlimited" : val),
    },
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
          <h1 className="text-2xl font-bold text-white mb-2">Manage Shop</h1>
          <p className="text-white/50 text-sm">Manage shop items, pricing, and availability.</p>
        </div>
        <button
          onClick={() => router.push("/manage-shop/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Shop Item
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
          title="Shop Items"
          columns={columns}
          data={shopItems}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(item) => router.push(`/manage-shop/edit?id=${item.id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
