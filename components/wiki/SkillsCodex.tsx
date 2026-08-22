"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, X, LayoutGrid, Search } from "lucide-react";
import { getWikiSkills, getWikiSkill, type SkillResponse } from "@/lib/api/wiki";
import PageLoader from "@/components/ui/PageLoader";
import BookSpread, {
  BookTab,
  BookPager,
  BookPageTitle,
} from "@/components/ui/BookSpread";
import SkillLeaf, { SkillTypeIcon, ClassIcon, SkillArtwork } from "@/components/wiki/SkillLeaf";

const PAGE_SIZE = 12;

const TYPE_TABS = [
  { key: "All", label: "All Skills" },
  { key: "Active", label: "Active" },
  { key: "Passive", label: "Passive" },
  { key: "Buff", label: "Buffs" },
  { key: "Debuff", label: "Debuffs" },
] as const;

const CLASS_OPTIONS = ["All", "Knight", "Archer", "Mage"] as const;

const SORTS = [
  { key: "level", label: "Unlock Level" },
  { key: "name", label: "Name (A-Z)" },
  { key: "damage", label: "Base Damage" },
] as const;

const TYPE_BORDER_COLOR: Record<string, string> = {
  Active: "#f87171",
  Passive: "#60a5fa",
  Buff: "#4ade80",
  Debuff: "#c084fc",
};

// Renders the skill index entry reusable UI component.
// Features: binds user interaction event listeners.
// Returns the styled JSX element.
function SkillIndexEntry({
  skill,
  active,
  onClick,
}: {
  skill: SkillResponse;
  active: boolean;
  onClick: () => void;
}) {
  const accentColor = TYPE_BORDER_COLOR[skill.type] || "#eab308";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      title={`${skill.name} (${skill.type} · Lvl ${skill.unlockLevel})`}
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
        <SkillArtwork
          skill={skill}
          className="h-full w-full transition-transform group-hover:scale-110"
          iconSize={24}
        />


        <span
          className="pointer-events-none absolute inset-0 border opacity-70"
          style={{ borderColor: `${accentColor}aa` }}
          aria-hidden="true"
        />


        <span className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 py-0.2 text-[8px] font-black text-amber-300 border border-amber-500/40 rounded-xs">
          Lvl {skill.unlockLevel}
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
        {skill.name}
      </span>
    </button>
  );
}

