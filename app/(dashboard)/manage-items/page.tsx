'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Plus } from 'lucide-react';
import { ItemResponse } from "@/lib/api/items";
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";

const rarityColors: Record<string, string> = {
  Common: "text-gray-400",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-400",
};

const columns = [
  {
    key: "iconUrl",
    label: "Image",
    render: (_: unknown, item: ItemResponse) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
        {item.iconUrl ? (
          <img
            src={item.iconUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <span className="text-white/20 text-lg">📦</span>
        )}
      </div>
    ),
  },
  { key: "itemId", label: "ID" },
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
];

export default function ManageItemsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [filterRarity, setFilterRarity] = useState("");

  const { data: items, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<ItemResponse>({
      endpoint: "/api/items",
      pageSize: 10,
      params: {
        ...(filterType ? { type: filterType } : {}),
        ...(filterRarity ? { rarity: filterRarity } : {}),
      },
    });

  const handleDelete = async (item: ItemResponse) => {
    if (!confirm(`Delete item "${item.name}"?`)) return;
    try {
      await apiClient.delete(`/api/items/${item.itemId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <Package className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Items</h1>
            <p className="text-sm text-gray-500">Create and modify game items</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name..."
              onChange={(e) => setParams({
                ...(e.target.value ? { search: e.target.value } : {}),
                ...(filterType ? { type: filterType } : {}),
                ...(filterRarity ? { rarity: filterRarity } : {}),
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
            />
          </div>
          <select
            aria-label="Filter items by type"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
              setParams({
                ...(e.target.value ? { type: e.target.value } : {}),
                ...(filterRarity ? { rarity: filterRarity } : {}),
              });
            }}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
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
            aria-label="Filter items by rarity"
            value={filterRarity}
            onChange={(e) => {
              setFilterRarity(e.target.value);
              setPage(1);
              setParams({
                ...(e.target.value ? { rarity: e.target.value } : {}),
                ...(filterType ? { type: filterType } : {}),
              });
            }}
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
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
        <button
          onClick={() => router.push("/manage-items/create")}
          className="flex items-center justify-center gap-2 bg-[#ffc032] text-[#111] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Item
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">
            Retry
          </button>
        </div>
      )}

      <AdminTable
        title={`Total Items: ${totalCount.toLocaleString()}`}
        columns={columns}
        data={items}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}

        onUpdate={(item) => router.push(`/manage-items/update?id=${item.itemId}`)}
        onDelete={handleDelete}
        idField="itemId"
      />
    </div>
  );
}
