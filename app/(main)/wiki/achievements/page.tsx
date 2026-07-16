"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Trophy, Search, Star, Swords, Shield, Gem, Users, Zap, Lock, CheckCircle } from "lucide-react";
import { getAll } from "@/lib/api/achievements";
import type { AchievementResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

const categoryIcons: Record<string, React.ReactNode> = {
  Combat: <Swords className="w-5 h-5" />,
  Exploration: <Shield className="w-5 h-5" />,
  Collection: <Gem className="w-5 h-5" />,
  Social: <Users className="w-5 h-5" />,
  Progression: <Zap className="w-5 h-5" />,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Combat: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  Exploration: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  Collection: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  Social: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  Progression: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
};

export default function WikiAchievementsPage() {
  const [allAchievements, setAllAchievements] = useState<AchievementResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
        setAllAchievements(res.items);
      } catch {
        if (!mounted) return;
        setError("Failed to load achievements. Please try again.");
      } finally {
        if (!mounted) return;
        setInitialLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const fetchAchievements = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const res = await getAll(1, 1000);
      setAllAchievements(res.items);
    } catch {
      setError("Failed to load achievements. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const categories = ["All", ...Object.keys(categoryIcons)];

  const filtered = useMemo(() => {
    return allAchievements.filter((a) => {
      if (debouncedSearch && !a.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !(a.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false)) return false;
      if (selectedCategory !== "All" && a.type !== selectedCategory) return false;
      return true;
    });
  }, [allAchievements, debouncedSearch, selectedCategory]);

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
              <Trophy className="w-3.5 h-3.5" />
              Achievement Gallery
            </span>
            <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Achievements</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            {allAchievements.length} achievements across {categories.length - 1} categories to master.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 py-8 md:py-10">
        {/* Filters */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                const cc = categoryColors[category];
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 border ${
                      isActive
                        ? category === "All"
                          ? "bg-[#ffc032] text-[#111] border-transparent"
                          : `${cc?.bg} ${cc?.text} ${cc?.border}`
                        : "bg-[#0d0d0d] text-white/70 hover:text-white hover:bg-white/5 border-white/10"
                    }`}
                  >
                    {category !== "All" && (
                      <span className={isActive ? "" : "text-white/50"}>
                        {categoryIcons[category]}
                      </span>
                    )}
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-3">{error}</p>
            <button onClick={fetchAchievements} className="px-4 py-2 bg-[#ffc032] text-[#111] font-semibold rounded-xl text-sm hover:bg-[#ffd04c] transition-colors cursor-pointer">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No achievements found</p>
            <p className="text-white/30 text-sm mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((achievement) => {
              const colors = categoryColors[achievement.type] ?? { bg: "bg-white/10", text: "text-white/50", border: "border-white/10" };
              const icon = categoryIcons[achievement.type] ?? <Trophy className="w-5 h-5" />;
              return (
                <div
                  key={achievement.achievementId}
                  className={`group relative bg-[#111111] border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                    achievement.isActive ? "hover:border-[#ffc032]/40 hover:-translate-y-1" : "opacity-50"
                  }`}
                >
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    {achievement.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/25" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {achievement.iconUrl ? (
                      <Image
                        src={achievement.iconUrl}
                        alt={achievement.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      icon
                    )}
                  </div>

                  {/* Category */}
                  <div className="text-center mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {icon}
                      {achievement.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-center mb-2 text-white group-hover:text-[#ffc032] transition-colors">
                    {achievement.name}
                  </h3>

                  {/* Description */}
                  <p className="text-white/55 text-sm text-center mb-4">
                    {achievement.description ?? "No description."}
                  </p>

                  {/* Required value */}
                  <div className="flex items-center justify-center gap-1 text-xs text-white/40 mb-4">
                    <Star className="w-3.5 h-3.5" />
                    <span>Target: {achievement.requiredValue.toLocaleString()}</span>
                  </div>

                  {/* Rewards */}
                  <div className="flex flex-wrap justify-center gap-3 text-sm pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#ffc032]" />
                      <span className="text-white/70">{achievement.rewardGold.toLocaleString()} Gold</span>
                    </div>
                    {(achievement.rewardGem ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Gem className="w-4 h-4 text-cyan-300" />
                        <span className="text-white/70">{achievement.rewardGem} Gems</span>
                      </div>
                    )}
                    {achievement.rewardItemName && (
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-white/70 truncate max-w-[120px]">{achievement.rewardItemName}</span>
                      </div>
                    )}
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
