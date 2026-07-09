"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ghost, Swords, Shield, Zap, Heart, Skull, X, Package } from "lucide-react";
import { getAll } from "@/lib/api/monsters";
import type { MonsterResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

const BE_TYPE_MAP: Record<string, string> = {
  Normal: "Regular",
  Elite: "Elite",
  Boss: "Boss",
};

const typeColors: Record<string, string> = {
  Regular: "bg-white/10",
  Elite: "bg-orange-500/20",
  Boss: "bg-red-500/20",
};

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t === "boss") return <Skull style={{ width: size, height: size }} />;
  if (t === "elite") return <Swords style={{ width: size, height: size }} />;
  if (t === "regular") return <Ghost style={{ width: size, height: size }} />;
  return <Ghost style={{ width: size, height: size }} />;
}

const typeOptions = ["All", "Regular", "Elite", "Boss"];
const PAGE_SIZE = 50;

export default function WikiMonstersPage() {
  const [allMonsters, setAllMonsters] = useState<MonsterResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sort, setSort] = useState<"level" | "name" | "hp">("level");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await getAll(1, 1000);
        if (!mounted) return;
        setAllMonsters(res.items);
      } catch {
        if (!mounted) return;
        setError("Failed to load monsters. Please try again.");
      } finally {
        if (!mounted) return;
        setInitialLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const fetchMonsters = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const res = await getAll(1, 1000);
      setAllMonsters(res.items);
    } catch {
      setError("Failed to load monsters. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const toDisplayType = (t: string) => BE_TYPE_MAP[t] ?? t;

  const filtered = useMemo(() => {
    const q = allMonsters.filter((m) => {
      if (debouncedSearch && !m.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (selectedType !== "All" && toDisplayType(m.type) !== selectedType) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "level") return b.level - a.level;
      if (sort === "hp") return b.maxHp - a.maxHp;
      return a.name.localeCompare(b.name);
    });
  }, [allMonsters, debouncedSearch, selectedType, sort]);

  if (initialLoading) return <PageLoader />;

  return (
    <div className="pt-[88px] md:pt-[112px]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto flex">
        <aside className={`fixed lg:sticky top-[88px] md:top-[112px] z-40 w-60 h-[calc(100vh-88px)] md:shrink-0 self-start bg-[#0F0F0F] overflow-y-auto nice-scrollbar transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="px-2 py-4 space-y-4">
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Sort By</h3>
              <div className="space-y-0.5">
                {([
                  { key: "level", label: "Level" },
                  { key: "name", label: "Name (A-Z)" },
                  { key: "hp", label: "HP" },
                ] as const).map((s) => {
                  const isActive = sort === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center text-left transition-colors duration-200 cursor-pointer",
                        isActive ? "bg-[#3A3A3A] text-white" : "bg-transparent text-white hover:bg-[#272727]",
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
            {(search || selectedType !== "All") && (
              <button
                onClick={() => { setSearch(""); setSelectedType("All"); }}
                className="w-full h-10 px-3 rounded-[10px] flex items-center justify-center gap-2 bg-transparent hover:bg-[#272727] text-[#AAAAAA] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Clear Filters</span>
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2">
              {typeOptions.map((t) => {
                const isActive = selectedType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={[
                      "h-9 px-4 rounded-xl flex items-center gap-2 transition-colors duration-200 cursor-pointer text-sm font-medium",
                      isActive ? "bg-[#3A3A3A] text-white" : "bg-[#1a1a1a] text-white/60 hover:bg-[#252525] hover:text-white border border-white/10",
                    ].join(" ")}
                  >
                    {t !== "All" && <TypeIcon type={t} size={14} />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 md:px-6 py-6">
            {error ? (
              <div className="text-center py-24">
                <Ghost className="w-16 h-16 text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-3">{error}</p>
                <button onClick={fetchMonsters} className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm hover:bg-white/20 transition-colors cursor-pointer">
                  Retry
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <Ghost className="w-16 h-16 text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-3">No monsters found</p>
                <p className="text-white/25 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                {(selectedType !== "All" || debouncedSearch) && (
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
                    {selectedType !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        {selectedType}
                        <button onClick={() => setSelectedType("All")} aria-label="Clear type filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((monster) => (
                    <div
                      key={monster.monsterId}
                      className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex gap-4 p-4">
                        <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${typeColors[toDisplayType(monster.type)] || "bg-white/10"} text-white/60 group-hover:scale-105 transition-transform flex-shrink-0`}>
                          <TypeIcon type={toDisplayType(monster.type)} size={32} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors truncate">
                              {monster.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                            <span className={`px-2 py-0.5 rounded ${
                              toDisplayType(monster.type) === "Boss" ? "bg-red-500/20 text-red-400" :
                              toDisplayType(monster.type) === "Elite" ? "bg-orange-500/20 text-orange-400" :
                              "bg-white/10 text-white/50"
                            }`}>
                              {toDisplayType(monster.type)}
                            </span>
                            <span>Lv. {monster.level}</span>
                          </div>

                          <p className="text-white/60 text-xs mb-3 line-clamp-2">{monster.description}</p>

                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1 text-xs">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-white/70">{monster.maxHp.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Swords className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-white/70">{monster.atk}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Shield className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-white/70">{monster.def}</span>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-white/10">
                            <div className="flex flex-wrap gap-3 text-xs text-white/50">
                              <span>EXP: <span className="text-white/70">{monster.experienceReward}</span></span>
                              <span>Gold: <span className="text-white/70">{monster.goldReward}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
