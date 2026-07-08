"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Zap, Shield, Swords, Heart, Sparkles, Ghost, X, Clock, Lock, Star,
} from "lucide-react";
import { getSkills, type SkillResponse } from "@/lib/api/skills";
import PageLoader from "@/components/ui/PageLoader";

type SkillType = "All" | "Active" | "Passive" | "Buff" | "Debuff";
type DamageType = "All" | "Physical" | "Magical" | "TrueDamage";
type ClassRequirement = "All" | "Knight" | "Archer" | "Mage";

const TYPE_OPTIONS: SkillType[] = ["All", "Active", "Passive", "Buff", "Debuff"];
const DAMAGE_OPTIONS: DamageType[] = ["All", "Physical", "Magical", "TrueDamage"];
const CLASS_OPTIONS: ClassRequirement[] = ["All", "Knight", "Archer", "Mage"];

const typeColors: Record<string, { bg: string; text: string; hex: string }> = {
  Active:  { bg: "bg-red-500/20", text: "text-red-400", hex: "#f87171" },
  Passive: { bg: "bg-blue-500/20", text: "text-blue-400", hex: "#60a5fa" },
  Buff:    { bg: "bg-green-500/20", text: "text-green-400", hex: "#4ade80" },
  Debuff:  { bg: "bg-purple-500/20", text: "text-purple-400", hex: "#c084fc" },
};

const classColors: Record<string, { bg: string; text: string; hex: string }> = {
  Knight: { bg: "bg-red-500/20", text: "text-red-400", hex: "#f87171" },
  Archer: { bg: "bg-green-500/20", text: "text-green-400", hex: "#4ade80" },
  Mage:   { bg: "bg-blue-500/20", text: "text-blue-400", hex: "#60a5fa" },
};

const damageColors: Record<string, { bg: string; text: string }> = {
  Physical:   { bg: "bg-orange-500/20", text: "text-orange-400" },
  Magical:    { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  TrueDamage: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t === "active") return <Zap style={{ width: size, height: size }} />;
  if (t === "passive") return <Star style={{ width: size, height: size }} />;
  if (t === "buff") return <Shield style={{ width: size, height: size }} />;
  if (t === "debuff") return <Ghost style={{ width: size, height: size }} />;
  return <Sparkles style={{ width: size, height: size }} />;
}

function ClassIcon({ cls, size = 14 }: { cls: string; size?: number }) {
  const c = cls.toLowerCase();
  if (c === "knight") return <Shield style={{ width: size, height: size }} />;
  if (c === "archer") return <Swords style={{ width: size, height: size }} />;
  if (c === "mage") return <Sparkles style={{ width: size, height: size }} />;
  return <Star style={{ width: size, height: size }} />;
}

