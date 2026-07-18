"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { ItemResponse } from "@/lib/api/items";
import { get, normalizeError } from "@/lib/api/client";
import type { PagedResponse } from "@/lib/types";

const rarityColors: Record<string, { badge: string; dot: string }> = {
  Common:    { badge: "bg-gray-500/15 text-gray-400 border-gray-500/30",     dot: "bg-gray-400" },
  Uncommon:  { badge: "bg-green-500/15 text-green-400 border-green-500/30",   dot: "bg-green-400" },
  Rare:      { badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",       dot: "bg-blue-400" },
  Epic:      { badge: "bg-purple-500/15 text-purple-400 border-purple-500/30", dot: "bg-purple-400" },
  Legendary: { badge: "bg-orange-500/15 text-orange-400 border-orange-500/30", dot: "bg-orange-400" },
  Mythic:    { badge: "bg-red-500/15 text-red-400 border-red-500/30",          dot: "bg-red-400" },
};

const ITEM_TYPES = ["Weapon", "Armor", "Consumable", "Material", "QuestItem"];
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"];

interface ItemPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: ItemResponse) => void;
  selectedItemId?: number | null;
}

export default function ItemPickerModal({ isOpen, onClose, onSelect, selectedItemId }: ItemPickerModalProps) {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterRarity, setFilterRarity] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (search) qs.set("search", search);
      if (filterType) qs.set("type", filterType);
      if (filterRarity) qs.set("rarity", filterRarity);
      qs.set("isActive", "true");
      const res = await get<PagedResponse<ItemResponse>>(`/api/items?${qs}`);
      setItems(res.items ?? []);
      setTotalCount(res.totalCount ?? 0);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterType, filterRarity]);

  useEffect(() => {
    if (isOpen) {
      void Promise.resolve().then(fetchItems);
    }
  }, [isOpen, fetchItems]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setFilterType("");
      setFilterRarity("");
      setPage(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ffc032]/10 border border-[#ffc032]/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-[#ffc032]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Select Item</h2>
              <p className="text-xs text-white/50">Choose an item from the system to use as reward</p>
            </div>
          </div>
          <button
            id="item-picker-close"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap gap-2 shrink-0">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              id="item-picker-search"
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
            />
          </div>
          {/* Type filter */}
          <select
            id="item-picker-type"
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors cursor-pointer"
          >
            <option value="" className="bg-[#111]">All Types</option>
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#111]">{t}</option>
            ))}
          </select>
          {/* Rarity filter */}
          <select
            id="item-picker-rarity"
            value={filterRarity}
            onChange={(e) => { setFilterRarity(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors cursor-pointer"
          >
            <option value="" className="bg-[#111]">All Rarities</option>
            {RARITIES.map((r) => (
              <option key={r} value={r} className="bg-[#111]">{r}</option>
            ))}
          </select>
        </div>

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-white/40">
              <div className="w-6 h-6 border-2 border-[#ffc032]/30 border-t-[#ffc032] rounded-full animate-spin mr-3" />
              Loading items...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-400 text-sm">{error}</div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/40 gap-2">
              <Package className="w-10 h-10 opacity-30" />
              <p className="text-sm">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => {
                const isSelected = item.itemId === selectedItemId;
                const rc = rarityColors[item.rarity] ?? rarityColors.Common;
                return (
                  <button
                    key={item.itemId}
                    id={`item-picker-item-${item.itemId}`}
                    onClick={() => { onSelect(item); onClose(); }}
                    className={[
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer group",
                      isSelected
                        ? "border-[#ffc032]/60 bg-[#ffc032]/10 shadow-[0_0_12px_rgba(255,192,50,0.15)]"
                        : "border-white/10 bg-white/3 hover:border-[#ffc032]/40 hover:bg-[#ffc032]/5",
                    ].join(" ")}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {item.iconUrl ? (
                        <img
                          src={item.iconUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
                        />
                      ) : (
                        <Package className="w-5 h-5 text-white/30" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate leading-tight">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${rc.badge}`}>
                          <span className={`w-1 h-1 rounded-full ${rc.dot}`} />
                          {item.rarity}
                        </span>
                        <span className="text-[10px] text-white/40">{item.type}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#ffc032] shrink-0 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="text-xs text-white/40">{totalCount} items total</span>
            <div className="flex items-center gap-2">
              <button
                id="item-picker-prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-white/60 px-2">
                {page} / {totalPages}
              </span>
              <button
                id="item-picker-next"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
