"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, ChevronRight, Filter, Star, Zap, Shield, Sword, Sparkles, Heart, Crown } from "lucide-react";

interface Item {
  id: number;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type: string;
  description: string;
  stats: {
    attack?: number;
    defense?: number;
    hp?: number;
    critRate?: number;
  };
  icon: React.ReactNode;
}

const rarityColors = {
  common: { bg: "bg-gray-500/20", border: "border-gray-500/30", text: "text-gray-400", glow: "shadow-gray-500/20" },
  uncommon: { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", glow: "shadow-green-500/20" },
  rare: { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20" },
  epic: { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20" },
  legendary: { bg: "bg-amber-500/20", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20" },
};

const rarityNames = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const itemTypes = ["All", "Weapon", "Armor", "Accessory", "Consumable", "Material"];

export default function WikiItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState<string>("All");
  const router = useRouter();

  useEffect(() => {
    const mockItems: Item[] = [
      { id: 1, name: "Dragon Slayer Sword", rarity: "legendary", type: "Weapon", description: "A legendary blade forged from dragon fire. Deals massive damage to dragon-type enemies.", stats: { attack: 500, critRate: 25 }, icon: <Sword className="w-8 h-8" /> },
      { id: 2, name: "Mystic Staff", rarity: "epic", type: "Weapon", description: "Staff imbued with ancient mystical energies. Enhances all spell damage.", stats: { attack: 350, hp: 200 }, icon: <Sparkles className="w-8 h-8" /> },
      { id: 3, name: "Knight's Shield", rarity: "rare", type: "Armor", description: "A sturdy shield that provides excellent protection in battle.", stats: { defense: 300, hp: 150 }, icon: <Shield className="w-8 h-8" /> },
      { id: 4, name: "Speed Boots", rarity: "uncommon", type: "Accessory", description: "Enchanted boots that increase movement speed.", stats: { attack: 50 }, icon: <Zap className="w-8 h-8" /> },
      { id: 5, name: "Health Potion", rarity: "common", type: "Consumable", description: "Restores 500 HP when consumed.", stats: { hp: 500 }, icon: <Heart className="w-8 h-8" /> },
      { id: 6, name: "Dragon Scale", rarity: "epic", type: "Material", description: "Rare material dropped by dragons. Used for crafting legendary gear.", stats: {}, icon: <Package className="w-8 h-8" /> },
      { id: 7, name: "Phoenix Feather", rarity: "legendary", type: "Material", description: "A mystical feather from the phoenix. Required for ultimate gear crafting.", stats: {}, icon: <Star className="w-8 h-8" /> },
      { id: 8, name: "Shadow Dagger", rarity: "rare", type: "Weapon", description: "A swift dagger favored by assassins. Deals critical damage.", stats: { attack: 200, critRate: 30 }, icon: <Sword className="w-8 h-8" /> },
      { id: 9, name: "Mage Robes", rarity: "uncommon", type: "Armor", description: "Light armor that boosts magical abilities.", stats: { defense: 100, attack: 80 }, icon: <Sparkles className="w-8 h-8" /> },
      { id: 10, name: "Crown of Wisdom", rarity: "legendary", type: "Accessory", description: "An ancient crown that enhances all stats significantly.", stats: { attack: 200, defense: 200, hp: 500 }, icon: <Crown className="w-8 h-8" /> },
      { id: 11, name: "Iron Helmet", rarity: "common", type: "Armor", description: "Basic protective headgear for beginners.", stats: { defense: 50 }, icon: <Shield className="w-8 h-8" /> },
      { id: 12, name: "Elixir of Power", rarity: "epic", type: "Consumable", description: "Temporarily doubles all damage for 30 seconds.", stats: { attack: 100 }, icon: <Zap className="w-8 h-8" /> },
    ];

    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 300);
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
            {(["common", "uncommon", "rare", "epic", "legendary"] as const).map((rarity) => (
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
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${rarityColors[item.rarity].bg} flex items-center justify-center ${rarityColors[item.rarity].text} group-hover:scale-110 transition-transform`}>
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