export default function WikiSkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<SkillType>("All");
  const [damageType, setDamageType] = useState<DamageType>("All");
  const [cls, setCls] = useState<ClassRequirement>("All");
  const [sort, setSort] = useState<"level" | "name" | "damage">("level");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getSkills(1, 1000);
        if (!mounted) return;
        setSkills(res.items.filter((s) => s.isActive));
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load skills.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = skills.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !(s.description?.toLowerCase().includes(search.toLowerCase()) ?? false)) return false;
      if (type !== "All" && s.type !== type) return false;
      if (damageType !== "All" && s.damageType !== damageType) return false;
      if (cls !== "All" && s.classRequirement !== cls) return false;
      return true;
    });

    return q.sort((a, b) => {
      if (sort === "level") return a.unlockLevel - b.unlockLevel;
      if (sort === "damage") return b.baseDamage - a.baseDamage;
      return a.name.localeCompare(b.name);
    });
  }, [skills, search, type, damageType, cls, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: skills.length };
    TYPE_OPTIONS.slice(1).forEach((t) => {
      c[t] = skills.filter((s) => s.type === t).length;
    });
    return c;
  }, [skills]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-[88px] md:pt-[112px] px-4">
        <Zap className="w-16 h-16 text-white/20" />
        <h2 className="text-xl font-bold text-white">Unable to load skills</h2>
        <p className="text-white/50 text-sm max-w-md text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#ffc032] text-black font-semibold rounded-xl cursor-pointer"
        >
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
        <aside className={`fixed lg:sticky top-[88px] md:top-[112px] z-40 w-60 h-[calc(100vh-88px)] md:shrink-0 self-start bg-[#0F0F0F] overflow-y-auto nice-scrollbar transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="px-2 py-4 space-y-4">

            {/* Type */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Type</h3>
              <div className="space-y-0.5">
                {TYPE_OPTIONS.map((t) => {
                  const isActive = type === t;
                  const meta = typeColors[t];
                  return (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center justify-between transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-2">
                        {t !== "All" && (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.hex || "#9ca3af" }} />
                        )}
                        <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                          {t}
                        </span>
                      </span>
                      {t === "All" && <span className="text-xs text-[#AAAAAA]">{counts.All}</span>}
                      {counts[t] !== undefined && <span className="text-xs text-[#AAAAAA]">{counts[t]}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Damage Type */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Damage Type</h3>
              <div className="space-y-0.5">
                {DAMAGE_OPTIONS.map((d) => {
                  const isActive = damageType === d;
                  return (
                    <button
                      key={d}
                      onClick={() => setDamageType(d)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center text-left transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                        {d === "TrueDamage" ? "True" : d}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Sort By</h3>
              <div className="space-y-0.5">
                {([
                  { key: "level" as const, label: "Unlock Level" },
                  { key: "name" as const, label: "Name (A-Z)" },
                  { key: "damage" as const, label: "Base Damage" },
                ]).map((s) => {
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
            {(search || type !== "All" || damageType !== "All" || cls !== "All") && (
              <button
                onClick={() => { setSearch(""); setType("All"); setDamageType("All"); setCls("All"); }}
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
          {/* Class Filter Bar */}
          <div className="px-4 md:px-6 pt-6 pb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {CLASS_OPTIONS.map((c) => {
                  const isActive = cls === c;
                  const meta = classColors[c];
                  return (
                    <button
                      key={c}
                      onClick={() => setCls(c)}
                      className={[
                        "h-9 px-4 rounded-xl flex items-center gap-2 transition-colors duration-200 cursor-pointer text-sm font-medium",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-[#1a1a1a] text-white/60 hover:bg-[#252525] hover:text-white border border-white/10",
                      ].join(" ")}
                    >
                      {c !== "All" && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.hex || "#9ca3af" }} />
                      )}
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="px-4 md:px-6 py-6">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Zap className="w-16 h-16 text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-3">No skills found</p>
                <p className="text-white/25 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                {/* Active filters */}
                {(type !== "All" || damageType !== "All" || cls !== "All" || search) && (
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
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs" style={{ color: typeColors[type]?.hex }}>
                        {type}
                        <button onClick={() => setType("All")} aria-label="Clear type filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {damageType !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs" style={{ color: "#9ca3af" }}>
                        {damageType}
                        <button onClick={() => setDamageType("All")} aria-label="Clear damage filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {cls !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs" style={{ color: classColors[cls]?.hex }}>
                        {cls}
                        <button onClick={() => setCls("All")} aria-label="Clear class filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((skill) => {
                    const typeMeta = typeColors[skill.type] || { bg: "bg-gray-500/20", text: "text-gray-400", hex: "#9ca3af" };
                    const classMeta = classColors[skill.classRequirement] || { bg: "bg-gray-500/20", text: "text-gray-400", hex: "#9ca3af" };

                    return (
                      <div
                        key={skill.skillId}
                        className={`group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300 cursor-pointer`}
                        onClick={() => router.push(`/wiki/skills/${skill.skillId}`)}
                      >
                        <div className="p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors truncate">
                                {skill.name}
                              </h3>
                              <p className="text-white/50 text-xs mt-0.5">
                                Unlock at Lv. {skill.unlockLevel}
                              </p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${typeMeta.bg} flex items-center justify-center ${typeMeta.text} group-hover:scale-105 transition-transform flex-shrink-0`}>
                              <TypeIcon type={skill.type} size={24} />
                            </div>
                          </div>

                          {/* Description */}
                          {skill.description && (
                            <p className="text-white/60 text-xs mb-3 line-clamp-2">
                              {skill.description}
                            </p>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeMeta.bg} ${typeMeta.text}`}>
                              {skill.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${damageColors[skill.damageType]?.bg || "bg-gray-500/20"} ${damageColors[skill.damageType]?.text || "text-gray-400"}`}>
                              {skill.damageType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${classMeta.bg} ${classMeta.text}`}>
                              {skill.classRequirement}
                            </span>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
                            {skill.baseDamage > 0 && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <Swords className="w-4 h-4 text-red-400" />
                                <span className="text-white/70">
                                  {skill.baseDamage.toLocaleString()}
                                </span>
                                {skill.damageGrowthPercent > 0 && (
                                  <span className="text-white/40">(+{skill.damageGrowthPercent}%/lv)</span>
                                )}
                              </div>
                            )}
                            {skill.cooldownSeconds > 0 && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span className="text-white/70">{skill.cooldownSeconds}s</span>
                              </div>
                            )}
                            {skill.targetType !== "Self" && (
                              <div className="flex items-center gap-1.5 text-xs">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-white/70">{skill.targetType}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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
