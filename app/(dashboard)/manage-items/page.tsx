"use client";

import { useRouter } from "next/navigation";
import { ItemResponse } from "@/lib/api/item";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

export default function ManageItemsPage() {
  const router = useRouter();

  const { data: items, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<ItemResponse>({
      endpoint: "/api/items",
      pageSize: 10,
    });

  const handleDelete = async (item: ItemResponse) => {
    if (!confirm(`Delete item "${item.name}"?`)) return;
    try {
      await apiClient.delete(`/api/items/${item.id}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const rarityColors: Record<string, string> = {
    Common: "text-gray-400",
    Uncommon: "text-green-400",
    Rare: "text-blue-400",
    Epic: "text-purple-400",
    Legendary: "text-orange-400",
    Mythic: "text-red-400",
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    {
      key: "rarity",
      label: "Rarity",
      render: (val: string) => (
        <span className={`font-semibold ${rarityColors[val] || "text-white"}`}>{val}</span>
      ),
    },
    { key: "slot", label: "Slot" },
    { key: "baseValue", label: "Base Value" },
    { key: "maxStack", label: "Max Stack" },
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
          <h1 className="text-2xl font-bold text-white mb-2">Manage Items</h1>
          <p className="text-white/50 text-sm">
            Create and modify game items, weapons, and consumables.
          </p>
        </div>
        <button
          onClick={() => router.push("/manage-items/create")}
          className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filter by name..."
          onChange={(e) => setParams({ search: e.target.value || undefined })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 w-64"
        />
        <select
          onChange={(e) => setParams({ type: e.target.value || undefined })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffc032]/50"
        >
          <option value="">All Types</option>
          <option value="Weapon">Weapon</option>
          <option value="Armor">Armor</option>
          <option value="Accessory">Accessory</option>
          <option value="Consumable">Consumable</option>
          <option value="Material">Material</option>
          <option value="QuestItem">Quest Item</option>
        </select>
        <select
          onChange={(e) => setParams({ rarity: e.target.value || undefined })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ffc032]/50"
        >
          <option value="">All Rarities</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
          <option value="Epic">Epic</option>
          <option value="Legendary">Legendary</option>
          <option value="Mythic">Mythic</option>
        </select>
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
          title="Game Items"
          columns={columns}
          data={items.map((item) => ({
            ...item,
            baseValue: `💰 ${item.baseValue}`,
          }))}
          serverSide
          loading={loading}
          pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
          onEdit={(item) => router.push(`/manage-items/edit?id=${item.id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
