"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Package, Search, ChevronRight, Filter, Star, Shield, Sword, Sparkles, Heart, Crown } from "lucide-react";
import { getAll, type ItemResponse } from "@/lib/api/items";

type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

const rarityKeys: ItemRarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

interface Item {
  id: number;
  name: string;
  rarity: ItemRarity;
  type: string;
  description: string;
  stats: {
    attack?: number;
    defense?: number;
    hp?: number;
    critRate?: number;
    critDamage?: number;
  };
  icon: ReactNode;
}

const rarityColors = {
  common: { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", glow: "shadow-gray-500/20" },
  uncommon: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/20" },
  rare: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  epic: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  legendary: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
  mythic: { bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20" },
};

const rarityNames = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

const itemTypes = ["All", "Weapon", "Armor", "Accessory", "Consumable", "Material", "QuestItem"];

function normalizeRarity(rarity?: string | null): ItemRarity {
  const normalized = rarity?.trim().toLowerCase();
  return rarityKeys.includes(normalized as ItemRarity) ? (normalized as ItemRarity) : "common";
}

function statValue(...values: Array<number | null | undefined>): number | undefined {
  const total = values.reduce<number>((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
  return total === 0 ? undefined : total;
}

function getItemIcon(item: ItemResponse): ReactNode {
  if (item.iconUrl) {
    return (
      <span
        role="img"
        aria-label={item.name}
        className="block w-full h-full bg-center bg-cover"
        style={{ backgroundImage: `url("${item.iconUrl}")` }}
      />
    );
  }

  const type = item.type.toLowerCase();
  if (type.includes("weapon")) return <Sword className="w-8 h-8" />;
  if (type.includes("armor")) return <Shield className="w-8 h-8" />;
  if (type.includes("accessory")) return <Crown className="w-8 h-8" />;
  if (type.includes("consumable")) return <Heart className="w-8 h-8" />;
  if (type.includes("quest")) return <Sparkles className="w-8 h-8" />;
  if (type.includes("material")) return <Package className="w-8 h-8" />;
  return <Star className="w-8 h-8" />;
}

function mapApiItem(item: ItemResponse): Item {
  return {
    id: item.itemId,
    name: item.name,
    rarity: normalizeRarity(item.rarity),
    type: item.type,
    description: item.description || "No item description available.",
    stats: {
      hp: statValue(item.baseHp, item.bonusHp),
      attack: statValue(item.baseAtk, item.bonusAtk),
      defense: statValue(item.baseDef, item.bonusDef),
      critRate: statValue(item.bonusCritRate),
      critDamage: statValue(item.bonusCritDamage),
    },
    icon: getItemIcon(item),
  };
}

export default function WikiItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState<string>("All");

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      try {
        const response = await getAll(1, 1000);
        if (!mounted) return;
        setItems(response.items.filter((item) => item.isActive).map(mapApiItem));
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load items.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadItems();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || item.type === selectedType;
    const matchesRarity = selectedRarity === "All" || item.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffc032]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20 px-4 text-center">
        <Package className="w-16 h-16 text-white/20" />
        <h1 className="text-2xl font-bold text-white">Unable to load items</h1>
        <p className="max-w-xl text-white/50">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#ffc032]/10 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-4">
            <Package className="w-5 h-5 text-[#ffc032]" />
            <span className="text-[#ffc032] font-medium">Item Database</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Items</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Browse all items, weapons, armor, and materials in Mystic Journey
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-white/50" />
              {itemTypes.map((type) => (
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

          {/* Rarity Filter */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-white/50 text-sm mr-2">Rarity:</span>
            <button
              onClick={() => setSelectedRarity("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedRarity === "All"
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {rarityKeys.map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedRarity === rarity
                    ? `${rarityColors[rarity].bg} ${rarityColors[rarity].text}`
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {rarityNames[rarity]}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-white/5 border ${rarityColors[item.rarity].border} rounded-2xl p-6 hover:shadow-xl ${rarityColors[item.rarity].glow} transition-all duration-300 cursor-pointer hover:-translate-y-1`}
            >
              {/* Item Icon */}
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${rarityColors[item.rarity].bg} flex items-center justify-center ${rarityColors[item.rarity].text} group-hover:scale-110 transition-transform overflow-hidden`}>
                {item.icon}
              </div>

              {/* Rarity Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${rarityColors[item.rarity].bg} ${rarityColors[item.rarity].text} mb-3`}>
                {rarityNames[item.rarity]}
              </div>

              {/* Item Name */}
              <h3 className={`text-lg font-bold mb-2 ${rarityColors[item.rarity].text} group-hover:text-white transition-colors`}>
                {item.name}
              </h3>

              {/* Type */}
              <p className="text-white/50 text-xs mb-3">{item.type}</p>

              {/* Description */}
              <p className="text-white/60 text-sm mb-4 line-clamp-2">{item.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-2">
                {item.stats.attack && (
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                    ATK +{item.stats.attack}
                  </span>
                )}
                {item.stats.defense && (
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                    DEF +{item.stats.defense}
                  </span>
                )}
                {item.stats.hp && (
                  <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs">
                    HP +{item.stats.hp}
                  </span>
                )}
                {item.stats.critRate && (
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs">
                    CRIT +{item.stats.critRate}%
                  </span>
                )}
                {item.stats.critDamage && (
                  <span className="px-2 py-1 bg-pink-500/10 text-pink-400 rounded text-xs">
                    CDMG +{item.stats.critDamage}%
                  </span>
                )}
              </div>

              {/* View Detail */}
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#ffc032]/20 rounded-xl text-white/70 hover:text-[#ffc032] transition-all cursor-pointer text-sm">
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
}
