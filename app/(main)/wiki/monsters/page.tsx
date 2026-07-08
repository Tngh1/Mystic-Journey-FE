"use client";

import { useState, useEffect } from "react";
import { Ghost, Swords, Shield, Zap, Heart, Skull, X } from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";

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

const elementColors: Record<string, { bg: string; text: string; hex: string }> = {
  Fire: { bg: "bg-red-500/20", text: "text-red-400", hex: "#f87171" },
  Ice: { bg: "bg-blue-500/20", text: "text-blue-400", hex: "#60a5fa" },
  Lightning: { bg: "bg-yellow-500/20", text: "text-yellow-400", hex: "#fbbf24" },
  Dark: { bg: "bg-purple-500/20", text: "text-purple-400", hex: "#c084fc" },
  Light: { bg: "bg-amber-500/20", text: "text-amber-400", hex: "#fbbf24" },
  Normal: { bg: "bg-gray-500/20", text: "text-gray-400", hex: "#9ca3af" },
};

const monsterTypes = ["All", "Regular", "Elite", "Mini Boss", "Boss"];
const elementOptions = ["All", "Fire", "Ice", "Lightning", "Dark", "Light", "Normal"];

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t === "boss") return <Skull style={{ width: size, height: size }} />;
  if (t === "elite") return <Swords style={{ width: size, height: size }} />;
  if (t === "mini boss") return <Zap style={{ width: size, height: size }} />;
  if (t === "regular") return <Ghost style={{ width: size, height: size }} />;
  return <Ghost style={{ width: size, height: size }} />;
}

export default function WikiMonstersPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedElement, setSelectedElement] = useState("All");
  const [sort, setSort] = useState<"level" | "name" | "hp">("level");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const filtered = monsters.filter((monster) => {
    const matchesSearch = monster.name.toLowerCase().includes(search.toLowerCase()) ||
      monster.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || monster.type === selectedType;
    const matchesElement = selectedElement === "All" || monster.element === selectedElement;
    return matchesSearch && matchesType && matchesElement;
  }).sort((a, b) => {
    if (sort === "level") return b.level - a.level;
    if (sort === "hp") return b.hp - a.hp;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="pt-[88px] md:pt-[112px]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="container mx-auto flex">
        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className={`fixed lg:sticky top-[88px] md:top-[112px] z-40 w-60 h-[calc(100vh-88px)] md:shrink-0 self-start bg-[#0F0F0F] overflow-y-auto nice-scrollbar transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
          <div className="px-2 py-4 space-y-4">

            {/* Element */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Element</h3>
              <div className="space-y-0.5">
                {elementOptions.map((el) => {
                  const isActive = selectedElement === el;
                  const meta = elementColors[el];
                  return (
                    <button
                      key={el}
                      onClick={() => setSelectedElement(el)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center gap-3 transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      {el !== "All" && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta?.hex || "#9ca3af" }} />
                      )}
                      <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                        {el}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Sort By</h3>
              <div className="space-y-0.5">
                {([
                  { key: "level", label: "Level" },
                  { key: "name", label: "Name (A-Z)" },
                  { key: "hp", label: "HP" },
                ] as const).map((s) => {
                  const isActive = sort === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSort(s.key)}
                      className={[
                        "w-full h-10 px-3 rounded-[10px] flex items-center text-left transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <span className={["text-sm", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clear filters */}
            {(search || selectedType !== "All" || selectedElement !== "All") && (
              <button
                onClick={() => { setSearch(""); setSelectedType("All"); setSelectedElement("All"); }}
                className="w-full h-10 px-3 rounded-[10px] flex items-center justify-center gap-2 bg-transparent hover:bg-[#272727] text-[#AAAAAA] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Clear Filters</span>
              </button>
            )}
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Type Filter Bar - Top Right */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {monsterTypes.map((t) => {
                  const isActive = selectedType === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={[
                        "h-9 px-4 rounded-xl flex items-center gap-2 transition-colors duration-200 cursor-pointer text-sm font-medium",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-[#1a1a1a] text-white/60 hover:bg-[#252525] hover:text-white border border-white/10",
                      ].join(" ")}
                    >
                      {t !== "All" && <TypeIcon type={t} size={14} />}
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Monster Grid */}
          <div className="px-4 md:px-6 py-6">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Ghost className="w-16 h-16 text-white/15 mx-auto mb-4" />
                <p className="text-white/40 text-lg mb-3">No monsters found</p>
                <p className="text-white/25 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                {/* Active filters */}
                {(selectedType !== "All" || selectedElement !== "All" || search) && (
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-xs text-white/30">Active filters:</span>
                    {search && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        Search: {search}
                        <button onClick={() => setSearch("")} aria-label="Clear search" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedType !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs text-white/70">
                        {selectedType}
                        <button onClick={() => setSelectedType("All")} aria-label="Clear type filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {selectedElement !== "All" && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-white/8 border border-white/12 rounded-lg text-xs" style={{ color: elementColors[selectedElement]?.hex }}>
                        {selectedElement}
                        <button onClick={() => setSelectedElement("All")} aria-label="Clear element filter" className="text-white/40 hover:text-white cursor-pointer ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((monster) => (
                    <div
                      key={monster.id}
                      className={`group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300 cursor-pointer`}
                    >
                      <div className="flex gap-4 p-4">
                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-xl ${monster.type === "Boss" ? "bg-red-500/20" : monster.type === "Elite" ? "bg-orange-500/20" : "bg-white/10"} flex items-center justify-center ${elementColors[monster.element].text} group-hover:scale-105 transition-transform flex-shrink-0`}>
                          {monster.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors truncate">
                              {monster.name}
                            </h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 ${elementColors[monster.element].bg} ${elementColors[monster.element].text}`}>
                              {monster.element}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                            <span className={`px-2 py-0.5 rounded ${
                              monster.type === "Boss" ? "bg-red-500/20 text-red-400" :
                              monster.type === "Elite" ? "bg-orange-500/20 text-orange-400" :
                              monster.type === "Mini Boss" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-white/10 text-white/50"
                            }`}>
                              {monster.type}
                            </span>
                            <span>Lv. {monster.level}</span>
                            <span className="truncate">{monster.location}</span>
                          </div>

                          <p className="text-white/60 text-xs mb-3 line-clamp-2">{monster.description}</p>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1 text-xs">
                              <Heart className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-white/70">{monster.hp.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Swords className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-white/70">{monster.attack}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                              <Shield className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-white/70">{monster.defense}</span>
                            </div>
                          </div>

                          {/* Drops */}
                          <div className="mt-2 pt-2 border-t border-white/10">
                            <p className="text-white/40 text-xs mb-1.5">Drops:</p>
                            <div className="flex flex-wrap gap-1.5">
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
