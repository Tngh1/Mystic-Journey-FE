"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, Search, X, Check, Coins, Filter } from "lucide-react";
import { getAll as getAllItems } from "@/lib/api/items";
import type { ItemResponse } from "@/lib/types";

const RARITY_THEMES: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Common: { text: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/30", glow: "shadow-slate-500/10" },
  Uncommon: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-emerald-500/10" },
  Rare: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/30", glow: "shadow-sky-500/10" },
  Epic: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-purple-500/10" },
  Legendary: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
  Mythic: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", glow: "shadow-rose-500/20" },
};

interface ItemPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ItemResponse) => void;
  selectedItemId?: number | null;
  title?: string;
}

// Renders item picker modal modal/form component.
// Workflow: manages form field values and validation feedback state; triggers lifecycle callbacks upon dismissal or success.
// Returns the interactive form JSX element.
export default function ItemPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedItemId,
  title = "Select Game Item",
}: ItemPickerModalProps) {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(false);  // Initialize boolean flag as inactive
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");

  // Load all items when the dependencies change, update items and loading, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!isOpen) return;
    getAllItems(1, 500, { isActive: true })
      .then((res) => setItems(res.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Filter the source collection with the current search and category values, then apply the selected ordering before returning the visible results.
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        String(item.itemId).includes(search);
      const matchesType = selectedType === "All" || item.type === selectedType;
      const matchesRarity = selectedRarity === "All" || item.rarity === selectedRarity;
      return matchesSearch && matchesType && matchesRarity;
    });
  }, [items, search, selectedType, selectedRarity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/80">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffc032]/10 text-[#ffc032]">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-white/50">Browse and pick an active item from inventory catalog</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 border-b border-white/10 bg-[#161616] p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item by name or ID..."
              className="h-10 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#ffc032] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap gap-1.5">
              {["All", "Weapon", "Armor", "Consumable", "Material", "QuestItem"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                    selectedType === type
                      ? "bg-[#ffc032] text-[#111] font-semibold"
                      : "bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-white/40" />
              <select
                aria-label="Filter by rarity"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="h-8 rounded-lg border border-white/10 bg-[#0d0d0d] px-2.5 text-xs text-white focus:border-[#ffc032] focus:outline-none cursor-pointer"
              >
                <option value="All">All Rarities</option>
                <option value="Common">Common</option>
                <option value="Uncommon">Uncommon</option>
                <option value="Rare">Rare</option>
                <option value="Epic">Epic</option>
                <option value="Legendary">Legendary</option>
                <option value="Mythic">Mythic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center gap-3 text-white/40">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#ffc032] border-t-transparent" />
              <span>Loading game items catalog...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-white/40">
              <Package className="h-10 w-10 text-white/20" />
              <p className="text-sm font-semibold">No matching items found</p>
              <p className="text-xs">Try clearing filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {filteredItems.map((item) => {
                const theme = RARITY_THEMES[item.rarity] || RARITY_THEMES.Common;
                const isSelected = selectedItemId === item.itemId;

                return (
                  <div
                    key={item.itemId}
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className={`group relative flex cursor-pointer items-center gap-3.5 rounded-xl border p-3 transition-all hover:scale-[1.01] ${
                      isSelected
                        ? "border-[#ffc032] bg-[#ffc032]/10 shadow-lg shadow-[#ffc032]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${theme.border} ${theme.bg}`}>
                      {item.iconUrl ? (
                        <img
                          src={item.iconUrl}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <Package className={`h-6 w-6 ${theme.text}`} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                          {item.rarity}
                        </span>
                        <span className="text-[10px] text-white/40">• {item.type}</span>
                      </div>
                      <h4 className="truncate text-sm font-bold text-white group-hover:text-[#ffc032] transition-colors">
                        {item.name}
                      </h4>
                        <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                        <span>#{item.itemId}</span>
                        <span className="flex items-center gap-1 text-amber-300/80">
                          <Coins className="h-3 w-3" />
                          {item.baseValue}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffc032] text-[#111]">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-[#161616] px-6 py-3 text-xs text-white/40">
          <span>Showing {filteredItems.length} of {items.length} items</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
