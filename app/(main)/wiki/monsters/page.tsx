"use client";

import { useState, useEffect } from "react";
import { Ghost, Search, ChevronRight, Filter, Swords, Shield, Zap, Heart, Skull } from "lucide-react";

interface Monster {
  id: number;
  name: string;
  type: string;
  element: string;
  level: number;
  hp: number;
  attack: number;
  defense: number;
  description: string;
  drops: string[];
  location: string;
  icon: React.ReactNode;
}

const elementColors: Record<string, { bg: string; text: string }> = {
  Fire: { bg: "bg-red-500/20", text: "text-red-400" },
  Ice: { bg: "bg-blue-500/20", text: "text-blue-400" },
  Lightning: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Dark: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Light: { bg: "bg-amber-500/20", text: "text-amber-400" },
  Normal: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

const monsterTypes = ["All", "Regular", "Elite", "Boss", "Mini Boss"];

export default function WikiMonstersPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedElement, setSelectedElement] = useState("All");

  useEffect(() => {
    const mockMonsters: Monster[] = [
      { id: 1, name: "Fire Dragon", type: "Boss", element: "Fire", level: 50, hp: 50000, attack: 800, defense: 600, description: "The ancient ruler of volcanic mountains. Its fiery breath can incinerate entire armies.", drops: ["Dragon Scale", "Fire Essence", "Dragon Heart"], location: "Volcano Summit", icon: <Swords className="w-8 h-8" /> },
      { id: 2, name: "Ice Golem", type: "Elite", element: "Ice", level: 35, hp: 15000, attack: 400, defense: 500, description: "A massive construct of living ice. Slow but devastatingly powerful.", drops: ["Ice Crystal", "Frozen Core"], location: "Frozen Cavern", icon: <Shield className="w-8 h-8" /> },
      { id: 3, name: "Shadow Wolf", type: "Regular", element: "Dark", level: 15, hp: 2000, attack: 150, defense: 80, description: "Pack hunters that stalk the darkness. Agile and cunning.", drops: ["Shadow Fang", "Dark Essence"], location: "Dark Forest", icon: <Zap className="w-8 h-8" /> },
      { id: 4, name: "Forest Spirit", type: "Mini Boss", element: "Light", level: 25, hp: 8000, attack: 300, defense: 200, description: "Guardian of the ancient forest. Protects the sacred groves.", drops: ["Spirit Dust", "Life Crystal"], location: "Elder Grove", icon: <Heart className="w-8 h-8" /> },
      { id: 5, name: "Lightning Elemental", type: "Elite", element: "Lightning", level: 30, hp: 10000, attack: 450, defense: 150, description: "Pure energy given form. Strikes with the speed of lightning.", drops: ["Lightning Core", "Thunder Shard"], location: "Storm Peak", icon: <Zap className="w-8 h-8" /> },
      { id: 6, name: "Skeletal Knight", type: "Regular", element: "Dark", level: 20, hp: 3000, attack: 200, defense: 150, description: "Undead warrior bound to eternal service. Relentless in battle.", drops: ["Bone Fragment", "Dark Crystal"], location: "Crypt of Shadows", icon: <Skull className="w-8 h-8" /> },
      { id: 7, name: "Crystal Guardian", type: "Boss", element: "Ice", level: 60, hp: 80000, attack: 600, defense: 800, description: "Ancient protector of the Crystal Caverns. Nearly invincible.", drops: ["Crystal Shard", "Guardian Core", "Crystal Crown"], location: "Crystal Caverns", icon: <Shield className="w-8 h-8" /> },
      { id: 8, name: "Flame Imp", type: "Regular", element: "Fire", level: 10, hp: 500, attack: 80, defense: 30, description: "Small fire spirits that attack in groups. Watch out for their fireballs.", drops: ["Fire Essence"], location: "Burning Fields", icon: <Swords className="w-8 h-8" /> },
    ];

    setTimeout(() => {
      setMonsters(mockMonsters);
      setLoading(false);
    }, 300);
  }, []);

  const filteredMonsters = monsters.filter((monster) => {
    const matchesSearch = monster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monster.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || monster.type === selectedType;
    const matchesElement = selectedElement === "All" || monster.element === selectedElement;
    return matchesSearch && matchesType && matchesElement;
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
      <div className="relative bg-gradient-to-b from-red-500/10 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full mb-4">
            <Ghost className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Monster Database</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Monsters</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover all monsters, bosses, and creatures in Mystic Journey
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
                placeholder="Search monsters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-white/50" />
              {monsterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    selectedType === type
                      ? "bg-red-500 text-white"
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-white/50 text-sm mr-2">Element:</span>
            <button onClick={() => setSelectedElement("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedElement === "All" ? "bg-white/20 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>All</button>
            {Object.keys(elementColors).map((element) => (
              <button
                key={element}
                onClick={() => setSelectedElement(element)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedElement === element ? elementColors[element].bg + " " + elementColors[element].text : "bg-white/5 text-white/50 hover:bg-white/10"}`}
              >
                {element}
              </button>
            ))}
          </div>
        </div>

        {/* Monsters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMonsters.map((monster) => (
            <div
              key={monster.id}
              className={`group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300 cursor-pointer`}
            >
              <div className="flex gap-6">
                {/* Icon */}
                <div className={`w-24 h-24 rounded-2xl ${monster.type === "Boss" ? "bg-red-500/20" : monster.type === "Elite" ? "bg-orange-500/20" : "bg-white/10"} flex items-center justify-center ${elementColors[monster.element].text} group-hover:scale-105 transition-transform flex-shrink-0`}>
                  {monster.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{monster.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${elementColors[monster.element].bg} ${elementColors[monster.element].text}`}>
                      {monster.element}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/50 mb-3">
                    <span className={`px-2 py-0.5 rounded ${
                      monster.type === "Boss" ? "bg-red-500/20 text-red-400" :
                      monster.type === "Elite" ? "bg-orange-500/20 text-orange-400" :
                      monster.type === "Mini Boss" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-white/10 text-white/50"
                    }`}>
                      {monster.type}
                    </span>
                    <span>Lv. {monster.level}</span>
                    <span>{monster.location}</span>
                  </div>

                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{monster.description}</p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-white/70">{monster.hp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Swords className="w-4 h-4 text-orange-400" />
                      <span className="text-white/70">{monster.attack}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Shield className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70">{monster.defense}</span>
                    </div>
                  </div>

                  {/* Drops */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/40 text-xs mb-2">Drops:</p>
                    <div className="flex flex-wrap gap-2">
                      {monster.drops.map((drop, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/60">
                          {drop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMonsters.length === 0 && (
          <div className="text-center py-20">
            <Ghost className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No monsters found</p>
          </div>
        )}
      </div>
    </div>
  );
}
