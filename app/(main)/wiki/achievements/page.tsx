"use client";

import { useState, useEffect } from "react";
import { Trophy, Search, ChevronRight, Star, Lock, CheckCircle, Swords, Shield, Crown, Gem, Users } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  icon: React.ReactNode;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Combat: <Swords className="w-5 h-5" />,
  Exploration: <Shield className="w-5 h-5" />,
  Collection: <Gem className="w-5 h-5" />,
  Social: <Users className="w-5 h-5" />,
  Special: <Crown className="w-5 h-5" />,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  Combat: { bg: "bg-red-500/20", text: "text-red-400" },
  Exploration: { bg: "bg-blue-500/20", text: "text-blue-400" },
  Collection: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Social: { bg: "bg-green-500/20", text: "text-green-400" },
  Special: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  Easy: { bg: "bg-green-500/20", text: "text-green-400" },
  Normal: { bg: "bg-blue-500/20", text: "text-blue-400" },
  Hard: { bg: "bg-orange-500/20", text: "text-orange-400" },
  Expert: { bg: "bg-red-500/20", text: "text-red-400" },
  Legendary: { bg: "bg-amber-500/20", text: "text-amber-400" },
};

export default function WikiAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  useEffect(() => {
    const mockAchievements: Achievement[] = [
      { id: 1, name: "First Steps", description: "Complete your first quest", category: "Exploration", difficulty: "Easy", points: 10, progress: 1, maxProgress: 1, isUnlocked: true, unlockedAt: "2024-03-15", icon: <Star className="w-8 h-8" /> },
      { id: 2, name: "Dragon Slayer", description: "Defeat the Fire Dragon", category: "Combat", difficulty: "Expert", points: 500, progress: 0, maxProgress: 1, isUnlocked: false, icon: <Swords className="w-8 h-8" /> },
      { id: 3, name: "Collector", description: "Collect 100 different items", category: "Collection", difficulty: "Hard", points: 200, progress: 45, maxProgress: 100, isUnlocked: false, icon: <Gem className="w-8 h-8" /> },
      { id: 4, name: "Social Butterfly", description: "Add 50 friends", category: "Social", difficulty: "Normal", points: 100, progress: 30, maxProgress: 50, isUnlocked: false, icon: <Users className="w-8 h-8" /> },
      { id: 5, name: "Dungeon Master", description: "Complete all dungeons", category: "Exploration", difficulty: "Legendary", points: 1000, progress: 3, maxProgress: 8, isUnlocked: false, icon: <Shield className="w-8 h-8" /> },
      { id: 6, name: "Master Crafter", description: "Craft 50 legendary items", category: "Collection", difficulty: "Expert", points: 400, progress: 12, maxProgress: 50, isUnlocked: false, icon: <Gem className="w-8 h-8" /> },
      { id: 7, name: "PVP Champion", description: "Win 100 PVP matches", category: "Combat", difficulty: "Hard", points: 300, progress: 67, maxProgress: 100, isUnlocked: false, icon: <Swords className="w-8 h-8" /> },
      { id: 8, name: "Legendary Hero", description: "Reach max level with all classes", category: "Special", difficulty: "Legendary", points: 2000, progress: 0, maxProgress: 4, isUnlocked: false, icon: <Crown className="w-8 h-8" /> },
      { id: 9, name: "Wealthy Adventurer", description: "Accumulate 1,000,000 gold", category: "Collection", difficulty: "Normal", points: 150, progress: 750000, maxProgress: 1000000, isUnlocked: false, icon: <Gem className="w-8 h-8" /> },
      { id: 10, name: "Guild Leader", description: "Create and manage a guild", category: "Social", difficulty: "Hard", points: 250, progress: 1, maxProgress: 1, isUnlocked: true, unlockedAt: "2024-04-01", icon: <Users className="w-8 h-8" /> },
      { id: 11, name: "Completionist", description: "Unlock all other achievements", category: "Special", difficulty: "Legendary", points: 5000, progress: 3, maxProgress: 11, isUnlocked: false, icon: <Trophy className="w-8 h-8" /> },
      { id: 12, name: "First Blood", description: "Win your first PVP match", category: "Combat", difficulty: "Easy", points: 20, progress: 1, maxProgress: 1, isUnlocked: true, unlockedAt: "2024-03-16", icon: <Swords className="w-8 h-8" /> },
    ];

    setTimeout(() => {
      setAchievements(mockAchievements);
      setLoading(false);
    }, 300);
  }, []);

  const categories = ["All", ...Object.keys(categoryIcons).filter(c => c !== "All")];

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || achievement.category === selectedCategory;
    const matchesUnlocked = !showUnlockedOnly || achievement.isUnlocked;
    return matchesSearch && matchesCategory && matchesUnlocked;
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPoints = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0);

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
      <div className="relative bg-gradient-to-b from-amber-500/10 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-medium">Achievement Gallery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Achievements</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Track your accomplishments and unlock rewards
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-3xl font-bold text-white">{unlockedCount}/{achievements.length}</p>
              <p className="text-white/50 text-sm">Unlocked</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-3xl font-bold text-amber-400">{totalPoints.toLocaleString()}</p>
              <p className="text-white/50 text-sm">Total Points</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
              <p className="text-3xl font-bold text-white">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
              <p className="text-white/50 text-sm">Completion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === category
                      ? category === "All" ? "bg-[#ffc032] text-black" : `${categoryColors[category]?.bg} ${categoryColors[category]?.text}`
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {category !== "All" && <span className={selectedCategory === category ? "" : "text-white/50"}>{categoryIcons[category]}</span>}
                  {category}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                showUnlockedOnly ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              {showUnlockedOnly ? "Showing Unlocked" : "Show All"}
            </button>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group relative bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                achievement.isUnlocked
                  ? "hover:border-amber-500/30"
                  : "opacity-60 hover:opacity-80"
              }`}
            >
              {/* Lock/Unlock Badge */}
              <div className="absolute top-4 right-4">
                {achievement.isUnlocked ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-white/30" />
                )}
              </div>

              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                achievement.isUnlocked
                  ? `${categoryColors[achievement.category]?.bg} ${categoryColors[achievement.category]?.text}`
                  : "bg-white/10 text-white/30"
              }`}>
                {achievement.icon}
              </div>

              {/* Category */}
              <div className="text-center mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  achievement.isUnlocked
                    ? `${categoryColors[achievement.category]?.bg} ${categoryColors[achievement.category]?.text}`
                    : "bg-white/5 text-white/50"
                }`}>
                  {categoryIcons[achievement.category]}
                  {achievement.category}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-lg font-bold text-center mb-2 ${
                achievement.isUnlocked ? "text-white group-hover:text-amber-400 transition-colors" : "text-white/70"
              }`}>
                {achievement.name}
              </h3>

              {/* Description */}
              <p className="text-white/60 text-sm text-center mb-4">{achievement.description}</p>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-white/50">
                <span className={`px-2 py-1 rounded ${difficultyColors[achievement.difficulty]?.bg} ${difficultyColors[achievement.difficulty]?.text}`}>
                  {achievement.difficulty}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  {achievement.points} pts
                </span>
              </div>

              {/* Progress Bar */}
              {!achievement.isUnlocked && achievement.maxProgress > 1 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-[#ffc032] rounded-full transition-all"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Unlocked Date */}
              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-center text-xs text-green-400 mt-3">
                  Unlocked on {achievement.unlockedAt}
                </p>
              )}
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No achievements found</p>
          </div>
        )}
      </div>
    </div>
  );
}
