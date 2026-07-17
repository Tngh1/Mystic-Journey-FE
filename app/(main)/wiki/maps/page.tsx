"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Map, MapPin, Trees, Mountain, Skull,
  ChevronLeft, Flame, Snowflake, Leaf, Star, TreesIcon,
  Shield, Users, Gem, Sword, Map as MapIcon,
} from "lucide-react";
import { getAll } from "@/lib/api/quests";
import type { QuestResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

// Static chapter definitions (maps have no public API — derived from quest data)
const CHAPTERS = [
  {
    id: "elf-forest",
    mapName: "Elf Forest",
    chapter: 1,
    name: "Elf Forest",
    subtitle: "The Enchanted Woodland",
    description: "Ancient trees tower over hidden elven ruins. Shadow creeps through the roots.",
    lore: "Elder Rowan speaks of a dark corruption seeping from the forest core.",
    image: "/images/worlds/latest/elf-forest.png",
    icon: <TreesIcon className="w-8 h-8" />,
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    badgeBg: "bg-emerald-900/60",
    badgeText: "text-emerald-300",
    barColor: "bg-emerald-500",
    level: "Lv. 1–20",
    accentBg: "bg-emerald-500/10",
  },
  {
    id: "autumn-pumpkin",
    mapName: "Autumn Pumpkin",
    chapter: 2,
    name: "Autumn Pumpkin",
    subtitle: "The Eternal Harvest",
    description: "An endless autumn grips this land. Harvest rituals have gone awry.",
    lore: "The Harvest Moon never sets here. A great Witch lurks at the Pumpkin Citadel.",
    image: "/images/worlds/latest/autumn-pumpkin.png",
    icon: <Leaf className="w-8 h-8" />,
    accentColor: "text-orange-400",
    borderColor: "border-orange-500/40",
    badgeBg: "bg-orange-950/60",
    badgeText: "text-orange-300",
    barColor: "bg-orange-500",
    level: "Lv. 20–40",
    accentBg: "bg-orange-500/10",
  },
  {
    id: "frozen-mountains",
    mapName: "Frozen Mountains",
    chapter: 3,
    name: "Frozen Mountains",
    subtitle: "The Glacial Tundra",
    description: "Jagged peaks crowned with eternal ice. A creature of pure frost cannot be reasoned with.",
    lore: "A Glacier Titan dormant beneath the ice lake — and a civilization frozen mid-stride.",
    image: "/images/worlds/latest/frozen-mountains.png",
    icon: <Snowflake className="w-8 h-8" />,
    accentColor: "text-sky-400",
    borderColor: "border-sky-500/40",
    badgeBg: "bg-sky-950/60",
    badgeText: "text-sky-300",
    barColor: "bg-sky-500",
    level: "Lv. 40–60",
    accentBg: "bg-sky-500/10",
  },
  {
    id: "vestige-era",
    mapName: "Vestige of an Era",
    chapter: 4,
    name: "Vestige of an Era",
    subtitle: "The Ancient Ruins",
    description: "Crumbling remnants of a civilization. Ancient machines still hum with energy.",
    lore: "What catastrophe erased this golden age? The answer lies within the Nexus Core.",
    image: "/images/worlds/latest/vestige-era.png",
    icon: <Skull className="w-8 h-8" />,
    accentColor: "text-violet-400",
    borderColor: "border-violet-500/40",
    badgeBg: "bg-violet-950/60",
    badgeText: "text-violet-300",
    barColor: "bg-violet-500",
    level: "Lv. 60–80",
    accentBg: "bg-violet-500/10",
  },
];

const TYPE_STYLES: Record<string, { color: string; label: string }> = {
  dungeon: { color: "text-purple-400 bg-purple-500/20 border-purple-500/30", label: "Dungeon" },
  town:    { color: "text-green-400 bg-green-500/20 border-green-500/30",   label: "Town"    },
  field:   { color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30", label: "Field" },
  boss:    { color: "text-red-400 bg-red-500/20 border-red-500/30",         label: "Boss"    },
  secret:  { color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30", label: "Secret" },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  dungeon: <Shield className="w-3.5 h-3.5" />,
  town:    <Users className="w-3.5 h-3.5" />,
  field:   <TreesIcon className="w-3.5 h-3.5" />,
  boss:    <Sword className="w-3.5 h-3.5" />,
  secret:  <Star className="w-3.5 h-3.5" />,
};

// Static locations per chapter
const CHAPTER_LOCATIONS: Record<string, { id: string; name: string; type: string; description: string; requirements?: string; isDiscovered?: boolean }[]> = {
  "Elf Forest": [
    { id: "elder-village", name: "Elder Rowan's Village", type: "town", description: "Starting hub — speak with Elder Rowan to receive your first quest.", isDiscovered: true },
    { id: "whispering-grove", name: "Whispering Grove", type: "field", description: "Dense ancient forest teeming with forest sprites and herb nodes.", isDiscovered: true },
    { id: "root-cavern", name: "Root Cavern", type: "dungeon", description: "Underground dungeon infested by Shadow Sprouts.", requirements: "Lv. 5+", isDiscovered: true },
    { id: "elven-ruins", name: "Elven Ruins", type: "field", description: "Crumbling stone arches — remnants of a lost elven civilization.", isDiscovered: true },
    { id: "moonlit-spring", name: "Moonlit Spring", type: "secret", description: "Hidden healing spring blessed by the forest spirits.", isDiscovered: true },
    { id: "forest-core", name: "Forest Core", type: "boss", description: "Lair of the Sprout King — the Chapter 1 final boss.", requirements: "Lv. 15+", isDiscovered: true },
    { id: "canopy-market", name: "Canopy Market", type: "town", description: "Elven treetop bazaar selling forest-themed gear.", isDiscovered: true },
    { id: "shadow-glade", name: "Shadow Glade", type: "dungeon", description: "Corrupted clearing — elite Shadow Sprout patrol.", requirements: "Lv. 12+", isDiscovered: true },
  ],
  "Autumn Pumpkin": [
    { id: "harvest-town", name: "Harvest Town", type: "town", description: "A once-prosperous village now haunted by the eternal autumn curse.", isDiscovered: true },
    { id: "pumpkin-fields", name: "Giant Pumpkin Fields", type: "field", description: "Sprawling fields of enormous pumpkins hiding loot and danger.", isDiscovered: true },
    { id: "haunted-barn", name: "Haunted Barn", type: "dungeon", description: "Overrun by scarecrow golems and restless spirits.", requirements: "Lv. 22+", isDiscovered: false },
    { id: "twilight-cemetery", name: "Twilight Cemetery", type: "field", description: "Roaming undead drop rare soul fragments.", isDiscovered: true },
    { id: "pumpkin-citadel", name: "Pumpkin Citadel", type: "boss", description: "Fortress of the Harvest Witch — Chapter 2 final boss.", requirements: "Lv. 35+", isDiscovered: false },
    { id: "spirit-market", name: "Spirit Market", type: "secret", description: "Spectral vendors selling Halloween-exclusive gear.", isDiscovered: false },
    { id: "lantern-maze", name: "Lantern Maze", type: "dungeon", description: "Pitch-black maze lit only by jack-o-lanterns.", requirements: "Lv. 28+", isDiscovered: false },
    { id: "witchs-hut", name: "Witch's Hut", type: "secret", description: "Hidden witch dwelling with unique potion recipes.", isDiscovered: false },
  ],
  "Frozen Mountains": [
    { id: "base-camp", name: "Mountaineer's Base Camp", type: "town", description: "Expedition outpost with cold-weather gear vendors.", isDiscovered: false },
    { id: "frozen-tundra", name: "Frozen Tundra", type: "field", description: "Open snowfields with polar bears and ice foxes.", isDiscovered: false },
    { id: "ice-cavern", name: "Ice Cavern", type: "dungeon", description: "Crystal caverns with ice elemental ambushes.", requirements: "Lv. 42+", isDiscovered: false },
    { id: "blizzard-pass", name: "Blizzard Pass", type: "field", description: "Treacherous path with near-zero visibility.", requirements: "Complete Ice Cavern", isDiscovered: false },
    { id: "aurora-shrine", name: "Aurora Shrine", type: "secret", description: "Ancient shrine that glows under the northern lights.", isDiscovered: false },
    { id: "glacier-lake", name: "Glacier Lake", type: "dungeon", description: "Frozen lake dungeon over a dormant titan.", requirements: "Lv. 52+", isDiscovered: false },
    { id: "frost-citadel", name: "Frost Citadel", type: "boss", description: "Realm of the Glacier Titan — Chapter 3 final boss.", requirements: "Lv. 58+", isDiscovered: false },
  ],
  "Vestige of an Era": [
    { id: "ruin-gateway", name: "Ruin Gateway", type: "town", description: "Threshold settlement of relic hunters and archaeologists.", requirements: "Complete Frozen Mountains", isDiscovered: false },
    { id: "overgrown-plaza", name: "Overgrown Plaza", type: "field", description: "Vine-covered ancient city square patrolled by automaton sentinels.", isDiscovered: false },
    { id: "artifact-vault", name: "Artifact Vault", type: "dungeon", description: "Sealed chamber with traps protecting pre-collapse relics.", requirements: "Lv. 62+", isDiscovered: false },
    { id: "colossus-graveyard", name: "Colossus Graveyard", type: "field", description: "Toppled massive statues — some not as dead as they seem.", isDiscovered: false },
    { id: "temporal-rift", name: "Temporal Rift", type: "secret", description: "Time anomaly allowing glimpses of the civilization at its peak.", isDiscovered: false },
    { id: "nexus-core", name: "Nexus Core", type: "boss", description: "The final machine — game final boss.", requirements: "Lv. 78+", isDiscovered: false },
  ],
};

export default function MapsPage() {
  const [quests, setQuests] = useState<QuestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAll(1, 100);
      setQuests(res.items.filter((q) => q.isActive));
    } catch {
      // silently fail — static data still renders
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuests(); }, [fetchQuests]);

  // Enrich chapters with quest + location counts (wiki: everything visible)
  const chaptersWithCounts = CHAPTERS.map((ch) => {
    const count = quests.filter((q) => q.mapName === ch.mapName).length;
    const locations = CHAPTER_LOCATIONS[ch.mapName] ?? [];
    return { ...ch, questCount: count, total: locations.length };
  });

  const currentChapter = chaptersWithCounts.find((c) => c.mapName === selectedChapter);
  const filteredLocations = currentChapter
    ? CHAPTER_LOCATIONS[currentChapter.mapName]?.filter(
        (l) => typeFilter === "all" || l.type === typeFilter
      ) ?? []
    : [];

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      {/* Header */}
      <div className="relative overflow-hidden py-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,192,50,0.06),transparent_70%)]" />
        <div className="mx-auto px-4 relative z-10 text-center max-w-3xl">
          {selectedChapter && currentChapter ? (
            <div className="flex flex-col items-center">
              <button
                onClick={() => { setSelectedChapter(null); setTypeFilter("all"); }}
                className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors mb-5 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to World Map
              </button>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-3 ${currentChapter.badgeBg} ${currentChapter.badgeText} ${currentChapter.borderColor}`}>
                Chapter {currentChapter.chapter}
              </span>
              <h1 className={`text-4xl md:text-5xl font-black mb-2 ${currentChapter.accentColor}`}>
                {currentChapter.name}
              </h1>
              <p className="text-white/50">{currentChapter.subtitle}</p>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
                  <MapIcon className="w-3.5 h-3.5" />
                  World Map
                </span>
                <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                Explore the World
              </h1>
              <p className="text-white/55 text-base">
                {chaptersWithCounts.length} realms · {quests.length} quests to uncover
              </p>
            </>
          )}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pb-12">

        {/* ══ WORLD MAP ══════════════════════════════════════════════════ */}
        {!selectedChapter && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {chaptersWithCounts.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChapter(ch.mapName)}
                className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl ${ch.borderColor} bg-black/40`}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={ch.image}
                    alt={ch.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-sm ${ch.badgeBg} ${ch.badgeText} ${ch.borderColor}`}>
                      Ch. {ch.chapter}
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className={`flex items-center gap-2 mb-1 ${ch.accentColor}`}>
                    {ch.icon}
                    <h3 className="text-base font-black text-white">{ch.name}</h3>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">{ch.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-white/40">
                      Locations
                      <span className={`font-bold ${ch.accentColor}`}>{ch.total}</span>
                    </span>
                    <span className="flex items-center gap-1 text-white/40">
                      Quests
                      <span className={`font-bold ${ch.accentColor}`}>{ch.questCount}</span>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══ CHAPTER DETAIL ══════════════════════════════════════════ */}
        {selectedChapter && currentChapter && (
          <div className="max-w-[1200px] mx-auto space-y-6">

            {/* Hero image */}
            <div className={`relative rounded-2xl overflow-hidden border ${currentChapter.borderColor}`}>
              <div className="relative w-full aspect-[16/5]">
                <Image
                  src={currentChapter.image}
                  alt={currentChapter.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 max-w-lg">
                  <p className="text-sm text-white/60 leading-relaxed italic">"{currentChapter.lore}"</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Locations", value: currentChapter.total },
                { label: "Quests", value: currentChapter.questCount },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl border p-4 text-center bg-white/[0.03] ${currentChapter.borderColor}`}>
                  <p className={`text-2xl font-black ${currentChapter.accentColor}`}>{stat.value}</p>
                  <p className="text-white/40 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-2">
              {["all", "town", "field", "dungeon", "boss", "secret"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer ${
                    typeFilter === t ? "bg-[#ffc032] text-[#111]" : "bg-[#0d0d0d] text-white/60 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {t !== "all" && TYPE_ICONS[t]}
                  {t === "all" ? "All" : TYPE_STYLES[t]?.label}
                </button>
              ))}
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLocations.map((loc) => {
                const style = TYPE_STYLES[loc.type] ?? TYPE_STYLES.field;
                return (
                  <div
                    key={loc.id}
                    className="flex items-start gap-3 p-4 rounded-xl border bg-[#111111] border-white/10 hover:border-[#ffc032]/40 transition-colors"
                  >
                    <div className={`mt-0.5 w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border ${style.color}`}>
                      {TYPE_ICONS[loc.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="font-bold text-sm text-white">{loc.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${style.color}`}>
                          {TYPE_STYLES[loc.type]?.label}
                        </span>
                      </div>
                      <p className="text-white/45 text-xs leading-relaxed">{loc.description}</p>
                      {loc.requirements && (
                        <p className="text-white/40 text-xs mt-1 font-medium">Recommended: {loc.requirements}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No locations match this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
