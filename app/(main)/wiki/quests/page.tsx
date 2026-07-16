"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Scroll, Search, Star, MapPin, Clock, Gift, Gem, ChevronLeft, Trees, Leaf, Snowflake, Skull, Lock, Zap, MessageCircle, Package, Swords, Compass, MousePointerClick, ClipboardList, User } from "lucide-react";
import { getAll } from "@/lib/api/quests";
import type { QuestResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

const CHAPTER_THEMES = {
  "Elf Forest": {
    chapter: 1,
    icon: <Trees className="w-6 h-6" />,
    accent: "text-emerald-400",
    border: "border-emerald-500/40",
    badgeBg: "bg-emerald-900/60",
    badgeText: "text-emerald-300",
    barColor: "bg-emerald-500",
    levelRange: "Lv. 1–20",
  },
  "Autumn Pumpkin": {
    chapter: 2,
    icon: <Leaf className="w-6 h-6" />,
    accent: "text-orange-400",
    border: "border-orange-500/40",
    badgeBg: "bg-orange-950/60",
    badgeText: "text-orange-300",
    barColor: "bg-orange-500",
    levelRange: "Lv. 20–40",
  },
  "Frozen Mountains": {
    chapter: 3,
    icon: <Snowflake className="w-6 h-6" />,
    accent: "text-sky-400",
    border: "border-sky-500/40",
    badgeBg: "bg-sky-950/60",
    badgeText: "text-sky-300",
    barColor: "bg-sky-500",
    levelRange: "Lv. 40–60",
  },
  "Vestige of an Era": {
    chapter: 4,
    icon: <Skull className="w-6 h-6" />,
    accent: "text-violet-400",
    border: "border-violet-500/40",
    badgeBg: "bg-violet-950/60",
    badgeText: "text-violet-300",
    barColor: "bg-violet-500",
    levelRange: "Lv. 60–80",
  },
};

type QuestType = "Main" | "Side" | "Daily" | "Event";
const questTypeColors: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Main: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", label: "Main Story" },
  Side: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", label: "Side Quest" },
  Daily: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", label: "Daily" },
  Event: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", label: "Event" },
};

const objectiveIcons: Record<string, React.ReactNode> = {
  Talk: <MessageCircle className="w-3.5 h-3.5" />,
  Collect: <Package className="w-3.5 h-3.5" />,
  Defeat: <Swords className="w-3.5 h-3.5" />,
  Explore: <Compass className="w-3.5 h-3.5" />,
  OpenChest: <Gift className="w-3.5 h-3.5" />,
  Interact: <MousePointerClick className="w-3.5 h-3.5" />,
  EquipSkill: <Zap className="w-3.5 h-3.5" />,
};

function objectiveLabel(quest: QuestResponse): string {
  const type = quest.objectiveType;
  const target = quest.objectiveTarget?.trim() || "";
  const amount = Math.max(1, quest.targetAmount || 1);
  switch (type.toLowerCase()) {
    case "talk": return `Talk to ${target || quest.questGiverName || "NPC"}`;
    case "collect": return `Collect ${amount}x ${target || "item"}`;
    case "defeat": return `Defeat ${amount}x ${target || "enemy"}`;
    case "equipskill": return `Equip ${target || "skill"}`;
    case "openchest": return `Open ${amount}x ${target || "chest"}`;
    case "interact": return `Interact with ${target || "object"}`;
    case "explore": return `Explore ${target || quest.objectiveLocation || quest.regionName || quest.mapName}`;
    default: return target ? `${type}: ${target}` : type;
  }
}

const PAGE_SIZE = 100;

