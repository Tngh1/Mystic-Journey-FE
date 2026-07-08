"use client";

import { useState, useEffect } from "react";
import { Gem, Search, ChevronRight, Star, Sparkles, Lock, Unlock, Crown, Sword, Shield } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";

interface GachaPool {
  id: number;
  name: string;
  type: string;
  cost: number;
  description: string;
  duration: string;
  featured: boolean;
  rarity: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  items: GachaItem[];
}

interface GachaItem {
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type: string;
  imageUrl: string;
}

const rarityColors = {
  common: { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", chance: 50 },
  uncommon: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", chance: 30 },
  rare: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", chance: 15 },
  epic: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", chance: 4 },
  legendary: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", chance: 1 },
};

export default function WikiGachaPage() {
  const [pools, setPools] = useState<GachaPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const mockPools: GachaPool[] = [
      {
        id: 1,
        name: "Standard Gacha",
        type: "Standard",
        cost: 160,
        description: "The classic gacha pool with a variety of items. Available at all times.",
        duration: "Permanent",
        featured: false,
        rarity: { common: 50, uncommon: 30, rare: 15, epic: 4, legendary: 1 },
        items: [
          { name: "Iron Sword", rarity: "common", type: "Weapon", imageUrl: "" },
          { name: "Leather Armor", rarity: "common", type: "Armor", imageUrl: "" },
          { name: "Steel Dagger", rarity: "uncommon", type: "Weapon", imageUrl: "" },
          { name: "Mystic Ring", rarity: "rare", type: "Accessory", imageUrl: "" },
          { name: "Phoenix Robes", rarity: "epic", type: "Armor", imageUrl: "" },
          { name: "Dragon Slayer", rarity: "legendary", type: "Weapon", imageUrl: "" },
        ],
      },
      {
        id: 2,
        name: "Premium Gacha",
        type: "Premium",
        cost: 300,
        description: "Higher chance for rare and epic items. Perfect for serious collectors.",
        duration: "Permanent",
        featured: true,
        rarity: { common: 30, uncommon: 30, rare: 25, epic: 12, legendary: 3 },
        items: [
          { name: "Crystal Staff", rarity: "rare", type: "Weapon", imageUrl: "" },
          { name: "Shadow Armor", rarity: "rare", type: "Armor", imageUrl: "" },
          { name: "Thunder Crown", rarity: "epic", type: "Accessory", imageUrl: "" },
          { name: "Void Dagger", rarity: "epic", type: "Weapon", imageUrl: "" },
          { name: "Dragon Heart", rarity: "legendary", type: "Material", imageUrl: "" },
        ],
      },
      {
        id: 3,
        name: "Summer Festival",
        type: "Limited",
        cost: 200,
        description: "Summer-themed items including exclusive beach outfits and water weapons!",
        duration: "Jun 1 - Jun 30",
        featured: true,
        rarity: { common: 40, uncommon: 30, rare: 20, epic: 8, legendary: 2 },
        items: [
          { name: "Beach Shorts", rarity: "common", type: "Armor", imageUrl: "" },
          { name: "Sun Hat", rarity: "uncommon", type: "Accessory", imageUrl: "" },
          { name: "Water Staff", rarity: "rare", type: "Weapon", imageUrl: "" },
          { name: "Summer Wings", rarity: "epic", type: "Accessory", imageUrl: "" },
          { name: "Poseidon's Trident", rarity: "legendary", type: "Weapon", imageUrl: "" },
        ],
      },
      {
        id: 4,
        name: "Character Banner",
        type: "Limited",
        cost: 400,
        description: "Featured characters with increased drop rates. Guaranteed 5-star after 90 pulls.",
        duration: "Limited Time",
        featured: true,
        rarity: { common: 0, uncommon: 40, rare: 40, epic: 15, legendary: 5 },
        items: [
          { name: "Shadow Knight", rarity: "rare", type: "Character", imageUrl: "" },
          { name: "Ice Princess", rarity: "rare", type: "Character", imageUrl: "" },
          { name: "Fire Mage", rarity: "epic", type: "Character", imageUrl: "" },
          { name: "Dragon Tamer", rarity: "legendary", type: "Character", imageUrl: "" },
        ],
      },
      {
        id: 5,
        name: "Weapon Enhancement",
        type: "Standard",
        cost: 180,
        description: "Focus on weapon drops with enhanced stats and unique abilities.",
        duration: "Permanent",
        featured: false,
        rarity: { common: 45, uncommon: 35, rare: 15, epic: 4, legendary: 1 },
        items: [
          { name: "Steel Blade", rarity: "common", type: "Weapon", imageUrl: "" },
          { name: "Enchanted Bow", rarity: "uncommon", type: "Weapon", imageUrl: "" },
          { name: "Flame Sword", rarity: "rare", type: "Weapon", imageUrl: "" },
          { name: "Thunder Hammer", rarity: "epic", type: "Weapon", imageUrl: "" },
          { name: "Excalibur", rarity: "legendary", type: "Weapon", imageUrl: "" },
        ],
      },
    ];

    setTimeout(() => {
      setPools(mockPools);
      setLoading(false);
    }, 300);
  }, []);

  const filteredPools = pools.filter((pool) => {
    const matchesSearch = pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || pool.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px] flex flex-col">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#ffc032]/10 to-transparent py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ffc032]/20 rounded-full mb-3">
            <Gem className="w-4 h-4 text-[#ffc032]" />
            <span className="text-[#ffc032] font-medium text-sm">Gacha Guide</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Gacha</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            Discover gacha pools, rates, and featured items
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-[1200px] mx-auto w-full px-4 pb-8 md:pb-12">
        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search gacha pools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Standard", "Premium", "Limited"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    selectedType === type
                      ? "bg-[#ffc032] text-black"
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gacha Pools */}
        <div className="space-y-6">
          {filteredPools.map((pool) => (
            <div
              key={pool.id}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffc032]/30 transition-all duration-300"
            >
              {/* Header */}
              <div className={`relative p-6 ${pool.featured ? "bg-gradient-to-r from-[#ffc032]/10 to-transparent" : ""}`}>
                {pool.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#ffc032] text-black rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="w-3 h-3" /> FEATURED
                    </span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl ${pool.type === "Premium" ? "bg-purple-500/20" : pool.type === "Limited" ? "bg-red-500/20" : "bg-blue-500/20"} flex items-center justify-center flex-shrink-0`}>
                    <Gem className={`w-10 h-10 ${pool.type === "Premium" ? "text-purple-400" : pool.type === "Limited" ? "text-red-400" : "text-blue-400"}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{pool.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pool.type === "Premium" ? "bg-purple-500/20 text-purple-400" :
                        pool.type === "Limited" ? "bg-red-500/20 text-red-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {pool.type}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{pool.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Gem className="w-4 h-4 text-[#ffc032]" />
                        <span className="text-white/70">{pool.cost} Gems</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {pool.duration === "Permanent" ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-red-400" />}
                        <span className="text-white/70">{pool.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rates Summary */}
                  <div className="flex-shrink-0">
                    <div className="text-center">
                      <p className="text-white/40 text-xs mb-2">Rates</p>
                      <div className="flex gap-1">
                        {Object.entries(pool.rarity).map(([rarity, chance]) => (
                          chance > 0 && (
                            <div key={rarity} className={`w-6 h-6 rounded ${rarityColors[rarity as keyof typeof rarityColors].bg} flex items-center justify-center`} title={`${rarity}: ${chance}%`}>
                              <span className={`text-[8px] font-bold ${rarityColors[rarity as keyof typeof rarityColors].text}`}>{chance}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <div className="px-6 pb-6">
                <p className="text-white/40 text-xs mb-4">Pool Items:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {pool.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-white/5 border ${rarityColors[item.rarity].border} rounded-xl p-3 text-center hover:bg-white/10 transition-colors`}
                    >
                      <div className="w-full aspect-square mb-2 overflow-hidden">
                        <img
                          src={item.imageUrl || "/images/demo.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
                        />
                      </div>
                      <p className={`text-xs font-medium ${rarityColors[item.rarity].text} line-clamp-1`}>{item.name}</p>
                      <p className="text-[10px] text-white/40">{item.type}</p>
                    </div>
                  ))}
                </div>

                {/* Detailed Rates */}
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <p className="text-white/40 text-xs mb-3">Drop Rates:</p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(pool.rarity).map(([rarity, chance]) => (
                      <div key={rarity} className={`p-3 rounded-lg ${rarityColors[rarity as keyof typeof rarityColors].bg} border ${rarityColors[rarity as keyof typeof rarityColors].border}`}>
                        <p className={`text-lg font-bold ${rarityColors[rarity as keyof typeof rarityColors].text}`}>{chance}%</p>
                        <p className={`text-xs ${rarityColors[rarity as keyof typeof rarityColors].text} capitalize`}>{rarity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-20">
            <Gem className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No gacha pools found</p>
          </div>
        )}
      </div>
    </div>
  );
}
