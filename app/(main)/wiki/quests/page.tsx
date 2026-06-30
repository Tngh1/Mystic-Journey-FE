"use client";

import { useState, useEffect } from "react";
import { Scroll, Search, Star, MapPin, Clock, Gift, Map, Gem } from "lucide-react";
import { getAll, type QuestResponse } from "@/lib/api/quests";

type QuestType = "main" | "side" | "daily" | "event";
type QuestFilterType = "all" | QuestType;

const questTypeKeys: QuestType[] = ["main", "side", "daily", "event"];
const questFilterTypes: QuestFilterType[] = ["all", ...questTypeKeys];

interface Quest {
  id: number;
  title: string;
  type: QuestType;
  difficulty: string;
  level: number;
  description: string;
  objectives: string[];
  rewards: {
    exp: number;
    gold: number;
    gems: number;
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

function normalizeQuestType(type?: string | null): QuestType {
  const normalized = type?.trim().toLowerCase();
  return questTypeKeys.includes(normalized as QuestType) ? (normalized as QuestType) : "main";
}

function compact(values: Array<string | null | undefined>) {
  return values.filter((value): value is string => Boolean(value && value.trim()));
}

function objectiveLabel(quest: QuestResponse) {
  const type = quest.objectiveType.toLowerCase();
  const target = quest.objectiveTarget?.trim();
  const amount = Math.max(1, quest.targetAmount || 1);

  if (type === "talk") return `Talk to ${target || quest.questGiverName || "quest giver"}`;
  if (type === "collect") return `Collect ${amount} ${target || "quest item"}`;
  if (type === "defeat") return `Defeat ${amount} ${target || "enemy"}`;
  if (type === "equipskill") return `Equip ${target || "a skill"}`;
  if (type === "openchest") return `Open ${target || "a chest"}`;
  if (type === "interact") return `Interact with ${target || "the objective"}`;
  if (type === "explore") return `Explore ${target || quest.objectiveLocation || quest.regionName || quest.mapName}`;

  return target ? `${quest.objectiveType}: ${target}` : quest.objectiveType;
}

function buildObjectives(quest: QuestResponse) {
  const type = quest.objectiveType.toLowerCase();
  const location = quest.objectiveLocation?.trim();
  const giver = quest.questGiverName?.trim();
  const objectives = compact([
    location && type !== "talk" ? `Go to ${location}` : null,
    objectiveLabel(quest),
    giver && type !== "talk" ? `Report to ${giver}` : null,
  ]);

  return [...new Set(objectives)].length > 0 ? [...new Set(objectives)] : ["Complete the quest objective"];
}

function getDifficulty(quest: QuestResponse) {
  const title = quest.title.toLowerCase();
  const objectiveType = quest.objectiveType.toLowerCase();
  if (title.includes("boss") || title.includes("king") || quest.requiredLevel >= 5) return "Hard";
  if (objectiveType === "defeat" || quest.requiredLevel >= 3) return "Normal";
  return "Easy";
}

function getDuration(quest: QuestResponse) {
  const objectiveType = quest.objectiveType.toLowerCase();
  const title = quest.title.toLowerCase();
  if (normalizeQuestType(quest.type) === "daily") return "Daily";
  if (objectiveType === "defeat" && (title.includes("boss") || title.includes("king"))) return "Boss";
  if (objectiveType === "defeat") return "Combat";
  if (objectiveType === "collect") return "Explore";
  if (objectiveType === "talk") return "Story";
  return "Adventure";
}

function mapApiQuest(quest: QuestResponse): Quest {
  return {
    id: quest.questId,
    title: quest.title,
    type: normalizeQuestType(quest.type),
    difficulty: getDifficulty(quest),
    level: quest.requiredLevel,
    description: quest.description || "No quest description available.",
    objectives: buildObjectives(quest),
    rewards: {
      exp: quest.rewardExperience,
      gold: quest.rewardGold,
      gems: quest.rewardGems,
      items: compact([quest.rewardItemName, quest.rewardSkillName]),
    },
    location: quest.objectiveLocation || quest.regionName || quest.mapName,
    duration: getDuration(quest),
  };
}

function filterButtonClass(type: QuestFilterType, selectedType: QuestFilterType) {
  if (selectedType !== type) {
    return "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10";
  }

  if (type === "all") {
    return "bg-white/20 text-white";
  }

  return `${questTypeColors[type].bg} ${questTypeColors[type].text}`;
}

export default function WikiQuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<QuestFilterType>("all");

  useEffect(() => {
    let mounted = true;

    async function loadQuests() {
      try {
        const response = await getAll(1, 1000);
        if (!mounted) return;
        const apiQuests = response.items
          .filter((quest) => quest.isActive)
          .sort((a, b) => a.requiredLevel - b.requiredLevel || a.questId - b.questId)
          .map(mapApiQuest);
        setQuests(apiQuests);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load quests.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQuests();
    return () => {
      mounted = false;
    };
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-20 px-4 text-center">
        <Scroll className="w-16 h-16 text-white/20" />
        <h1 className="text-2xl font-bold text-white">Unable to load quests</h1>
        <p className="max-w-xl text-white/50">{error}</p>
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
              {questFilterTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${filterButtonClass(type, selectedType)}`}
                >
                  {type === "all" ? "All" : questTypeColors[type].label}
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
                    {quest.rewards.gems > 0 && (
                      <div className="flex items-center gap-2">
                        <Gem className="w-4 h-4 text-cyan-300" />
                        <span className="text-sm text-white/70">{quest.rewards.gems.toLocaleString()} Gems</span>
                      </div>
                    )}
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
