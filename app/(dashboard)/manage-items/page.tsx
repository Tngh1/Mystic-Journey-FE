'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus } from 'lucide-react';
import { ItemResponse } from "@/lib/api/items";
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";
import PageHeader from "@/components/ui/PageHeader";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/lib/utils/swal";

const rarityColors: Record<string, string> = {
  Common: "text-gray-400",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-400",
};

const formatItemStats = (item: ItemResponse) => {
  const stats = [
    item.baseHp ? `HP ${item.baseHp}` : null,
    item.baseAtk ? `ATK ${item.baseAtk}` : null,
    item.baseDef ? `DEF ${item.baseDef}` : null,
    item.bonusHp ? `HP+ ${item.bonusHp}%` : null,
    item.bonusAtk ? `ATK+ ${item.bonusAtk}%` : null,
    item.bonusDef ? `DEF+ ${item.bonusDef}%` : null,
    item.bonusCritRate ? `CRIT ${item.bonusCritRate}%` : null,
    item.bonusCritDamage ? `CDMG ${item.bonusCritDamage}%` : null,
  ].filter(Boolean);

  return stats.length > 0 ? stats.join(" / ") : "None";
};

const columns = [
  {
    key: "iconUrl",
    label: "Image",
    render: (_: unknown, item: ItemResponse) => (
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
        <img
          src={item.iconUrl || "/images/demo.jpg"}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
        />
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
  {
    key: "stats",
    label: "Stats",
    render: (_: unknown, item: ItemResponse) => (
      <span className="text-xs text-gray-400">{formatItemStats(item)}</span>
    ),
  },
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
    const result = await showConfirmAlert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      "Delete",
      "Cancel",
    );
    if (!result.isConfirmed) return;
    try {
      await apiClient.delete(`/api/items/${item.itemId}`);
      await showSuccessAlert("Deleted", `"${item.name}" has been deleted successfully.`);
      refresh();
    } catch (err: unknown) {
      await showErrorAlert("Delete Failed", err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Items"
        subtitle="Create and modify game items"
        icon={Package}
        stats={[
          { label: "Total Items", value: totalCount.toLocaleString(), icon: Package, tone: "primary" },
        ]}
        actions={[
          {
            label: "Create Item",
            icon: Plus,
            onClick: () => router.push("/manage-items/create"),
          },
        ]}
      />

      {/* Filters */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 relative max-w-md">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Weapon">Weapon</option>
            <option value="Armor">Armor</option>
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
            className="px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#ffc032] transition-colors shrink-0 cursor-pointer"
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
      </div>

      <AdminTable
        title="Items List"
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No items found"
        emptyHint="Try adjusting your filters or create a new item."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(item) => router.push(`/manage-items/update?id=${item.itemId}`)}
        onDelete={handleDelete}
        idField="itemId"
      />
    </div>
  );
}
