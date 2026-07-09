'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import { ItemResponse } from "@/lib/api/items";
import { usePagedQuery } from '@/lib/hooks/usePagedQuery';
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";
import PageHeader from "@/components/ui/PageHeader";
import FilterSortBar from "@/components/ui/FilterSortBar";
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
    sortable: false,
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
  { key: "itemId", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  {
    key: "rarity",
    label: "Rarity",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${rarityColors[val] || "text-white"}`}>{val}</span>
    ),
  },
  { key: "slot", label: "Slot", sortable: true },
  {
    key: "stats",
    label: "Stats",
    sortable: false,
    render: (_: unknown, item: ItemResponse) => (
      <span className="text-xs text-gray-400">{formatItemStats(item)}</span>
    ),
  },
  { key: "baseValue", label: "Base Value", sortable: true },
  { key: "maxStack", label: "Max Stack", sortable: true },
];

export default function ManageItemsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [filterRarity, setFilterRarity] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("itemId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: items, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<ItemResponse>({
      endpoint: "/api/items",
      pageSize: 10,
      params: {
        ...(search ? { search } : {}),
        ...(filterType ? { type: filterType } : {}),
        ...(filterRarity ? { rarity: filterRarity } : {}),
        sortBy,
        sortOrder,
      },
    });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setParams({
      ...(value ? { search: value } : {}),
      ...(filterType ? { type: filterType } : {}),
      ...(filterRarity ? { rarity: filterRarity } : {}),
      sortBy,
      sortOrder,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "type") {
      setFilterType(value);
      setPage(1);
      setParams({
        ...(search ? { search } : {}),
        ...(value ? { type: value } : {}),
        ...(filterRarity ? { rarity: filterRarity } : {}),
        sortBy,
        sortOrder,
      });
    } else if (key === "rarity") {
      setFilterRarity(value);
      setPage(1);
      setParams({
        ...(search ? { search } : {}),
        ...(filterType ? { type: filterType } : {}),
        ...(value ? { rarity: value } : {}),
        sortBy,
        sortOrder,
      });
    }
  };

  const handleSortChange = (value: string) => {
    if (sortBy === value) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(value);
      setSortOrder("asc");
    }
    setPage(1);
    setParams({
      ...(search ? { search } : {}),
      ...(filterType ? { type: filterType } : {}),
      ...(filterRarity ? { rarity: filterRarity } : {}),
      sortBy: value,
      sortOrder: sortBy === value ? (sortOrder === "asc" ? "desc" : "asc") : "asc",
    });
  };

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
      />

      <FilterSortBar
        search={{ placeholder: "Search by name...", icon: Package, value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Types",
            value: filterType,
            onChange: (v) => handleFilterChange("type", v),
            options: [
              { value: "Weapon", label: "Weapon" },
              { value: "Armor", label: "Armor" },
              { value: "Consumable", label: "Consumable" },
              { value: "Material", label: "Material" },
              { value: "QuestItem", label: "Quest Item" },
            ],
          },
          {
            key: "rarity",
            label: "All Rarities",
            value: filterRarity,
            onChange: (v) => handleFilterChange("rarity", v),
            options: [
              { value: "Common", label: "Common" },
              { value: "Uncommon", label: "Uncommon" },
              { value: "Rare", label: "Rare" },
              { value: "Epic", label: "Epic" },
              { value: "Legendary", label: "Legendary" },
              { value: "Mythic", label: "Mythic" },
            ],
          },
        ]}
      />

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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />
    </div>
  );
}
