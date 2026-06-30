"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Package, Ghost, Castle, Gem, Scroll, Trophy, ChevronRight, Sparkles, Swords, Shield, Star, Map } from "lucide-react";

interface WikiCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  gradient: string;
  count: number;
}

export default function WikiPage() {
  const router = useRouter();
  const categories: WikiCategory[] = [
    { id: "maps", name: "Maps", description: "Explore the Enchanted Forest and discover hidden locations, dungeons, and scenic regions across Mystic Journey", icon: <Map className="w-10 h-10" />, href: "/wiki/maps", color: "text-teal-400", gradient: "from-teal-500/20 to-cyan-500/20", count: 6 },
    { id: "items", name: "Items", description: "Weapons, armor, accessories, consumables, and crafting materials found in Mystic Journey", icon: <Package className="w-10 h-10" />, href: "/wiki/items", color: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/20", count: 8 },
    { id: "monsters", name: "Monsters", description: "Enemies, minibosses, and creatures lurking in the Enchanted Forest and beyond", icon: <Ghost className="w-10 h-10" />, href: "/wiki/monsters", color: "text-red-400", gradient: "from-red-500/20 to-orange-500/20", count: 12 },
    { id: "dungeons", name: "Dungeons", description: "Challenging dungeons and boss encounters — including the Shadow-infested Forest Core", icon: <Castle className="w-10 h-10" />, href: "/wiki/dungeons", color: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20", count: 4 },
    { id: "gacha", name: "Gacha", description: "Gacha pools, drop rates, and featured items available in Mystic Journey", icon: <Gem className="w-10 h-10" />, href: "/wiki/gacha", color: "text-[#ffc032]", gradient: "from-[#ffc032]/20 to-amber-500/20", count: 12 },
    { id: "quests", name: "Quests", description: "The Chapter 1 main story chain, daily quests, and all adventure tasks in Mystic Journey", icon: <Scroll className="w-10 h-10" />, href: "/wiki/quests", color: "text-green-400", gradient: "from-green-500/20 to-emerald-500/20", count: 8 },
    { id: "achievements", name: "Achievements", description: "Trophies, milestones, and rewards for your heroic deeds", icon: <Trophy className="w-10 h-10" />, href: "/wiki/achievements", color: "text-amber-400", gradient: "from-amber-500/20 to-yellow-500/20", count: 48 },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-[#ffc032]" />
              <span className="text-[#ffc032] font-medium">Knowledge Base</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Wiki
            </h1>
            
            <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Your complete guide to the world of Mystic Journey. Browse items, monsters, dungeons, and more.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => router.push("/wiki/items")}
                className="flex items-center gap-2 px-6 py-3 bg-[#ffc032] text-black font-semibold rounded-xl hover:bg-[#ffc032]/90 transition-all duration-300 shadow-lg shadow-[#ffc032]/20 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => router.push(category.href)}
              className={`group text-left bg-gradient-to-br ${category.gradient} border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
            >
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${category.color}`}>
                {category.icon}
              </div>

              {/* Content */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-white group-hover:text-[#ffc032] transition-colors">
                  {category.name}
                </h3>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/60">
                  {category.count}
                </span>
              </div>

              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                {category.description}
              </p>

              <div className="flex items-center gap-2 text-[#ffc032] font-medium text-sm group-hover:gap-3 transition-all">
                Browse {category.name}
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Popular Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/wiki/items")}
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Best Weapons Guide</h4>
                <p className="text-white/50 text-sm">Top weapons for each class</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/wiki/dungeons")}
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Castle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Dungeon Tier List</h4>
                <p className="text-white/50 text-sm">Best dungeons for rewards</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/wiki/gacha")}
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#ffc032]/20 flex items-center justify-center text-[#ffc032] group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-white group-hover:text-[#ffc032] transition-colors">Gacha Strategy</h4>
                <p className="text-white/50 text-sm">Maximize your pulls</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
