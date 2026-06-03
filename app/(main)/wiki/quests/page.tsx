"use client";

import { useState, useEffect } from "react";
import { Scroll, Search, ChevronRight, Star, MapPin, Users, Clock, Sword, Shield, Gift, Map } from "lucide-react";

interface Quest {
  id: number;
  title: string;
  type: "main" | "side" | "daily" | "event";
  difficulty: string;
  level: number;
  description: string;
  objectives: string[];
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
  location: string;
  duration: string;
}

const questTypeColors = {
  main: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", label: "Main Story" },
  side: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", label: "Side Quest" },
  daily: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", label: "Daily" },
  event: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", label: "Event" },
};

export default function WikiQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    const mockQuests: Quest[] = [
      { id: 1, title: "The Beginning", type: "main", difficulty: "Easy", level: 1, description: "Meet the Village Elder and begin your journey in Eldoria.", objectives: ["Talk to the Village Elder", "Visit the Training Arena"], rewards: { exp: 100, gold: 50, items: ["Wooden Sword", "Starter Armor"] }, location: "Dawnhaven Village", duration: "5 min" },
      { id: 2, title: "Herb Collection", type: "main", difficulty: "Easy", level: 3, description: "Gather healing herbs from the nearby forest for the village healer.", objectives: ["Collect 5 Healing Herbs", "Return to the Healer"], rewards: { exp: 150, gold: 80, items: ["Health Potion x3"] }, location: "Forest Path", duration: "10 min" },
      { id: 3, title: "Monster Infestation", type: "main", difficulty: "Normal", level: 5, description: "Clear the goblin camp that has been threatening the village outskirts.", objectives: ["Find the Goblin Camp", "Defeat 10 Goblins", "Defeat Goblin Chief"], rewards: { exp: 500, gold: 200, items: ["Goblin Ear x10", "Iron Dagger"] }, location: "Goblin Cave", duration: "20 min" },
      { id: 4, title: "Missing Merchant", type: "side", difficulty: "Normal", level: 8, description: "Help find the missing merchant who disappeared on the trade route.", objectives: ["Search the Trade Route", "Investigate the Abandoned Cart", "Defeat the Bandits", "Return the Goods"], rewards: { exp: 400, gold: 300, items: ["Merchant's Badge"] }, location: "Trade Route", duration: "25 min" },
      { id: 5, title: "Daily Bounties", type: "daily", difficulty: "Easy", level: 5, description: "Complete daily bounties for extra rewards. Resets at midnight.", objectives: ["Defeat 5 Forest Wolves", "Collect 10 Wolf Pelts"], rewards: { exp: 200, gold: 100, items: ["Gold x50"] }, location: "Dark Forest", duration: "15 min" },
      { id: 6, title: "Dragon Hunt", type: "main", difficulty: "Hard", level: 45, description: "Join the dragon hunting expedition and face the Fire Dragon.", objectives: ["Speak to the Guild Master", "Prepare Equipment", "Travel to Volcano Summit", "Defeat Fire Dragon"], rewards: { exp: 5000, gold: 2000, items: ["Dragon Scale x5", "Legendary Weapon Choice"] }, location: "Guild Hall", duration: "45 min" },
      { id: 7, title: "Summer Festival Quest", type: "event", difficulty: "Easy", level: 10, description: "Participate in the Summer Festival activities and collect festival tokens.", objectives: ["Collect 20 Festival Tokens", "Complete 3 Mini-games", "Exchange Tokens for Rewards"], rewards: { exp: 1000, gold: 500, items: ["Summer Outfit", "Festival Title"] }, location: "Festival Grounds", duration: "30 min" },
      { id: 8, title: "Crystal Guardian", type: "main", difficulty: "Hard", level: 35, description: "Enter the Crystal Caverns and defeat the ancient Crystal Guardian.", objectives: ["Enter Crystal Caverns", "Navigate the Crystal Maze", "Defeat Crystal Guardian"], rewards: { exp: 3000, gold: 1500, items: ["Crystal Shard", "Guardian Fragment"] }, location: "Crystal Caverns", duration: "35 min" },
      { id: 9, title: "Guild Contribution", type: "daily", difficulty: "Easy", level: 15, description: "Contribute to your guild by completing daily tasks.", objectives: ["Donate 100 Gold to Guild", "Complete 1 Dungeon", "Help 1 Guild Member"], rewards: { exp: 300, gold: 100, items: ["Guild Points x50"] }, location: "Guild Hall", duration: "20 min" },
      { id: 10, title: "Ancient Ruins", type: "side", difficulty: "Expert", level: 40, description: "Explore the ancient ruins and uncover the secrets within.", objectives: ["Enter Ancient Ruins", "Solve 3 Puzzles", "Defeat the Ruins Guardian", "Claim the Treasure"], rewards: { exp: 2500, gold: 1000, items: ["Ancient Artifact", "Epic Equipment"] }, location: "Ancient Ruins", duration: "40 min" },
    ];

    setTimeout(() => {
      setQuests(mockQuests);
      setLoading(false);
    }, 300);
  }, []);

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || quest.type === selectedType;
    return matchesSearch && matchesType;
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
      <div className="relative bg-gradient-to-b from-green-500/10 to-transparent py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-4">
            <Scroll className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Quest Database</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Quests</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Browse all available quests and their rewards
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
                placeholder="Search quests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {["all", "main", "side", "daily", "event"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${
                    selectedType === type
                      ? questTypeColors[type as keyof typeof questTypeColors]?.bg + " " + questTypeColors[type as keyof typeof questTypeColors]?.text
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {type === "all" ? "All" : questTypeColors[type as keyof typeof questTypeColors]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quests List */}
        <div className="space-y-4">
          {filteredQuests.map((quest) => (
            <div
              key={quest.id}
              className={`bg-white/5 border ${questTypeColors[quest.type].border} rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Type Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl ${questTypeColors[quest.type].bg} flex items-center justify-center ${questTypeColors[quest.type].text}`}>
                    <Scroll className="w-8 h-8" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{quest.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${questTypeColors[quest.type].bg} ${questTypeColors[quest.type].text}`}>
                      {questTypeColors[quest.type].label}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">Lv. {quest.level}+</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs text-white/50">{quest.difficulty}</span>
                  </div>

                  <p className="text-white/60 text-sm mb-4">{quest.description}</p>

                  {/* Objectives */}
                  <div className="mb-4">
                    <p className="text-white/40 text-xs mb-2 flex items-center gap-1">
                      <Map className="w-3 h-3" /> Objectives:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quest.objectives.map((obj, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-white/70 flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[10px]">{idx + 1}</span>
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{quest.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{quest.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="flex-shrink-0 md:w-48">
                  <p className="text-white/40 text-xs mb-3">Rewards:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="text-sm text-white/70">{quest.rewards.exp.toLocaleString()} EXP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#ffc032]" />
                      <span className="text-sm text-white/70">{quest.rewards.gold.toLocaleString()} Gold</span>
                    </div>
                    {quest.rewards.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#ffc032]/20 flex items-center justify-center">
                          <Gift className="w-2.5 h-2.5 text-[#ffc032]" />
                        </div>
                        <span className="text-sm text-white/70 truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <div className="text-center py-20">
            <Scroll className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">No quests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
