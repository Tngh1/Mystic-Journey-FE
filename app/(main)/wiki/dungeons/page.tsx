"use client";

import { useState, useEffect } from "react";
import { Castle, Search, ChevronRight, Filter, Swords, Users, Clock, Star, Lock, Unlock } from "lucide-react";

interface Dungeon {
  id: number;
  name: string;
  type: string;
  difficulty: number;
  level: number;
  players: string;
  duration: string;
  description: string;
  rewards: string[];
  bosses: string[];
  isUnlocked: boolean;
  imageUrl: string;
}

const difficultyColors: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-green-500/20", text: "text-green-400", label: "Easy" },
  2: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Normal" },
  3: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Hard" },
  4: { bg: "bg-red-500/20", text: "text-red-400", label: "Expert" },
  5: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Nightmare" },
};

export default function WikiDungeonsPage() {
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);

  useEffect(() => {
    const mockDungeons: Dungeon[] = [
      { id: 1, name: "Crystal Caverns", type: "Crystal", difficulty: 3, level: 35, players: "1-4", duration: "15-20 min", description: "A glittering cave system filled with crystal formations and powerful guardians. The Crystal Guardian awaits at the end.", rewards: ["Crystal Shards", "Rare Equipment", "Guardian Fragments"], bosses: ["Crystal Guardian"], isUnlocked: true, imageUrl: "/images/dungeons/crystal.jpg" },
      { id: 2, name: "Volcano Summit", type: "Fire", difficulty: 4, level: 45, players: "2-6", duration: "25-30 min", description: "Scale the volcanic mountain and face the Fire Dragon in its lair. Extreme heat and dangerous terrain await.", rewards: ["Dragon Scale", "Fire Essence", "Legendary Weapons"], bosses: ["Fire Dragon", "Lava Golem"], isUnlocked: true, imageUrl: "/images/dungeons/volcano.jpg" },
      { id: 3, name: "Frozen Cavern", type: "Ice", difficulty: 2, level: 25, players: "1-4", duration: "12-18 min", description: "Navigate through icy tunnels and defeat the Ice Golem. Slippery surfaces add challenge to combat.", rewards: ["Ice Crystal", "Frozen Core", "Ice Armor Set"], bosses: ["Ice Golem"], isUnlocked: true, imageUrl: "/images/dungeons/frozen.jpg" },
      { id: 4, name: "Crypt of Shadows", type: "Dark", difficulty: 3, level: 30, players: "2-4", duration: "18-22 min", description: "Explore the ancient crypt filled with undead warriors and dark magic. Light sources are scarce.", rewards: ["Dark Crystal", "Shadow Equipment", "Necromancer's Tome"], bosses: ["Skeletal Knight", "Dark Wraith"], isUnlocked: true, imageUrl: "/images/dungeons/crypt.jpg" },
      { id: 5, name: "Storm Peak", type: "Lightning", difficulty: 4, level: 40, players: "3-5", duration: "20-25 min", description: "Ascend the storm-wracked mountain peak. Lightning strikes randomly, damaging both players and enemies.", rewards: ["Lightning Core", "Thunder Weapons", "Storm Armor Set"], bosses: ["Lightning Elemental", "Storm Lord"], isUnlocked: false, imageUrl: "/images/dungeons/storm.jpg" },
      { id: 6, name: "Elder Grove", type: "Nature", difficulty: 2, level: 20, players: "1-3", duration: "10-15 min", description: "A peaceful forest grove hiding ancient spirits. Perfect for beginners to learn dungeon mechanics.", rewards: ["Spirit Dust", "Nature Essence", "Basic Herbs"], bosses: ["Forest Spirit"], isUnlocked: true, imageUrl: "/images/dungeons/grove.jpg" },
      { id: 7, name: "Abyssal Depths", type: "Void", difficulty: 5, level: 50, players: "4-8", duration: "30-40 min", description: "Descend into the abyss where void creatures lurk. The final boss, the Void Lord, guards ancient power.", rewards: ["Void Essence", "Abyssal Equipment", "Ultimate Skills"], bosses: ["Void Spawn", "Void Wraith", "Void Lord"], isUnlocked: false, imageUrl: "/images/dungeons/abyss.jpg" },
      { id: 8, name: "Burning Fields", type: "Fire", difficulty: 1, level: 10, players: "1-2", duration: "8-12 min", description: "A volcanic wasteland perfect for new adventurers. Flame Imps and fire traps are the main threats.", rewards: ["Fire Essence", "Basic Materials", "Gold"], bosses: ["Fire Imp King"], isUnlocked: true, imageUrl: "/images/dungeons/burning.jpg" },
    ];

    setTimeout(() => {
      setDungeons(mockDungeons);
      setLoading(false);
    }, 300);
  }, []);

  const filteredDungeons = dungeons.filter((dungeon) => {
    const matchesSearch = dungeon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dungeon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 0 || dungeon.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
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
      <div className="relative bg-gradient-to-b from-purple-500/10 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
            <Castle className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium">Dungeon Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Dungeons</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explore challenging dungeons and defeat powerful bosses for rare rewards
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search dungeons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-white/50" />
              <button onClick={() => setSelectedDifficulty(0)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedDifficulty === 0 ? "bg-purple-500 text-white" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"}`}>All</button>
              {[1, 2, 3, 4, 5].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${selectedDifficulty === diff ? difficultyColors[diff].bg + " " + difficultyColors[diff].text : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"}`}
                >
                  {difficultyColors[diff].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dungeons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDungeons.map((dungeon) => (
            <div
              key={dungeon.id}
              className={`group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 cursor-pointer ${!dungeon.isUnlocked ? "opacity-60" : ""}`}
            >
              {/* Header */}
              <div className={`relative h-40 bg-gradient-to-br ${dungeon.type === "Fire" ? "from-red-500/20 to-orange-500/20" : dungeon.type === "Ice" ? "from-blue-500/20 to-cyan-500/20" : dungeon.type === "Dark" ? "from-purple-500/20 to-indigo-500/20" : "from-green-500/20 to-teal-500/20"}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Castle className="w-16 h-16 text-white/30" />
                </div>
                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 ${difficultyColors[dungeon.difficulty].bg} ${difficultyColors[dungeon.difficulty].text} rounded-full text-xs font-medium`}>
                    {difficultyColors[dungeon.difficulty].label}
                  </span>
                </div>
                {/* Lock Badge */}
                <div className="absolute top-4 right-4">
                  {dungeon.isUnlocked ? (
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center gap-1">
                      <Unlock className="w-3 h-3" /> Unlocked
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{dungeon.name}</h3>
                  <span className="text-white/50 text-sm">Lv. {dungeon.level}+</span>
                </div>

                <p className="text-white/60 text-sm mb-4 line-clamp-2">{dungeon.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Users className="w-4 h-4" />
                    <span>{dungeon.players} Players</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/50">
                    <Clock className="w-4 h-4" />
                    <span>{dungeon.duration}</span>
                  </div>
                </div>

                {/* Bosses */}
                <div className="mb-4">
                  <p className="text-white/40 text-xs mb-2">Bosses:</p>
                  <div className="flex flex-wrap gap-2">
                    {dungeon.bosses.map((boss, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-xs">
                        {boss}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs mb-2">Rewards:</p>
                  <div className="flex flex-wrap gap-2">
                    {dungeon.rewards.slice(0, 3).map((reward, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-[#ffc032]/10 text-[#ffc032] rounded text-xs">
                        {reward}
                      </span>
                    ))}
                    {dungeon.rewards.length > 3 && (
                      <span className="px-2 py-0.5 bg-white/5 text-white/50 rounded text-xs">
                        +{dungeon.rewards.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDungeons.length === 0 && (
          <div className="text-center py-20">
            <Castle className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No dungeons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
