"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Package, X, LayoutGrid, Search } from "lucide-react";
import { getWikiItems, getWikiItem, type ItemResponse } from "@/lib/api/wiki";
import PageLoader from "@/components/ui/PageLoader";
import BookSpread, {
  BookTab,
  BookPager,
  BookPageTitle,
} from "@/components/ui/BookSpread";
import ItemLeaf, { ItemTypeIcon, typeLabel } from "@/components/wiki/ItemLeaf";
import {
  RARITY_KEYS,
  RARITY_META,
  getRarityMeta,
  normalizeRarity,
  type ItemRarity,
} from "@/lib/data/rarity";

/* One tome for the whole item codex: the verso is the index of entries, the
   recto is the entry you have open. /wiki/items and /wiki/items/[id] both render
   this — the deep link only differs in which entry starts open, so there is no
   second layout to keep in step.

   Type filters are the tabs on the cover edge, as in the game's own book UI, and
   the pager sits on the leather under the gutter because turning a page moves
   the whole spread, not one leaf. */

/* Twelve tiles divides evenly by both grid widths below (3 across on a phone, 4
   from `sm` up), so a page never ends in a ragged short row. Three rows of four
   is also what fits the fixed leaf height without the index scrolling at a
   desktop size — see `leafHeight` on the spread. */
const PAGE_SIZE = 12;

const TYPE_TABS = [
  { key: "All", label: "All entries" },
  { key: "Weapon", label: "Weapons" },
  { key: "Armor", label: "Armor" },
  { key: "Consumable", label: "Consumables" },
  { key: "Material", label: "Materials" },
  { key: "QuestItem", label: "Quest items" },
] as const;

const SORTS = [
  { key: "rarity", label: "Rarity" },
  { key: "name", label: "Name (A-Z)" },
  { key: "value", label: "Base Value" },
] as const;

/* One tile in the index grid, laid out as the game's own item panel: a square
   plate with the name printed under it. The whole tile is the hit area and it is
   never below the 44px touch floor, since the plate alone clears it.

   The open entry is inked in deep gold — never the CTA gold, which on a page
   would read as something to act on. */
function IndexEntry({
  item,
  active,
  onClick,
}: {
  item: ItemResponse;
  active: boolean;
  onClick: () => void;
}) {
  const m = getRarityMeta(item.rarity);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      title={`${item.name} (${m.label})`}
      className={[
        "group flex cursor-pointer flex-col items-center gap-1 px-1 py-1.5 text-center transition-colors",
        active ? "text-accent-deep font-bold" : "text-on-parchment/85 hover:text-accent-deep",
      ].join(" ")}
    >
      <span
        className={[
          "relative flex aspect-square w-full max-w-[4.5rem] items-center justify-center bg-wood-dark transition-colors",
          "border-2 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.4)]",
          active ? "border-accent" : "border-accent-deep/55 group-hover:border-accent-deep",
        ].join(" ")}
      >
        {item.iconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.iconUrl}
            alt=""
            className="pixelated h-full w-full object-contain p-1"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span className="text-parchment-dim">
            <ItemTypeIcon type={item.type} size={22} />
          </span>
        )}

        {/* Hairline tier ring */}
        <span
          className="pointer-events-none absolute inset-0 border opacity-70"
          style={{ borderColor: `${m.hex}aa` }}
          aria-hidden="true"
        />

        {active && (
          <span aria-hidden="true">
            <span className="pointer-events-none absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-accent" />
            <span className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-accent" />
            <span className="pointer-events-none absolute -bottom-1 -left-1 h-2 w-2 border-b-2 border-l-2 border-accent" />
            <span className="pointer-events-none absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-accent" />
          </span>
        )}
      </span>

      <span
        className={[
          "line-clamp-2 w-full text-[11px] leading-tight transition-colors",
          active ? "font-bold text-accent-deep" : "text-on-parchment/85 group-hover:text-accent-deep",
        ].join(" ")}
      >
        {item.name}
      </span>

      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: m.pips }, (_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 border border-wood/60 shadow-sm"
            style={{ backgroundColor: m.hex }}
          />
        ))}
      </span>
      <span className="sr-only">
        {m.label} {typeLabel(item.type)}
      </span>
    </button>
  );
}

