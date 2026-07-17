"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Castle, Search, Lock, Unlock, Zap, Shield, Users, Star } from "lucide-react";
import { getAll } from "@/lib/api/dungeons";
import type { DungeonConfigResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

const difficultyColors: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "bg-green-500/20", text: "text-green-400", label: "Easy" },
  2: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Normal" },
  3: { bg: "bg-orange-500/20", text: "text-orange-400", label: "Hard" },
  4: { bg: "bg-red-500/20", text: "text-red-400", label: "Expert" },
  5: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Nightmare" },
};

const typeColors: Record<string, { bg: string; text: string }> = {
  Fire: { bg: "bg-red-500/20", text: "text-red-400" },
  Ice: { bg: "bg-blue-500/20", text: "text-blue-400" },
  Dark: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Lightning: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Nature: { bg: "bg-green-500/20", text: "text-green-400" },
  Void: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  Normal: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

const typeGradients: Record<string, string> = {
  Fire: "from-red-500/20 to-orange-500/20",
  Ice: "from-blue-500/20 to-cyan-500/20",
  Dark: "from-purple-500/20 to-indigo-500/20",
  Lightning: "from-yellow-500/20 to-amber-500/20",
  Nature: "from-green-500/20 to-teal-500/20",
  Void: "from-indigo-500/20 to-violet-500/20",
  Normal: "from-gray-500/20 to-zinc-500/20",
};

const PAGE_SIZE = 50;

export default function WikiDungeonsPage() {
  const [allDungeons, setAllDungeons] = useState<DungeonConfigResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setInitialLoading(true);
      setError(null);
      try {
        const res = await getAll(1, 1000);
        if (!mounted) return;
        setAllDungeons(res.items);
      } catch {
        if (!mounted) return;
        setError("Failed to load dungeons. Please try again.");
      } finally {
        if (!mounted) return;
        setInitialLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const fetchDungeons = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const res = await getAll(1, 1000);
      setAllDungeons(res.items);
    } catch {
      setError("Failed to load dungeons. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const dungeonTypes = ["All", "Fire", "Ice", "Dark", "Lightning", "Nature", "Void", "Normal"];

  const filtered = useMemo(() => {
    return allDungeons.filter((d) => {
      if (debouncedSearch && !d.name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (selectedDifficulty !== 0 && d.difficulty !== selectedDifficulty) return false;
      if (selectedType !== "All" && d.type !== selectedType) return false;
      return true;
    });
  }, [allDungeons, debouncedSearch, selectedDifficulty, selectedType]);

  if (initialLoading) return <PageLoader />;

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 py-10 md:py-14">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(85%,680px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[130px]" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <Castle className="w-3.5 h-3.5" />
              Dungeon Guide
            </span>
            <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Dungeons</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            {filtered.length} dungeons across {dungeonTypes.length - 1} types
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 pb-8 md:pb-12 pt-8 md:pt-10">
        {/* Filters */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search dungeons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {dungeonTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedType === t
                        ? t === "All" ? "bg-[#ffc032] text-[#111]" : `${typeColors[t]?.bg ?? "bg-white/20"} ${typeColors[t]?.text ?? "text-white"}`
                        : "bg-[#0d0d0d] text-white/70 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => setSelectedDifficulty(0)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedDifficulty === 0 ? "bg-[#ffc032] text-[#111]" : "bg-[#0d0d0d] text-white/70 hover:bg-white/10 border border-white/10"}`}>All</button>
                {[1, 2, 3, 4, 5].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedDifficulty === diff ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text}` : "bg-[#0d0d0d] text-white/70 hover:bg-white/10 border border-white/10"}`}
                  >
                    {difficultyColors[diff].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20">
            <Castle className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-3">{error}</p>
            <button onClick={fetchDungeons} className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-xl text-sm font-semibold hover:bg-[#ffd04c] transition-colors cursor-pointer">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Castle className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No dungeons found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((dungeon) => {
              const colors = difficultyColors[dungeon.difficulty] ?? difficultyColors[1];
              const difficulty = colors.label;
              const tc = typeColors[dungeon.type] ?? typeColors.Normal;
              const gradient = typeGradients[dungeon.type] ?? typeGradients.Normal;
              return (
                <div
                  key={dungeon.dungeonConfigId}
                  className={`bg-[#111111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ffc032]/30 transition-all duration-300 ${!dungeon.isActive ? "opacity-50" : ""}`}
                >
                  {/* Image / Banner */}
                  <div className={`relative h-44 bg-linear-to-br ${gradient}`}>
                    {dungeon.imageUrl ? (
                      <Image
                        src={dungeon.imageUrl}
                        alt={dungeon.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Castle className="w-16 h-16 text-white/25" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-semibold`}>
                        {colors.label}
                      </span>
                      <span className={`px-3 py-1 ${tc.bg} ${tc.text} rounded-full text-xs font-semibold`}>
                        {dungeon.type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        dungeon.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {dungeon.isActive ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {dungeon.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white hover:text-[#ffc032] transition-colors">{dungeon.name}</h3>
                      <span className="text-white/50 text-sm shrink-0">Lv. {dungeon.levelRequirement}+</span>
                    </div>

                    <p className="text-white/55 text-sm mb-5 line-clamp-2">
                      {dungeon.description ?? "No description available."}
                    </p>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#0d0d0d] rounded-xl p-3 text-center">
                        <Users className="w-4 h-4 text-white/40 mx-auto mb-1" />
                        <p className="text-white font-semibold text-sm">{dungeon.maxMembers}</p>
                        <p className="text-white/40 text-[10px]">Players</p>
                      </div>
                      <div className="bg-[#0d0d0d] rounded-xl p-3 text-center">
                        <Zap className="w-4 h-4 text-white/40 mx-auto mb-1" />
                        <p className="text-white font-semibold text-sm">{difficulty}</p>
                        <p className="text-white/40 text-[10px]">Difficulty</p>
                      </div>
                      <div className="bg-[#0d0d0d] rounded-xl p-3 text-center">
                        <Shield className="w-4 h-4 text-white/40 mx-auto mb-1" />
                        <p className="text-white font-semibold text-sm">{dungeon.recommendedPower.toLocaleString()}</p>
                        <p className="text-white/40 text-[10px]">Power</p>
                      </div>
                    </div>

                    {/* Progress bar for difficulty */}
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-xs">Difficulty</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors.bg.replace("/20", "")} rounded-full`}
                          style={{ width: `${(dungeon.difficulty / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${colors.text}`}>{dungeon.difficulty}/5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
