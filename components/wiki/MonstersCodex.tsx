"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Ghost, X, LayoutGrid, Search } from "lucide-react";
import { getWikiMonsters, getWikiMonster, type MonsterResponse } from "@/lib/api/wiki";
import PageLoader from "@/components/ui/PageLoader";
import BookSpread, {
  BookTab,
  BookPager,
  BookPageTitle,
} from "@/components/ui/BookSpread";
import MonsterLeaf, { MonsterTypeIcon } from "@/components/wiki/MonsterLeaf";

const PAGE_SIZE = 12;

const TYPE_TABS = [
  { key: "All", label: "All Monsters" },
  { key: "Regular", label: "Regular" },
  { key: "Elite", label: "Elites" },
  { key: "Boss", label: "Bosses" },
] as const;

const SORTS = [
  { key: "level", label: "Level" },
  { key: "name", label: "Name (A-Z)" },
  { key: "hp", label: "Max HP" },
] as const;

const BE_TYPE_MAP: Record<string, string> = {
  Normal: "Regular",
  Regular: "Regular",
  Elite: "Elite",
  Boss: "Boss",
};

const TYPE_BORDER_COLOR: Record<string, string> = {
  Regular: "#9ca3af",
  Elite: "#f97316",
  Boss: "#ef4444",
};

// Renders the monster index entry reusable UI component.
// Features: binds user interaction event listeners.
// Returns the styled JSX element.
function MonsterIndexEntry({
  monster,
  active,
  onClick,
}: {
  monster: MonsterResponse;
  active: boolean;
  onClick: () => void;
}) {
  const normType = BE_TYPE_MAP[monster.type] ?? monster.type;
  const accentColor = TYPE_BORDER_COLOR[normType] || "#9ca3af";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      title={`${monster.name} (${normType} · Lvl ${monster.level})`}
      className={[
        "group flex cursor-pointer flex-col items-center gap-1 px-1 py-1.5 text-center transition-all duration-200 hover:scale-105",
        active ? "text-accent-deep font-bold" : "text-on-parchment/85 hover:text-accent-deep",
      ].join(" ")}
    >
      <span
        className={[
          "relative flex aspect-square w-full max-w-[4.5rem] items-center justify-center bg-wood-dark transition-all duration-200",
          "border-2 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.4)]",
          active
            ? "border-accent shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            : "border-accent-deep/55 group-hover:border-accent-deep group-hover:shadow-[0_0_8px_rgba(202,138,4,0.25)]",
        ].join(" ")}
        style={{
          backgroundColor: active ? `${accentColor}22` : undefined,
        }}
      >
        {monster.imageUrl ? (
          <img
            src={monster.imageUrl}
            alt=""
            className="pixelated h-full w-full object-contain p-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span className="text-amber-300 transition-transform group-hover:scale-110">
            <MonsterTypeIcon type={monster.type} size={24} />
          </span>
        )}


        <span
          className="pointer-events-none absolute inset-0 border opacity-70"
          style={{ borderColor: `${accentColor}aa` }}
          aria-hidden="true"
        />


        <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.2 text-[8px] font-black text-amber-300 border border-amber-500/40 rounded-xs">
          Lvl {monster.level}
        </span>

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
          active ? "font-bold text-amber-900" : "group-hover:text-amber-800",
        ].join(" ")}
      >
        {monster.name}
      </span>
    </button>
  );
}