export default function WikiQuestsPage() {
  const [allQuests, setAllQuests] = useState<QuestResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [view, setView] = useState<"list" | "chapters">("chapters");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

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
        const res = await getAll(1, 1000, { isActive: true });
        if (!mounted) return;
        setAllQuests(res.items);
      } catch {
        if (!mounted) return;
        setError("Failed to load quests. Please try again.");
      } finally {
        if (!mounted) return;
        setInitialLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const loadQuests = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const res = await getAll(1, 1000, { isActive: true });
      setAllQuests(res.items);
    } catch {
      setError("Failed to load quests. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Get unique map names (chapters)
  const chapterNames = [...new Set(allQuests.map((q) => q.mapName))].sort();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentTheme = selectedChapter ? ((CHAPTER_THEMES as any)[selectedChapter] ?? null) : null;

  // Client-side filter
  const filtered = useMemo(() => {
    return allQuests.filter((q) => {
      if (debouncedSearch && !q.title.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (selectedType !== "All" && q.type !== selectedType) return false;
      if (selectedChapter && q.mapName !== selectedChapter) return false;
      return true;
    });
  }, [allQuests, debouncedSearch, selectedType, selectedChapter]);

  // Group quests by map/chapter
  const questsByChapter: Record<string, QuestResponse[]> = {};
  for (const quest of filtered) {
    if (!questsByChapter[quest.mapName]) questsByChapter[quest.mapName] = [];
    questsByChapter[quest.mapName].push(quest);
  }

  // Type options
  const questTypes = ["All", "Main", "Side", "Daily", "Event"].filter((t) =>
    t === "All" || allQuests.some((q) => q.type === t)
  );

  if (initialLoading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 py-10 md:py-14">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(85%,680px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[130px]" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <Scroll className="w-3.5 h-3.5" />
              Quest Database
            </span>
            <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Quests</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            {filtered.length} quests across {chapterNames.length} maps to complete.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 pb-8 md:pb-12">
        {/* Filters + View Toggle */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search quests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* View toggle */}
              <div className="flex bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => { setView("chapters"); setSelectedChapter(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${view === "chapters" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                >
                  By Map
                </button>
                <button
                  onClick={() => { setView("list"); setSelectedChapter(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${view === "list" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                >
                  List
                </button>
              </div>
              {view === "list" && questTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    selectedType === type
                      ? type === "All" ? "bg-white/20 text-white" : `${questTypeColors[type]?.bg ?? "bg-white/20"} ${questTypeColors[type]?.text ?? "text-white"}`
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {type === "All" ? "All" : questTypeColors[type]?.label ?? type}
                </button>
              ))}
              {view === "chapters" && selectedChapter && (
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> All Maps
                </button>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20">
            <Scroll className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-3">{error}</p>
            <button onClick={loadQuests} className="px-4 py-2 bg-[#ffc032] text-[#111] font-semibold rounded-xl text-sm hover:bg-[#ffd04c] transition-colors cursor-pointer">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ══ CHAPTERS VIEW ══════════════════════════════════════════ */}
            {view === "chapters" && !selectedChapter && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {chapterNames.map((mapName) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const theme = (CHAPTER_THEMES as any)[mapName];
                    const chapterQuests = questsByChapter[mapName] ?? [];
                    return (
                      <button
                        key={mapName}
                        onClick={() => setSelectedChapter(mapName)}
                        className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${theme ? theme.border : "border-white/10"} bg-black/40`}
                      >
                        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-black/60 to-white/5">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`${theme?.accent} opacity-40`}>
                              {theme?.icon ?? <MapPin className="w-12 h-12" />}
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {theme && (
                            <div className="absolute top-3 left-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-sm ${theme.badgeBg} ${theme.badgeText} ${theme.border}`}>
                                Ch. {theme.chapter}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className={`flex items-center gap-2 mb-1 ${theme?.accent ?? "text-white"}`}>
                            {theme?.icon}
                            <h3 className="text-base font-black text-white">{mapName}</h3>
                          </div>
                          <p className="text-white/50 text-xs">
                            {chapterQuests.length} quest{chapterQuests.length !== 1 ? "s" : ""}
                          </p>
                          {theme && (
                            <p className="text-white/30 text-xs mt-1">{theme.levelRange}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {chapterNames.length === 0 && (
                  <div className="text-center py-20">
                    <Scroll className="w-20 h-20 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No maps found</p>
                  </div>
                )}
              </div>
            )}

            {/* ══ CHAPTER DETAIL ═══════════════════════════════════════ */}
            {view === "chapters" && selectedChapter && (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <Scroll className="w-20 h-20 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No quests found</p>
                  </div>
                ) : (
                  filtered.map((quest) => (
                    <QuestCard key={quest.questId} quest={quest} />
                  ))
                )}
              </div>
            )}

            {/* ══ LIST VIEW ══════════════════════════════════════════════ */}
            {view === "list" && (
              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-20">
                    <Scroll className="w-20 h-20 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-lg">No quests found</p>
                  </div>
                ) : (
                  filtered.map((quest) => (
                    <QuestCard key={quest.questId} quest={quest} />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function QuestCard({ quest }: { quest: QuestResponse }) {
  const typeColor = questTypeColors[quest.type] ?? { bg: "bg-white/10", text: "text-white/70", border: "border-white/10", label: quest.type };
  const objective = objectiveLabel(quest);
  const objIcon = objectiveIcons[quest.objectiveType] ?? <ClipboardList className="w-3.5 h-3.5" />;

  return (
    <div className={`bg-[#111111] border ${typeColor.border} rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group`}>
      <div className="flex flex-col md:flex-row gap-5">
        {/* Type Badge */}
        <div className="flex-shrink-0">
          <div className={`w-14 h-14 rounded-2xl ${typeColor.bg} flex items-center justify-center ${typeColor.text}`}>
            <Scroll className="w-7 h-7" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-[#ffc032] transition-colors">
              {quest.title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor.bg} ${typeColor.text}`}>
              {typeColor.label}
            </span>
            <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50">Lv. {quest.requiredLevel}+</span>
          </div>

          <p className="text-white/55 text-sm mb-4 line-clamp-2">
            {quest.description ?? "No description available."}
          </p>

          {/* Objective */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-white/40 text-xs flex items-center gap-1">
              <Zap className="w-3 h-3" /> Objective:
            </span>
            <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/70 flex items-center gap-1.5">
              {objIcon}
              {objective}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
            {quest.mapName && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{quest.mapName}</span>
              </div>
            )}
            {quest.regionName && (
              <span>{quest.regionName}</span>
            )}
            {quest.questGiverName && (
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{quest.questGiverName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rewards */}
        <div className="flex-shrink-0 md:w-48 space-y-2">
          <p className="text-white/40 text-xs mb-1">Rewards</p>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/70">{quest.rewardExperience.toLocaleString()} EXP</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#ffc032]" />
            <span className="text-sm text-white/70">{quest.rewardGold.toLocaleString()} Gold</span>
          </div>
          {quest.rewardGems > 0 && (
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-cyan-300" />
              <span className="text-sm text-white/70">{quest.rewardGems.toLocaleString()} Gems</span>
            </div>
          )}
          {quest.rewardItemName && (
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-white/70 truncate">{quest.rewardItemName}</span>
            </div>
          )}
          {quest.rewardSkillName && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/70 truncate">{quest.rewardSkillName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
