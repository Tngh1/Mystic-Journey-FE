"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Package, Star, Shield, Sword, Sparkles, Heart,
  X, Coins, Box,
} from "lucide-react";
import { getAll, type ItemResponse } from "@/lib/api/items";
import PageLoader from "@/components/ui/PageLoader";
import { RarityCard } from "@/components/wiki/WikiCard";

type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

const RARITY_KEYS: ItemRarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

const rarityMeta: Record<ItemRarity, {
  bg: string; border: string; text: string;
  badgeBg: string; badgeText: string;
  barColor: string; hex: string; sort: number;
}> = {
  common:    { bg: "bg-gray-500/12",  border: "border-gray-500/25",  text: "text-gray-300",  badgeBg: "bg-gray-500/20",  badgeText: "text-gray-400",  barColor: "#9ca3af",  hex: "#9ca3af",  sort: 0 },
  uncommon:  { bg: "bg-green-500/12", border: "border-green-500/25", text: "text-green-300",  badgeBg: "bg-green-500/20", badgeText: "text-green-400",  barColor: "#4ade80", hex: "#4ade80", sort: 1 },
  rare:      { bg: "bg-blue-500/12",  border: "border-blue-500/25",  text: "text-blue-300",   badgeBg: "bg-blue-500/20",  badgeText: "text-blue-400",   barColor: "#60a5fa", hex: "#60a5fa", sort: 2 },
  epic:      { bg: "bg-purple-500/12", border: "border-purple-500/25", text: "text-purple-300", badgeBg: "bg-purple-500/20", badgeText: "text-purple-400", barColor: "#c084fc", hex: "#c084fc", sort: 3 },
  legendary: { bg: "bg-amber-500/12", border: "border-amber-500/25", text: "text-amber-300",  badgeBg: "bg-amber-500/20", badgeText: "text-amber-400",  barColor: "#fbbf24", hex: "#fbbf24", sort: 4 },
  mythic:    { bg: "bg-red-500/12",   border: "border-red-500/25",   text: "text-red-300",    badgeBg: "bg-red-500/20",   badgeText: "text-red-400",    barColor: "#f87171", hex: "#f87171", sort: 5 },
};

const rarityLabels: Record<ItemRarity, string> = {
  common: "Common", uncommon: "Uncommon", rare: "Rare",
  epic: "Epic", legendary: "Legendary", mythic: "Mythic",
};

const TYPE_OPTIONS = ["All", "Weapon", "Armor", "Consumable", "Material", "QuestItem"];
const SLOT_OPTIONS = ["All", "None", "Weapon", "Armor", "Helmet", "Gloves", "Boots", "Ring", "Necklace"];

function normalizeRarity(r?: string | null): ItemRarity {
  const n = r?.trim().toLowerCase();
  return RARITY_KEYS.includes(n as ItemRarity) ? (n as ItemRarity) : "common";
}

function sumStat(...vals: Array<number | null | undefined>): number | undefined {
  const t = vals.reduce<number>((s, v) => s + (typeof v === "number" ? v : 0), 0);
  return t === 0 ? undefined : t;
}

function ItemIcon({ item, size = 40 }: { item: ItemResponse; size?: number }) {
  return (
    <img
      src={item.iconUrl || "/images/demo.jpg"}
      alt={item.name}
      className="rounded-lg object-cover"
      style={{ width: size, height: size }}
      onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
    />
  );
}

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t.includes("weapon")) return <Sword style={{ width: size, height: size }} />;
  if (t.includes("armor")) return <Shield style={{ width: size, height: size }} />;
  if (t.includes("consumable")) return <Heart style={{ width: size, height: size }} />;
  if (t.includes("quest")) return <Sparkles style={{ width: size, height: size }} />;
  if (t.includes("material")) return <Box style={{ width: size, height: size }} />;
  return <Package style={{ width: size, height: size }} />;
}