// Renders the skills codex reusable UI component.
// Returns the styled JSX element.
export default function SkillsCodex({ initialSkillId }: { initialSkillId?: number }) {
  const [allSkills, setAllSkills] = useState<SkillResponse[]>([]);
  const [loading, setLoading] = useState(true);  // Initialize loading flag as active on first render
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  const [type, setType] = useState<string>("All");
  const [cls, setCls] = useState<string>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["key"]>("level");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<number | null>(initialSkillId ?? null);
  const [orphan, setOrphan] = useState<SkillResponse | null>(null);

  // Debounce the current input, update debounced search and page, and cancel the pending timer before the effect reruns or unmounts.
  useEffect(() => {
    // Helper function executing t.
    // Processes input parameters and returns the calculated result.
    const t = setTimeout(() => { setDebouncedSearch(searchInput); setPage(1); }, 300);  // Reset to first page after filter/search change
    return () => clearTimeout(t);
  }, [searchInput]);

  // Load wiki skills when the dependencies change, update all skills, error, and loading, and ignore stale callbacks after unmount.
  useEffect(() => {
    let mounted = true;
    getWikiSkills({ page: 1, pageSize: 1000 })
      .then((res) => {
        if (mounted) {
          setAllSkills(res.items);
          setError(null);
        }
      })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load skills."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Load wiki skill when the dependencies change, update orphan, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!initialSkillId || allSkills.length === 0) return;
    if (allSkills.some((s) => s.skillId === initialSkillId)) return;
    let mounted = true;
    getWikiSkill(initialSkillId)
      .then((res) => { if (mounted) setOrphan(res); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [initialSkillId, allSkills]);

  // Filter the source collection with the current search and category values, then apply the selected ordering before returning the visible results.
  const filtered = useMemo(() => {
    // Helper function executing q.
    // Processes input parameters and returns the calculated result.
    const q = allSkills.filter((s) => {
      if (debouncedSearch && !s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !(s.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false)) return false;
      if (type !== "All" && s.type !== type) return false;
      if (cls !== "All" && s.classRequirement !== cls) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "level") return a.unlockLevel - b.unlockLevel;
      if (sort === "damage") return (b.baseDamage ?? 0) - (a.baseDamage ?? 0);
      return a.name.localeCompare(b.name);
    });
  }, [allSkills, debouncedSearch, type, cls, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Count the loaded records by their category key and return a lookup used to render filter totals.
  const typeCounts = useMemo(() => {
    const c: Record<string, number> = { All: allSkills.length };
    allSkills.forEach((s) => { c[s.type] = (c[s.type] ?? 0) + 1; });
    return c;
  }, [allSkills]);

  const selected =
    allSkills.find((s) => s.skillId === selectedId)
    ?? (orphan && orphan.skillId === selectedId ? orphan : null)
    ?? pageItems[0]
    ?? null;

  // Helper function executing open entry.
  function openEntry(id: number) {
    setSelectedId(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/wiki/skills/${id}`);
    }
  }

  const hasFilters = Boolean(searchInput) || type !== "All" || cls !== "All";

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pt-[88px] md:pt-[112px]">
        <Zap className="h-16 w-16 text-fg-subtle" aria-hidden="true" />
        <h2 className="text-xl font-bold text-fg">Unable to load skills</h2>
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
          title="Skill Codex"
          tone="arcane"
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
                  : <SkillTypeIcon type={t.key} size={16} />
              }
            />
          ))}
          footer={
            <BookPager page={safePage} totalPages={totalPages} onPage={setPage} />
          }
          left={
            <div className="flex h-full flex-col">
              <BookPageTitle as="h1" align="left" eyebrow="Index">
                {type === "All" ? "All Skills" : `${type} Skills`}
              </BookPageTitle>


              <div className="mt-4 flex items-center gap-2 border-2 border-wood/50 bg-wood/10 px-3 shadow-inner focus-within:border-accent-deep">
                <Search className="h-4 w-4 shrink-0 text-on-parchment/50" />
                <input
                  id="skill-search"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search skills..."
                  aria-label="Search skills"
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


              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-parchment/55">
                  Class
                </span>
                {CLASS_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCls(c); setPage(1); }}  // Reset to first page after filter/search change
                    aria-pressed={cls === c}
                    className={[
                      "flex cursor-pointer items-center gap-1 border px-2 py-0.5 text-[11px] transition-colors",
                      cls === c
                        ? "border-accent-deep bg-accent-deep/15 font-bold text-on-parchment"
                        : "border-wood/40 text-on-parchment/70 hover:border-wood/70",
                    ].join(" ")}
                  >
                    {c !== "All" && <ClassIcon cls={c} size={12} />}
                    {c}
                  </button>
                ))}
              </div>


              <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
                {pageItems.length === 0 ? (
                  <div className="py-14 text-center">
                    <Zap className="mx-auto mb-3 h-10 w-10 text-on-parchment/30" aria-hidden="true" />
                    <p className="text-sm font-bold text-on-parchment/80">No skills found</p>
                    <p className="mt-1 text-xs italic text-on-parchment/60">
                      Try another filter or clear search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
                    {pageItems.map((s) => (
                      <SkillIndexEntry
                        key={s.skillId}
                        skill={s}
                        active={selected?.skillId === s.skillId}
                        onClick={() => openEntry(s.skillId)}
                      />
                    ))}
                  </div>
                )}
              </div>


              <div className="mt-auto border-t border-wood/30 pt-3">
                <div className="flex items-center justify-between text-[11px] text-on-parchment/65">
                  <span>{filtered.length} matching skills</span>
                  <span>Page {safePage} of {totalPages}</span>
                </div>
                {hasFilters && (
                  <button
                    onClick={() => { setSearchInput(""); setType("All"); setCls("All"); setPage(1); }}  // Reset to first page after filter/search change
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
              <SkillLeaf skill={selected} />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <Zap className="mb-3 h-14 w-14 text-on-parchment/25" aria-hidden="true" />
                <p className="text-base text-on-parchment/80">No skill open</p>
                <p className="mt-1 text-sm italic text-on-parchment/60">
                  Pick a skill from the index to read it here.
                </p>
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
