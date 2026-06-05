"use client";

import { useState, useEffect } from "react";
import { Map, MapPin, Users, Star, ChevronRight, Search, Filter, Lock, Unlock, Mountain, Trees, Waves, Flame } from "lucide-react";

interface MapRegion {
  id: string;
  name: string;
  description: string;
  level: string;
  imageUrl: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  isUnlocked: boolean;
  completionRate: number;
  totalLocations: number;
  discoveredLocations: number;
  locations: Location[];
}

interface Location {
  id: string;
  name: string;
  type: "dungeon" | "town" | "field" | "boss" | "secret";
  description: string;
  isDiscovered: boolean;
  requirements?: string;
}

const mapTypes = [
  { id: "all", label: "All", icon: <Map className="w-4 h-4" /> },
  { id: "dungeon", label: "Dungeons", icon: <Lock className="w-4 h-4" /> },
  { id: "town", label: "Towns", icon: <MapPin className="w-4 h-4" /> },
  { id: "field", label: "Fields", icon: <Trees className="w-4 h-4" /> },
  { id: "boss", label: "Boss Areas", icon: <Flame className="w-4 h-4" /> },
];

export default function MapsPage() {
  const [regions, setRegions] = useState<MapRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const mockRegions: MapRegion[] = [
      {
        id: "starter-village",
        name: "Starter Village",
        description: "The peaceful starting area where new adventurers begin their journey. Safe zones with basic shops and NPC quests.",
        level: "Lv. 1-10",
        imageUrl: "/images/maps/starter-village.jpg",
        icon: <Trees className="w-6 h-6" />,
        color: "text-green-400",
        bgColor: "from-green-500/20 to-emerald-500/20",
        isUnlocked: true,
        completionRate: 100,
        totalLocations: 8,
        discoveredLocations: 8,
        locations: [
          { id: "village-center", name: "Village Center", type: "town", description: "Main hub with shops and quest givers", isDiscovered: true },
          { id: "training-ground", name: "Training Ground", type: "field", description: "Practice combat and skills", isDiscovered: true },
          { id: "beginner-dungeon", name: "Goblin Cave", type: "dungeon", description: "First dungeon for new players", isDiscovered: true, requirements: "Lv. 5+" },
          { id: "herbs-field", name: "Herb Gathering Spot", type: "field", description: "Collect basic crafting materials", isDiscovered: true },
          { id: "secret-cabin", name: "Old Hermit's Cabin", type: "secret", description: "Hidden area with special quests", isDiscovered: true },
        ],
      },
      {
        id: "forest-of-whispers",
        name: "Forest of Whispers",
        description: "A mystical forest filled with ancient magic. Home to forest creatures and hidden shrines.",
        level: "Lv. 10-25",
        imageUrl: "/images/maps/forest-of-whispers.jpg",
        icon: <Trees className="w-6 h-6" />,
        color: "text-emerald-400",
        bgColor: "from-emerald-500/20 to-teal-500/20",
        isUnlocked: true,
        completionRate: 85,
        totalLocations: 12,
        discoveredLocations: 10,
        locations: [
          { id: "fairy-spring", name: "Fairy Spring", type: "town", description: "Healing spring with fairy NPCs", isDiscovered: true },
          { id: "enchanted-grove", name: "Enchanted Grove", type: "field", description: "Dense forest with rare materials", isDiscovered: true },
          { id: "tree-maze", name: "Ancient Tree Maze", type: "dungeon", description: "Complex maze dungeon", isDiscovered: true, requirements: "Lv. 15+" },
          { id: "spirit-boss", name: "Ancient Treant", type: "boss", description: "Forest guardian boss", isDiscovered: false, requirements: "Lv. 20+" },
          { id: "hidden-shrine", name: "Whisper Shrine", type: "secret", description: "Hidden shrine with buffs", isDiscovered: true },
        ],
      },
      {
        id: "crystal-mountains",
        name: "Crystal Mountains",
        description: "Towering peaks filled with crystalline formations. Rich in minerals but dangerous wildlife.",
        level: "Lv. 25-40",
        imageUrl: "/images/maps/crystal-mountains.jpg",
        icon: <Mountain className="w-6 h-6" />,
        color: "text-cyan-400",
        bgColor: "from-cyan-500/20 to-blue-500/20",
        isUnlocked: true,
        completionRate: 60,
        totalLocations: 15,
        discoveredLocations: 9,
        locations: [
          { id: "mining-town", name: "Dwarven Settlement", type: "town", description: "Mining town with equipment upgrades", isDiscovered: true },
          { id: "crystal-cavern", name: "Crystal Caverns", type: "dungeon", description: "Mine crystals and fight cave monsters", isDiscovered: true, requirements: "Lv. 30+" },
          { id: "peak-expedition", name: "Mountain Peak", type: "field", description: "High altitude exploration zone", isDiscovered: false },
          { id: "ice-boss", name: "Frost Wyrm Lair", type: "boss", description: "Ice dragon boss encounter", isDiscovered: false, requirements: "Lv. 35+" },
        ],
      },
      {
        id: "volcanic-islands",
        name: "Volcanic Islands",
        description: "A chain of volcanic islands with lava rivers and fire monsters. Extreme heat zones and treasure vaults.",
        level: "Lv. 40-55",
        imageUrl: "/images/maps/volcanic-islands.jpg",
        icon: <Flame className="w-6 h-6" />,
        color: "text-orange-400",
        bgColor: "from-orange-500/20 to-red-500/20",
        isUnlocked: true,
        completionRate: 30,
        totalLocations: 18,
        discoveredLocations: 5,
        locations: [
          { id: "pirate-base", name: "Volcanic Port", type: "town", description: "Underground pirate hideout", isDiscovered: true },
          { id: "lava-dungeon", name: "Magma Depths", type: "dungeon", description: "Deep dungeon with fire enemies", isDiscovered: false, requirements: "Lv. 45+" },
          { id: "fire-boss", name: "Volcano Guardian", type: "boss", description: "Massive fire boss", isDiscovered: false, requirements: "Lv. 50+" },
          { id: "treasure-vault", name: "Hidden Treasure Vault", type: "secret", description: "Rare item location", isDiscovered: false },
        ],
      },
      {
        id: "ocean-depths",
        name: "Ocean Depths",
        description: "Underwater exploration zone with coral reefs and sea creatures. Requires underwater gear.",
        level: "Lv. 50-65",
        imageUrl: "/images/maps/ocean-depths.jpg",
        icon: <Waves className="w-6 h-6" />,
        color: "text-blue-400",
        bgColor: "from-blue-500/20 to-indigo-500/20",
        isUnlocked: false,
        completionRate: 0,
        totalLocations: 20,
        discoveredLocations: 0,
        locations: [
          { id: "mermaid-city", name: "Mermaid City", type: "town", description: "Underwater civilization", isDiscovered: false, requirements: "Complete Volcanic Islands" },
          { id: "coral-reef", name: "Coral Reef", type: "field", description: "Rich in materials and fish", isDiscovered: false },
          { id: "abyss", name: "The Abyss", type: "dungeon", description: "Deepest dungeon in the game", isDiscovered: false, requirements: "Lv. 60+" },
        ],
      },
      {
        id: "shadow-realm",
        name: "Shadow Realm",
        description: "Dark dimension with corrupted creatures and powerful bosses. Ultimate endgame content.",
        level: "Lv. 65-80",
        imageUrl: "/images/maps/shadow-realm.jpg",
        icon: <Star className="w-6 h-6" />,
        color: "text-purple-400",
        bgColor: "from-purple-500/20 to-violet-500/20",
        isUnlocked: false,
        completionRate: 0,
        totalLocations: 25,
        discoveredLocations: 0,
        locations: [
          { id: "shadow-citadel", name: "Shadow Citadel", type: "town", description: "Neutral ground in the darkness", isDiscovered: false, requirements: "Complete Ocean Depths" },
          { id: "nightmare-dungeon", name: "Nightmare Labyrinth", type: "dungeon", description: "Mind-bending dungeon", isDiscovered: false, requirements: "Lv. 70+" },
          { id: "final-boss", name: "Shadow Lord Throne", type: "boss", description: "Final boss encounter", isDiscovered: false, requirements: "Lv. 80" },
        ],
      },
    ];

    setTimeout(() => {
      setRegions(mockRegions);
      setLoading(false);
    }, 300);
  }, []);

  const filteredRegions = regions.filter((region) => {
    const matchesRegion = !selectedRegion || region.id === selectedRegion;
    const matchesSearch = region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const getFilteredLocations = (region: MapRegion) => {
    return region.locations.filter((loc) => {
      const matchesType = selectedType === "all" || loc.type === selectedType;
      const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "dungeon": return <Lock className="w-4 h-4" />;
      case "town": return <MapPin className="w-4 h-4" />;
      case "field": return <Trees className="w-4 h-4" />;
      case "boss": return <Flame className="w-4 h-4" />;
      case "secret": return <Star className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case "dungeon": return "text-purple-400 bg-purple-500/20";
      case "town": return "text-green-400 bg-green-500/20";
      case "field": return "text-emerald-400 bg-emerald-500/20";
      case "boss": return "text-red-400 bg-red-500/20";
      case "secret": return "text-yellow-400 bg-yellow-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffc032]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
              <Map className="w-5 h-5 text-[#ffc032]" />
              <span className="text-[#ffc032] font-medium">World Map</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Maps
            </h1>
            <p className="text-white/70 text-lg">
              Explore the world of Mystic Journey. Discover regions, dungeons, and hidden secrets.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search regions or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {mapTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  selectedType === type.id
                    ? "bg-[#ffc032] text-black"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {type.icon}
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
              selectedRegion === null
                ? "bg-[#ffc032] text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
            }`}
          >
            All Regions
          </button>
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                selectedRegion === region.id
                  ? "bg-[#ffc032] text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              {region.icon}
              <span className="text-sm">{region.name}</span>
            </button>
          ))}
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRegions.map((region) => {
            const filteredLocations = getFilteredLocations(region);
            const hasLocations = selectedRegion === null || filteredLocations.length > 0;

            if (!hasLocations && searchQuery) return null;

            return (
              <div
                key={region.id}
                className={`bg-gradient-to-br ${region.bgColor} border border-white/10 rounded-2xl overflow-hidden ${
                  !region.isUnlocked ? "opacity-60" : ""
                }`}
              >
                {/* Region Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center ${region.color}`}>
                        {region.isUnlocked ? region.icon : <Lock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{region.name}</h3>
                        <p className="text-white/60 text-sm">{region.level}</p>
                      </div>
                    </div>
                    {!region.isUnlocked && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-4">{region.description}</p>

                  {/* Progress */}
                  {region.isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Exploration</span>
                        <span className="text-white font-medium">{region.completionRate}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#ffc032] rounded-full transition-all"
                          style={{ width: `${region.completionRate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/40">
                        <span>{region.discoveredLocations} / {region.totalLocations} locations discovered</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Locations List */}
                {region.isUnlocked && (
                  <div className="p-4 max-h-80 overflow-y-auto">
                    <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Locations ({filteredLocations.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredLocations.map((location) => (
                        <div
                          key={location.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            location.isDiscovered
                              ? "bg-white/5 hover:bg-white/10"
                              : "bg-black/20 opacity-50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getLocationColor(location.type)}`}>
                            {location.isDiscovered ? getLocationIcon(location.type) : <Lock className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className={`font-medium ${location.isDiscovered ? "text-white" : "text-white/40"}`}>
                                {location.isDiscovered ? location.name : "???"}
                              </h5>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getLocationColor(location.type)}`}>
                                {location.type}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 mt-0.5">
                              {location.isDiscovered ? location.description : "Not yet discovered"}
                            </p>
                            {location.requirements && !location.isDiscovered && (
                              <p className="text-xs text-red-400 mt-1">
                                Requires: {location.requirements}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Locked Message */}
                {!region.isUnlocked && (
                  <div className="p-6 text-center">
                    <Lock className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">
                      Complete previous regions to unlock this area
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRegions.length === 0 && (
          <div className="text-center py-20">
            <Map className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No regions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