export default function WikiItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [rarity, setRarity] = useState<ItemRarity | "all">("all");
  const [slot, setSlot] = useState("All");
  const [sort, setSort] = useState<"rarity" | "name" | "value">("rarity");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getAll(1, 1000);
        if (!mounted) return;
        setItems(res.items.filter((i) => i.isActive));
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load items.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = items.filter((i) => {
      if (search && !i.name.toLowerCase().includes(search.toLowerCase()) &&
          !(i.description?.toLowerCase().includes(search.toLowerCase()) ?? false)) return false;
      if (type !== "All" && i.type !== type) return false;
      if (rarity !== "all" && normalizeRarity(i.rarity) !== rarity) return false;
      if (slot !== "All" && i.slot === slot) return true;
      if (slot !== "All" && i.slot !== slot) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "rarity") {
        return rarityMeta[normalizeRarity(b.rarity)].sort - rarityMeta[normalizeRarity(a.rarity)].sort
          || a.name.localeCompare(b.name);
      }
      if (sort === "value") return (b.baseValue ?? 0) - (a.baseValue ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [items, search, type, rarity, slot, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    RARITY_KEYS.forEach((r) => { c[r] = 0; });
    items.forEach((i) => { c[normalizeRarity(i.rarity)] = (c[normalizeRarity(i.rarity)] ?? 0) + 1; });
    return c;
  }, [items]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-[88px] md:pt-[112px] px-4">
        <Package className="w-16 h-16 text-white/20" />
        <h2 className="text-xl font-bold text-white">Unable to load items</h2>
        <p className="text-white/50 text-sm max-w-md text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#ffc032] text-black font-semibold rounded-xl cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[88px] md:pt-[112px]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto flex">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`fixed lg:sticky lg:top-[88px] md:lg:top-[112px] top-[88px] md:top-[112px] z-40 w-60 h-[calc(100vh-88px)] md:shrink-0 self-start bg-[#0F0F0F] overflow-y-auto nice-scrollbar transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="px-2 py-4 space-y-4">
            {/* Rarity */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Rarity</h3>
              <div className="space-y-0.5">
                <button
                  onClick={() => setRarity("all")}
                  className={[
                    "w-full h-10 px-3 rounded-[10px] flex items-center justify-between transition-colors duration-200 cursor-pointer",
                    rarity === "all"
                      ? "bg-[#3A3A3A] text-white"
                      : "bg-transparent text-white hover:bg-[#272727]",
                  ].join(" ")}
                >
                  <span className={["text-sm", rarity === "all" ? "font-semibold" : "font-normal"].join(" ")}>All</span>
                  <span className="text-xs text-[#AAAAAA]">{counts.All}</span>
                </button>
                {RARITY_KEYS.map((r) => {
                  const m = rarityMeta[r];
                  const isActive = rarity === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setRarity(r)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center justify-between transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.hex }} />
                        <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                          {rarityLabels[r]}
                        </span>
                      </span>
                      <span className="text-xs text-[#AAAAAA]">{counts[r]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot */}
            {type !== "All" && type !== "Material" && type !== "Consumable" && (
              <div>
                <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Slot</h3>
                <div className="flex flex-wrap gap-1.5 px-3">
                  {SLOT_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={[
                        "px-2.5 py-1 rounded-md text-xs transition-colors duration-200 cursor-pointer",
                        slot === s
                          ? "bg-[#3A3A3A] text-white font-semibold"
                          : "bg-transparent text-[#AAAAAA] hover:bg-[#272727] hover:text-white",
                      ].join(" ")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Sort By</h3>
              <div className="space-y-0.5">
                {([
                  { key: "rarity", label: "Rarity" },
                  { key: "name", label: "Name (A-Z)" },
                  { key: "value", label: "Base Value" },
                ] as const).map((s) => {
                  const isActive = sort === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center text-left transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear filters */}
            {(search || type !== "All" || rarity !== "all" || slot !== "All") && (
              <button
                onClick={() => { setSearch(""); setType("All"); setRarity("all"); setSlot("All"); }}
                className="w-full h-10 px-3 rounded-[10px] flex items-center justify-center gap-2 bg-transparent hover:bg-[#272727] text-[#AAAAAA] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Clear Filters</span>
              </button>
            )}
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Type Filter Bar - Top Right */}
          <div className="px-4 md:px-6 pt-6 pb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {TYPE_OPTIONS.map((t) => {
                  const isActive = type === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        "h-9 px-4 rounded-xl flex items-center gap-2 transition-colors duration-200 cursor-pointer text-sm font-medium",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-[#1a1a1a] text-white/60 hover:bg-[#252525] hover:text-white border border-white/10",
                      ].join(" ")}
                    >
                      {t !== "All" && <TypeIcon type={t} size={14} />}
                      <span>{t === "QuestItem" ? "Quest Item" : t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

         {/* Item Grid */}
          <div className="px-4 md:px-6 py-6">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Package className="w-16 h-16 text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-3">No items found</p>
                <p className="text-white/25 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                {/* Active filters */}
                {(type !== "All" || rarity !== "all" || slot !== "All" || search) && (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs text-white/30">Active filters:</span>
                    {search && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        Search: {search}
                        <button onClick={() => setSearch("")} aria-label="Clear search" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {type !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        {type}
                        <button onClick={() => setType("All")} aria-label="Clear type filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {rarity !== "all" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs" style={{ color: rarityMeta[rarity].hex }}>
                        {rarityLabels[rarity]}
                        <button onClick={() => setRarity("all")} aria-label="Clear rarity filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {slot !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        Slot: {slot}
                        <button onClick={() => setSlot("All")} aria-label="Clear slot filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filtered.map((item) => {
                    const m = rarityMeta[normalizeRarity(item.rarity)];

                    return (
                      <RarityCard
                        key={item.itemId}
                        id={item.itemId}
                        name={item.name}
                        tag={item.rarity}
                        image={item.iconUrl}
                        accent={m.hex}
                        onClick={() => router.push(`/wiki/items/${item.itemId}`)}
                        fallbackIcon={<ItemIcon item={item} size={64} />}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
