"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Map, MapPin, Lock, Trees, Mountain, Skull, Scroll,
  ChevronLeft, Flame, Snowflake, Leaf, Star,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Location {
  id: string;
  name: string;
  type: "dungeon" | "town" | "field" | "boss" | "secret";
  description: string;
  isDiscovered: boolean;
  requirements?: string;
}

interface Chapter {
  id: string;
  chapter: number;
  name: string;
  subtitle: string;
  description: string;
  lore: string;
  image: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  barColor: string;
  level: string;
  isUnlocked: boolean;
  completionRate: number;
  totalLocations: number;
  discoveredLocations: number;
  locations: Location[];
}

const CHAPTERS: Chapter[] = [
  {
    id: "elf-forest",
    chapter: 1,
    name: "Elf Forest",
    subtitle: "The Enchanted Woodland",
    description:
      "Ancient trees tower over hidden elven ruins. A creeping shadow spreads through the roots — the elves call upon outsiders for aid before the forest is lost forever.",
    lore:
      "Elder Rowan speaks of a dark corruption seeping from the forest core. Shadow Sprouts multiply in the undergrowth, and the Sprout King stirs in the depths.",
    image: "/images/worlds/latest/elf-forest.png",
    icon: <Trees className="w-6 h-6" />,
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    badgeBg: "bg-emerald-900/60",
    badgeText: "text-emerald-300",
    barColor: "bg-emerald-500",
    level: "Lv. 1–20",
    isUnlocked: true,
    completionRate: 100,
    totalLocations: 8,
    discoveredLocations: 8,
    locations: [
      { id: "elder-village", name: "Elder Rowan's Village", type: "town", description: "Starting hub — speak with Elder Rowan to receive your first quest.", isDiscovered: true },
      { id: "whispering-grove", name: "Whispering Grove", type: "field", description: "Dense ancient forest teeming with forest sprites and herb nodes.", isDiscovered: true },
      { id: "root-cavern", name: "Root Cavern", type: "dungeon", description: "Underground dungeon infested by Shadow Sprouts.", isDiscovered: true, requirements: "Lv. 5+" },
      { id: "elven-ruins", name: "Elven Ruins", type: "field", description: "Crumbling stone arches — remnants of a lost elven civilization.", isDiscovered: true },
      { id: "moonlit-spring", name: "Moonlit Spring", type: "secret", description: "Hidden healing spring blessed by the forest spirits.", isDiscovered: true },
      { id: "forest-core", name: "Forest Core", type: "boss", description: "Lair of the Sprout King — the Chapter 1 final boss.", isDiscovered: true, requirements: "Lv. 15+" },
      { id: "canopy-market", name: "Canopy Market", type: "town", description: "Elven treetop bazaar selling forest-themed gear.", isDiscovered: true },
      { id: "shadow-glade", name: "Shadow Glade", type: "dungeon", description: "Corrupted clearing — elite Shadow Sprout patrol.", isDiscovered: true, requirements: "Lv. 12+" },
    ],
  },
  {
    id: "autumn-pumpkin",
    chapter: 2,
    name: "Autumn Pumpkin",
    subtitle: "The Eternal Harvest",
    description:
      "An endless autumn grips this land of giant pumpkins and restless spirits. Ancient harvest rituals have gone awry, and now the living must appease the restless dead.",
    lore:
      "The Harvest Moon never sets here. Pumpkin golems guard the sacred fields, and a great Witch lurks at the heart of the Pumpkin Citadel.",
    image: "/images/worlds/latest/autumn-pumpkin.png",
    icon: <Leaf className="w-6 h-6" />,
    accentColor: "text-orange-400",
    borderColor: "border-orange-500/40",
    badgeBg: "bg-orange-950/60",
    badgeText: "text-orange-300",
    barColor: "bg-orange-500",
    level: "Lv. 20–40",
    isUnlocked: true,
    completionRate: 65,
    totalLocations: 9,
    discoveredLocations: 6,
    locations: [
      { id: "harvest-town", name: "Harvest Town", type: "town", description: "A once-prosperous village now haunted by the eternal autumn curse.", isDiscovered: true },
      { id: "pumpkin-fields", name: "Giant Pumpkin Fields", type: "field", description: "Sprawling fields of enormous pumpkins hiding loot and danger.", isDiscovered: true },
      { id: "haunted-barn", name: "Haunted Barn", type: "dungeon", description: "Overrun by scarecrow golems and restless spirits.", isDiscovered: true, requirements: "Lv. 22+" },
      { id: "twilight-cemetery", name: "Twilight Cemetery", type: "field", description: "Roaming undead drop rare soul fragments.", isDiscovered: true },
      { id: "pumpkin-citadel", name: "Pumpkin Citadel", type: "boss", description: "Fortress of the Harvest Witch — Chapter 2 final boss.", isDiscovered: false, requirements: "Lv. 35+" },
      { id: "spirit-market", name: "Spirit Market", type: "secret", description: "Spectral vendors selling Halloween-exclusive gear.", isDiscovered: true },
      { id: "lantern-maze", name: "Lantern Maze", type: "dungeon", description: "Pitch-black maze lit only by jack-o-lanterns.", isDiscovered: false, requirements: "Lv. 28+" },
      { id: "cauldron-peak", name: "Cauldron Peak", type: "field", description: "Volcanic hot springs with alchemical crafting nodes.", isDiscovered: true },
      { id: "witchs-hut", name: "Witch's Hut", type: "secret", description: "Hidden witch dwelling with unique potion recipes.", isDiscovered: false },
    ],
  },
  {
    id: "frozen-mountains",
    chapter: 3,
    name: "Frozen Mountains",
    subtitle: "The Glacial Tundra",
    description:
      "Jagged peaks crowned with eternal ice. An unnatural blizzard seals the mountain pass, summoned by a creature of pure frost that cannot be reasoned with.",
    lore:
      "Explorers speak of a Glacier Titan dormant beneath the ice lake — and of a civilization frozen mid-stride, preserved in crystal-clear ice for centuries.",
    image: "/images/worlds/latest/frozen-mountains.png",
    icon: <Snowflake className="w-6 h-6" />,
    accentColor: "text-sky-400",
    borderColor: "border-sky-500/40",
    badgeBg: "bg-sky-950/60",
    badgeText: "text-sky-300",
    barColor: "bg-sky-500",
    level: "Lv. 40–60",
    isUnlocked: true,
    completionRate: 30,
    totalLocations: 10,
    discoveredLocations: 3,
    locations: [
      { id: "base-camp", name: "Mountaineer's Base Camp", type: "town", description: "Expedition outpost with cold-weather gear vendors.", isDiscovered: true },
      { id: "frozen-tundra", name: "Frozen Tundra", type: "field", description: "Open snowfields with polar bears and ice foxes.", isDiscovered: true },
      { id: "ice-cavern", name: "Ice Cavern", type: "dungeon", description: "Crystal caverns with ice elemental ambushes.", isDiscovered: true, requirements: "Lv. 42+" },
      { id: "blizzard-pass", name: "Blizzard Pass", type: "field", description: "Treacherous path with near-zero visibility.", isDiscovered: false, requirements: "Complete Ice Cavern" },
      { id: "aurora-shrine", name: "Aurora Shrine", type: "secret", description: "Ancient shrine that glows under the northern lights.", isDiscovered: false },
      { id: "glacier-lake", name: "Glacier Lake", type: "dungeon", description: "Frozen lake dungeon over a dormant titan.", isDiscovered: false, requirements: "Lv. 52+" },
      { id: "frost-citadel", name: "Frost Citadel", type: "boss", description: "Realm of the Glacier Titan — Chapter 3 final boss.", isDiscovered: false, requirements: "Lv. 58+" },
      { id: "yeti-village", name: "Yeti Village", type: "town", description: "Neutral yeti settlement — trade rare pelts here.", isDiscovered: false },
      { id: "crystal-mine", name: "Crystal Mine", type: "field", description: "Rich in rare ice crystals for weapon upgrades.", isDiscovered: false },
      { id: "frozen-archive", name: "Frozen Archive", type: "secret", description: "Library of a frozen civilization preserving ancient knowledge.", isDiscovered: false },
    ],
  },
  {
    id: "vestige-era",
    chapter: 4,
    name: "Vestige of an Era",
    subtitle: "The Ancient Ruins",
    description:
      "The crumbling remnants of a civilization consumed by time. Ancient machines still hum with energy, and forgotten relics pulse with dormant power waiting to be unlocked.",
    lore:
      "What catastrophe erased this golden age? The answer lies deep within the Nexus Core — a relic of impossible engineering that still ticks, waiting for someone worthy.",
    image: "/images/worlds/latest/vestige-era.png",
    icon: <Skull className="w-6 h-6" />,
    accentColor: "text-violet-400",
    borderColor: "border-violet-500/40",
    badgeBg: "bg-violet-950/60",
    badgeText: "text-violet-300",
    barColor: "bg-violet-500",
    level: "Lv. 60–80",
    isUnlocked: false,
    completionRate: 0,
    totalLocations: 10,
    discoveredLocations: 0,
    locations: [
      { id: "ruin-gateway", name: "Ruin Gateway", type: "town", description: "Threshold settlement of relic hunters and archaeologists.", isDiscovered: false, requirements: "Complete Frozen Mountains" },
      { id: "overgrown-plaza", name: "Overgrown Plaza", type: "field", description: "Vine-covered ancient city square patrolled by automaton sentinels.", isDiscovered: false },
      { id: "artifact-vault", name: "Artifact Vault", type: "dungeon", description: "Sealed chamber with traps protecting pre-collapse relics.", isDiscovered: false, requirements: "Lv. 62+" },
      { id: "colossus-graveyard", name: "Colossus Graveyard", type: "field", description: "Toppled massive statues — some not as dead as they seem.", isDiscovered: false },
      { id: "temporal-rift", name: "Temporal Rift", type: "secret", description: "Time anomaly allowing glimpses of the civilization at its peak.", isDiscovered: false },
      { id: "automaton-factory", name: "Automaton Factory", type: "dungeon", description: "Self-repairing dungeon that generates new enemies constantly.", isDiscovered: false, requirements: "Lv. 70+" },
      { id: "nexus-core", name: "Nexus Core", type: "boss", description: "The final machine — Chapter 4 and game final boss.", isDiscovered: false, requirements: "Lv. 78+" },
      { id: "memory-hall", name: "Memory Hall", type: "secret", description: "Holographic records of the lost civilization's final days.", isDiscovered: false },
      { id: "sky-platform", name: "Sky Platform", type: "field", description: "Floating ruins high above the clouds.", isDiscovered: false, requirements: "Complete Automaton Factory" },
      { id: "ancient-library", name: "Ancient Library", type: "town", description: "Partially restored library — hub for lore and endgame quests.", isDiscovered: false, requirements: "Lv. 65+" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<string, { color: string; label: string }> = {
  dungeon: { color: "text-purple-400 bg-purple-500/20 border-purple-500/30", label: "Dungeon" },
  town:    { color: "text-green-400 bg-green-500/20 border-green-500/30",   label: "Town"    },
  field:   { color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30", label: "Field" },
  boss:    { color: "text-red-400 bg-red-500/20 border-red-500/30",         label: "Boss"    },
  secret:  { color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30", label: "Secret" },
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  dungeon: <Lock    className="w-3.5 h-3.5" />,
  town:    <MapPin  className="w-3.5 h-3.5" />,
  field:   <Trees   className="w-3.5 h-3.5" />,
  boss:    <Flame   className="w-3.5 h-3.5" />,
  secret:  <Star    className="w-3.5 h-3.5" />,
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function MapsPage() {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const chapter = selectedChapter;
  const filteredLocations = chapter
    ? chapter.locations.filter((l) =>
        typeFilter === "all" || l.type === typeFilter
      )
    : [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* ── Header ── */}
      <div className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,192,50,0.08),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          {!selectedChapter && (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
                <Map className="w-5 h-5 text-[#ffc032]" />
                <span className="text-[#ffc032] font-medium text-sm">World Map</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Explore the World
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Four legendary realms across four chapters. Each holds its own secrets, dangers, and story.
              </p>
            </>
          )}

          {selectedChapter && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => { setSelectedChapter(null); setTypeFilter("all"); }}
                className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 text-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to World Map
              </button>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border mb-3 ${selectedChapter.badgeBg} ${selectedChapter.badgeText} ${selectedChapter.borderColor}`}>
                Chapter {selectedChapter.chapter}
              </div>
              <h1 className={`text-4xl md:text-5xl font-black mb-2 ${selectedChapter.accentColor}`}>
                {selectedChapter.name}
              </h1>
              <p className="text-white/50 text-base">{selectedChapter.subtitle} · {selectedChapter.level}</p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">

        {/* ══ WORLD MAP VIEW ══════════════════════════════════════════════ */}
        {!selectedChapter && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => ch.isUnlocked && setSelectedChapter(ch)}
                className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-400 cursor-pointer
                  ${ch.isUnlocked ? "hover:-translate-y-2 hover:shadow-2xl" : "opacity-50 cursor-not-allowed"}
                  ${ch.borderColor} bg-black/40`}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={ch.image}
                    alt={ch.name}
                    fill
                    className={`object-cover transition-transform duration-500 ${ch.isUnlocked ? "group-hover:scale-110" : ""}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Lock overlay */}
                  {!ch.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="flex flex-col items-center gap-2">
                        <Lock className="w-10 h-10 text-white/40" />
                        <span className="text-white/40 text-xs font-medium">Locked</span>
                      </div>
                    </div>
                  )}

                  {/* Chapter badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-sm ${ch.badgeBg} ${ch.badgeText} ${ch.borderColor}`}>
                      Ch. {ch.chapter}
                    </span>
                  </div>

                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white/70 backdrop-blur-sm">
                      {ch.level}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className={`flex items-center gap-2 mb-1 ${ch.accentColor}`}>
                    {ch.icon}
                    <h3 className="text-base font-black text-white">{ch.name}</h3>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-3 line-clamp-2">
                    {ch.description}
                  </p>

                  {ch.isUnlocked && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Exploration</span>
                        <span className={`font-bold ${ch.accentColor}`}>{ch.completionRate}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${ch.barColor}`}
                          style={{ width: `${ch.completionRate}%` }}
                        />
                      </div>
                      <p className="text-white/30 text-xs">
                        {ch.discoveredLocations}/{ch.totalLocations} locations
                      </p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ══ CHAPTER DETAIL VIEW ═════════════════════════════════════════ */}
        {selectedChapter && (
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Hero image + lore */}
            <div className={`relative rounded-2xl overflow-hidden border ${selectedChapter.borderColor}`}>
              <div className="relative w-full aspect-[16/5]">
                <Image
                  src={selectedChapter.image}
                  alt={selectedChapter.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 max-w-lg">
                  <p className="text-sm text-white/60 leading-relaxed italic">"{selectedChapter.lore}"</p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Locations", value: `${selectedChapter.discoveredLocations}/${selectedChapter.totalLocations}` },
                { label: "Level Range", value: selectedChapter.level },
                { label: "Explored", value: `${selectedChapter.completionRate}%` },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl border p-4 text-center bg-white/[0.03] ${selectedChapter.borderColor}`}
                >
                  <p className={`text-2xl font-black ${selectedChapter.accentColor}`}>{stat.value}</p>
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
                    typeFilter === t
                      ? "bg-[#ffc032] text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {t !== "all" && TYPE_ICONS[t]}
                  {t === "all" ? "All" : TYPE_STYLES[t].label}
                </button>
              ))}
            </div>

            {/* Locations grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    loc.isDiscovered
                      ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                      : "bg-black/30 border-white/5 opacity-60"
                  }`}
                >
                  <div className={`mt-0.5 w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border ${TYPE_STYLES[loc.type].color}`}>
                    {loc.isDiscovered ? TYPE_ICONS[loc.type] : <Lock className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h4 className={`font-bold text-sm ${loc.isDiscovered ? "text-white" : "text-white/40"}`}>
                        {loc.isDiscovered ? loc.name : "???"}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${TYPE_STYLES[loc.type].color}`}>
                        {TYPE_STYLES[loc.type].label}
                      </span>
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {loc.isDiscovered ? loc.description : "Not yet discovered"}
                    </p>
                    {loc.requirements && !loc.isDiscovered && (
                      <p className="text-red-400 text-xs mt-1 font-medium">Requires: {loc.requirements}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredLocations.length === 0 && (
              <div className="text-center py-16">
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