// Renders the monsters codex reusable UI component.
// Returns the styled JSX element.
export default function MonstersCodex({ initialMonsterId }: { initialMonsterId?: number }) {
  const [allMonsters, setAllMonsters] = useState<MonsterResponse[]>([]);
  const [loading, setLoading] = useState(true);  // Initialize loading flag as active on first render
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
  const [type, setType] = useState<string>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("level");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<number | null>(initialMonsterId ?? null);
  const [orphan, setOrphan] = useState<MonsterResponse | null>(null);

  // Debounce the current input, update debounced search and page, and cancel the pending timer before the effect reruns or unmounts.
  useEffect(() => {
    // Helper function executing t.
    // Processes input parameters and returns the calculated result.
    const t = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, 300);  // Reset to first page after filter/search change
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load wiki monsters when the dependencies change, update all monsters, error, and loading, and ignore stale callbacks after unmount.
  useEffect(() => {
    let mounted = true;
    getWikiMonsters({ page: 1, pageSize: 1000 })
      .then((res) => {
        if (mounted) {
          setAllMonsters(res.items);
          setError(null);
        }
      })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load monsters."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Load wiki monster when the dependencies change, update orphan, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!initialMonsterId || allMonsters.length === 0) return;
    if (allMonsters.some((m) => m.monsterId === initialMonsterId)) return;
    let mounted = true;
    getWikiMonster(initialMonsterId)
      .then((res) => { if (mounted) setOrphan(res); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [initialMonsterId, allMonsters]);

  // Filter the source collection with the current search and category values, then apply the selected ordering before returning the visible results.
  const filtered = useMemo(() => {
    // Helper function executing q.
    // Processes input parameters and returns the calculated result.
    const q = allMonsters.filter((m) => {
      if (debouncedSearch && !m.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      const normType = BE_TYPE_MAP[m.type] ?? m.type;
      if (type !== "All" && normType !== type) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "level") return b.level - a.level;
      if (sort === "hp") return (b.maxHp ?? 0) - (a.maxHp ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [allMonsters, debouncedSearch, type, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Count the loaded records by their category key and return a lookup used to render filter totals.
  const typeCounts = useMemo(() => {
    const c: Record<string, number> = { All: allMonsters.length };
    allMonsters.forEach((m) => {
      const normType = BE_TYPE_MAP[m.type] ?? m.type;
      c[normType] = (c[normType] ?? 0) + 1;
    });
    return c;
  }, [allMonsters]);

  const selected =
    allMonsters.find((m) => m.monsterId === selectedId)
    ?? (orphan && orphan.monsterId === selectedId ? orphan : null)
    ?? pageItems[0]
    ?? null;

  // Helper function executing open entry.
  function openEntry(id: number) {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/wiki/monsters/${id}`);
    }
  }

  const hasFilters = Boolean(searchInput) || type !== "All";

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pt-[88px] md:pt-[112px]">
        <Ghost className="h-16 w-16 text-fg-subtle" aria-hidden="true" />
        <h2 className="text-xl font-bold text-fg">Unable to load monsters</h2>
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
          title="Monster Codex"
          tone="crimson"
          ratio="even"
          leafHeight="md:h-[42rem]"
          tabs={TYPE_TABS.map((t) => (
            <BookTab
              key={t.key}
              active={type === t.key}
              onClick={() => { setType(t.key); setPage(1); }}  // Reset to first page after filter/search change
              label={t.label}
              count={typeCounts[t.key] ?? 0}
              icon={
                t.key === "All"
                  ? <LayoutGrid className="h-4 w-4" />
                  : <MonsterTypeIcon type={t.key} size={16} />
              }
            />
          ))}
          footer={
            <BookPager page={safePage} totalPages={totalPages} onPage={setPage} />
          }
          left={
            <div className="flex h-full flex-col">
              <BookPageTitle as="h1" align="left" eyebrow="Bestiary Index">
                {type === "All" ? "All Monsters" : `${type} Monsters`}
              </BookPageTitle>


              <div className="mt-4 flex items-center gap-2 border-2 border-wood/50 bg-wood/10 px-3 shadow-inner focus-within:border-accent-deep">
                <Search className="h-4 w-4 shrink-0 text-on-parchment/50" />
                <input
                  id="monster-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search monsters..."
                  aria-label="Search monsters"
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


              <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                {pageItems.length === 0 ? (
                  <div className="py-14 text-center">
                    <Ghost className="mx-auto mb-3 h-10 w-10 text-on-parchment/30" aria-hidden="true" />
                    <p className="text-sm font-bold text-on-parchment/80">No monsters found</p>
                    <p className="mt-1 text-xs italic text-on-parchment/60">
                      Try another filter or clear search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
                    {pageItems.map((m) => (
                      <MonsterIndexEntry
                        key={m.monsterId}
                        monster={m}
                        active={selected?.monsterId === m.monsterId}
                        onClick={() => openEntry(m.monsterId)}
                      />
                    ))}
                  </div>
                )}
              </div>


              <div className="mt-auto border-t border-wood/30 pt-3">
                <div className="flex items-center justify-between text-[11px] text-on-parchment/65">
                  <span>{filtered.length} matching monsters</span>
                  <span>Page {safePage} of {totalPages}</span>
                </div>
                {hasFilters && (
                  <button
                    onClick={() => { setSearchInput(""); setType("All"); setPage(1); }}  // Reset to first page after filter/search change
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
              <MonsterLeaf monster={selected} />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <Ghost className="mb-3 h-14 w-14 text-on-parchment/25" aria-hidden="true" />
                <p className="text-base text-on-parchment/80">No monster open</p>
                <p className="mt-1 text-sm italic text-on-parchment/60">
                  Pick a monster from the index to read it here.
                </p>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