export default function ItemsCodex({ initialItemId }: { initialItemId?: number }) {
  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState<string>("All");
  const [rarity, setRarity] = useState<ItemRarity | "all">("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("rarity");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<number | null>(initialItemId ?? null);
  /* A deep link can name an entry the list does not carry (the list is active
     entries only). Fetch that one on its own rather than showing an empty leaf. */
  const [orphan, setOrphan] = useState<ItemResponse | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    let mounted = true;
    getWikiItems({ page: 1, pageSize: 1000 })
      .then((res) => { if (mounted) { setAllItems(res.items); setError(null); } })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load items."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!initialItemId || allItems.length === 0) return;
    if (allItems.some((i) => i.itemId === initialItemId)) return;
    let mounted = true;
    getWikiItem(initialItemId)
      .then((res) => { if (mounted) setOrphan(res); })
      .catch(() => { /* the not-found leaf below covers it */ });
    return () => { mounted = false; };
  }, [initialItemId, allItems]);

  const filtered = useMemo(() => {
    const q = allItems.filter((i) => {
      if (debouncedSearch && !i.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (type !== "All" && i.type !== type) return false;
      if (rarity !== "all" && normalizeRarity(i.rarity) !== rarity) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "rarity") {
        return getRarityMeta(b.rarity).sort - getRarityMeta(a.rarity).sort
          || a.name.localeCompare(b.name);
      }
      if (sort === "value") return (b.baseValue ?? 0) - (a.baseValue ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [allItems, debouncedSearch, type, rarity, sort]);

  /* Clamping here rather than in an effect: a filter that shrinks the list past
     the current page would otherwise render one empty frame before correcting. */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const typeCounts = useMemo(() => {
    const c: Record<string, number> = { All: allItems.length };
    allItems.forEach((i) => { c[i.type] = (c[i.type] ?? 0) + 1; });
    return c;
  }, [allItems]);

  const selected =
    allItems.find((i) => i.itemId === selectedId)
    ?? (orphan && orphan.itemId === selectedId ? orphan : null)
    ?? pageItems[0]
    ?? null;

  function openEntry(id: number) {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/wiki/items/${id}`);
    }
  }

  const hasFilters = Boolean(searchInput) || type !== "All" || rarity !== "all";

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pt-[88px] md:pt-[112px]">
        <Package className="h-16 w-16 text-fg-subtle" aria-hidden="true" />
        <h2 className="text-xl font-bold text-fg">Unable to load items</h2>
        <p className="max-w-md text-center text-sm text-fg-muted">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="pixel-press h-11 cursor-pointer bg-accent px-4 text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh pb-16 pt-[88px] md:pt-[112px]">
      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/wiki"
            className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Wiki
          </Link>
          <span className="h-0.5 flex-1 bg-line" aria-hidden="true" />
        </div>

        <BookSpread
          title="Item Codex"
          tone="royal"
          ratio="even"
          leafHeight="md:h-[42rem]"
          tabs={TYPE_TABS.map((t) => (
            <BookTab
              key={t.key}
              active={type === t.key}
              onClick={() => { setType(t.key); setPage(1); }}
              label={t.label}
              count={typeCounts[t.key] ?? 0}
              icon={
                t.key === "All"
                  ? <LayoutGrid className="h-4 w-4" />
                  : <ItemTypeIcon type={t.key} size={16} />
              }
            />
          ))}
          footer={
            <BookPager page={safePage} totalPages={totalPages} onPage={setPage} />
          }
          left={
            <div className="flex h-full flex-col">
              <BookPageTitle as="h1" align="left" eyebrow="Index">
                {type === "All" ? "All Entries" : typeLabel(type)}
              </BookPageTitle>

              {/* Enhanced Fantasy Search Input */}
              <div className="mt-4 flex items-center gap-2 border-2 border-wood/50 bg-wood/10 px-3 shadow-inner focus-within:border-accent-deep">
                <Search className="h-4 w-4 shrink-0 text-on-parchment/50" />
                <input
                  id="item-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search entries..."
                  aria-label="Search entries"
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm text-on-parchment placeholder:text-on-parchment/40 focus:outline-none"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput("")}
                    aria-label="Clear search"
                    className="cursor-pointer text-on-parchment/55 hover:text-accent-deep"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Rarity filter pills */}
              <div className="mt-3 flex flex-wrap gap-1">
                <button
                  onClick={() => { setRarity("all"); setPage(1); }}
                  aria-pressed={rarity === "all"}
                  className={[
                    "cursor-pointer border px-2 py-1 text-[11px] transition-colors",
                    rarity === "all"
                      ? "border-accent-deep bg-accent-deep/15 font-bold text-on-parchment"
                      : "border-wood/40 text-on-parchment/70 hover:border-wood/70",
                  ].join(" ")}
                >
                  Any rarity
                </button>
                {RARITY_KEYS.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRarity(r); setPage(1); }}
                    aria-pressed={rarity === r}
                    className={[
                      "flex cursor-pointer items-center gap-1.5 border px-2 py-1 text-[11px] transition-colors",
                      rarity === r
                        ? "border-accent-deep bg-accent-deep/15 font-bold text-on-parchment"
                        : "border-wood/40 text-on-parchment/70 hover:border-wood/70",
                    ].join(" ")}
                  >
                    <span
                      className="h-2 w-2 border border-wood/60 shadow-sm"
                      style={{ backgroundColor: RARITY_META[r].hex }}
                      aria-hidden="true"
                    />
                    {RARITY_META[r].label}
                  </button>
                ))}
              </div>

              {/* Index Scroll Region */}
              <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                {pageItems.length === 0 ? (
                  <div className="py-14 text-center">
                    <Package className="mx-auto mb-3 h-10 w-10 text-on-parchment/30" aria-hidden="true" />
                    <p className="text-sm font-bold text-on-parchment/80">No entries found</p>
                    <p className="mt-1 text-xs italic text-on-parchment/60">
                      Try another tab or clear the filters.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
                    {pageItems.map((i) => (
                      <IndexEntry
                        key={i.itemId}
                        item={i}
                        active={selected?.itemId === i.itemId}
                        onClick={() => openEntry(i.itemId)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Verso Footer */}
              <div className="mt-auto border-t border-wood/30 pt-3">
                <div className="flex items-center justify-between text-[11px] text-on-parchment/65">
                  <span>{filtered.length} matching entries</span>
                  <span>Page {safePage} of {totalPages}</span>
                </div>
                {hasFilters && (
                  <button
                    onClick={() => { setSearchInput(""); setType("All"); setRarity("all"); setPage(1); }}
                    className="mt-2 flex h-9 w-full cursor-pointer items-center justify-center gap-2 border border-wood/50 bg-wood/5 text-xs text-on-parchment/80 transition-colors hover:border-accent-deep hover:text-accent-deep"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Clear Active Filters
                  </button>
                )}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-parchment/55">
                    Sort
                  </span>
                  {SORTS.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      aria-pressed={sort === s.key}
                      className={[
                        "cursor-pointer border px-2 py-0.5 text-[11px] transition-colors",
                        sort === s.key
                          ? "border-accent-deep bg-accent-deep/15 font-bold text-on-parchment"
                          : "border-wood/40 text-on-parchment/70 hover:border-wood/70",
                      ].join(" ")}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          }
          right={
            selected ? (
              <ItemLeaf item={selected} />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <Package className="mb-3 h-14 w-14 text-on-parchment/25" aria-hidden="true" />
                <p className="text-base text-on-parchment/80">No entry open</p>
                <p className="mt-1 text-sm italic text-on-parchment/60">
                  Pick a name from the facing page to read it here.
                </p>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
