"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Shield,
  Swords,
  Sparkles,
  RefreshCcw,
  Plus,
  Coins,
  Layers,
  Heart,
  Zap,
  CheckCircle2,
  XCircle,
  Edit2,
  Info,
} from "lucide-react";
import { ItemResponse } from "@/lib/api/items";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const RARITY_THEMES: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  Common: { text: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", badge: "bg-slate-500/20 text-slate-300 border-slate-500/40" },
  Uncommon: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  Rare: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", badge: "bg-sky-500/20 text-sky-300 border-sky-500/40" },
  Epic: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  Legendary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  Mythic: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", badge: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
};

function renderItemStatBadges(item: ItemResponse) {
  const badges = [];

  if (item.baseHp) badges.push({ label: `HP +${item.baseHp}`, color: "bg-red-500/15 text-red-400 border-red-500/30" });
  if (item.baseAtk) badges.push({ label: `ATK +${item.baseAtk}`, color: "bg-amber-500/15 text-amber-400 border-amber-500/30" });
  if (item.baseDef) badges.push({ label: `DEF +${item.baseDef}`, color: "bg-blue-500/15 text-blue-400 border-blue-500/30" });
  if (item.bonusHp) badges.push({ label: `HP +${item.bonusHp}%`, color: "bg-rose-500/15 text-rose-300 border-rose-500/30" });
  if (item.bonusAtk) badges.push({ label: `ATK +${item.bonusAtk}%`, color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" });
  if (item.bonusDef) badges.push({ label: `DEF +${item.bonusDef}%`, color: "bg-sky-500/15 text-sky-300 border-sky-500/30" });
  if (item.bonusCritRate) badges.push({ label: `CRIT ${item.bonusCritRate}%`, color: "bg-purple-500/15 text-purple-300 border-purple-500/30" });
  if (item.bonusCritDamage) badges.push({ label: `CDMG ${item.bonusCritDamage}%`, color: "bg-pink-500/15 text-pink-300 border-pink-500/30" });

  if (badges.length === 0) return <span className="text-xs text-white/30 italic">No combat stats</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {badges.slice(0, 3).map((b, i) => (
        <span key={i} className={`inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${b.color}`}>
          {b.label}
        </span>
      ))}
      {badges.length > 3 && (
        <span className="inline-flex rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">
          +{badges.length - 3} more
        </span>
      )}
    </div>
  );
}

export default function ManageItemsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [filterRarity, setFilterRarity] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("itemId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

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

  const pageStats = useMemo(() => {
    const weapons = items.filter((i) => i.type === "Weapon").length;
    const armor = items.filter((i) => i.type === "Armor").length;
    const highRarity = items.filter((i) => i.rarity === "Legendary" || i.rarity === "Mythic").length;
    const active = items.filter((i) => i.isActive).length;
    return { weapons, armor, highRarity, active };
  }, [items]);

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
    const nextOrder = sortBy === value && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams({
      ...(search ? { search } : {}),
      ...(filterType ? { type: filterType } : {}),
      ...(filterRarity ? { rarity: filterRarity } : {}),
      sortBy: value,
      sortOrder: nextOrder,
    });
  };

  const columns = [
    {
      key: "itemId",
      label: "Item",
      sortable: true,
      render: (_: unknown, item: ItemResponse) => {
        const theme = RARITY_THEMES[item.rarity] || RARITY_THEMES.Common;
        return (
          <div className="flex min-w-[220px] items-center gap-3">
            <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${theme.border} ${theme.bg}`}>
              {item.iconUrl ? (
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
                />
              ) : (
                <Package className={`h-5 w-5 ${theme.text}`} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-white group-hover:text-[#ffc032] transition-colors">{item.name}</p>
              <p className="mt-0.5 text-xs text-white/40">ID #{item.itemId} {item.slot !== "None" ? `• Slot: ${item.slot}` : ""}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "type",
      label: "Category",
      sortable: true,
      render: (val: string) => (
        <span className="inline-flex rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80">
          {val}
        </span>
      ),
    },
    {
      key: "rarity",
      label: "Rarity",
      sortable: true,
      render: (val: string) => {
        const theme = RARITY_THEMES[val] || RARITY_THEMES.Common;
        return (
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
            {val}
          </span>
        );
      },
    },
    {
      key: "stats",
      label: "Stats Breakdown",
      sortable: false,
      render: (_: unknown, item: ItemResponse) => renderItemStatBadges(item),
    },
    {
      key: "baseValue",
      label: "Value",
      sortable: true,
      render: (val: number) => (
        <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-300">
          <Coins className="h-3.5 w-3.5" />
          {val.toLocaleString()}
        </span>
      ),
    },
    {
      key: "maxStack",
      label: "Max Stack",
      sortable: true,
      render: (val: number) => <span className="font-mono text-xs text-white/70">x{val}</span>,
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (val: boolean) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00]">
            <Package className="h-7 w-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Items Catalog</h1>
            <p className="text-sm text-white/45">Configure equipment, weapons, consumables, combat stats & rarities.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#111] px-4 text-sm font-semibold text-white/70 transition-colors hover:border-[#ffc032]/40 hover:text-[#ffc032]"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Catalog</span>
            <Package className="h-4 w-4 text-[#ffc032]" />
          </div>
          <p className="mt-2 text-2xl font-black text-white">{totalCount.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-wider">Weapons / Armor</span>
            <Swords className="h-4 w-4 text-sky-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-sky-300">{pageStats.weapons + pageStats.armor}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-wider">Legendary / Mythic</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-300">{pageStats.highRarity}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-4">
          <div className="flex items-center justify-between text-white/40">
            <span className="text-xs font-semibold uppercase tracking-wider">Active On Page</span>
            <Shield className="h-4 w-4 text-green-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-green-400">{pageStats.active}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterSortBar
        search={{ placeholder: "Search item by name or ID...", icon: Package, value: search, onChange: handleSearch }}
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

      {/* Main Admin Table */}
      <AdminTable
        title="Game Items"
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No game items found"
        emptyHint="Try adjusting search or rarity filters."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(item) => router.push(`/manage-items/update?id=${item.itemId}`)}
        onRowClick={(item) => setSelectedItem(item)}
        selectedId={selectedItem?.itemId}
        idField="itemId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
      />

      {/* Selected Item Tooltip Card Inspector */}
      {selectedItem && (
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 animate-in fade-in-0 duration-200">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${RARITY_THEMES[selectedItem.rarity]?.border || "border-white/10"} ${RARITY_THEMES[selectedItem.rarity]?.bg || "bg-white/5"}`}>
                {selectedItem.iconUrl ? (
                  <img src={selectedItem.iconUrl} alt={selectedItem.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className={`h-8 w-8 ${RARITY_THEMES[selectedItem.rarity]?.text || "text-white"}`} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${RARITY_THEMES[selectedItem.rarity]?.text || "text-white"}`}>
                    {selectedItem.rarity} {selectedItem.type}
                  </span>
                  {selectedItem.slot !== "None" && (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                      Slot: {selectedItem.slot}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{selectedItem.name}</h3>
                <p className="text-xs text-white/50">Item ID #{selectedItem.itemId}</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/manage-items/update?id=${selectedItem.itemId}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ffc032] px-4 py-2 text-sm font-semibold text-[#111] hover:bg-[#ffd04c] transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Item
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Details
              </h4>
              <p className="text-xs leading-relaxed text-white/70 italic">
                {selectedItem.description || "No description specified for this item."}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 text-white/50">
                <span>Max Stack: x{selectedItem.maxStack}</span>
                <span>Base Value: <strong className="text-amber-300">{selectedItem.baseValue} Gold</strong></span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-400" /> Combat & Stat Modifiers
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                  <span className="text-[10px] uppercase text-white/40 block">Base HP</span>
                  <span className="text-sm font-bold text-red-400">+{selectedItem.baseHp || 0}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                  <span className="text-[10px] uppercase text-white/40 block">Base ATK</span>
                  <span className="text-sm font-bold text-amber-400">+{selectedItem.baseAtk || 0}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                  <span className="text-[10px] uppercase text-white/40 block">Base DEF</span>
                  <span className="text-sm font-bold text-blue-400">+{selectedItem.baseDef || 0}</span>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                  <span className="text-[10px] uppercase text-white/40 block">Crit Rate</span>
                  <span className="text-sm font-bold text-purple-400">+{selectedItem.bonusCritRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
