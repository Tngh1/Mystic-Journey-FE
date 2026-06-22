"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, QuestResponse } from "@/lib/api/quest";
import { getAllSimple as getItems } from "@/lib/api/item";
import type { ItemResponse } from "@/lib/types";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const QUEST_TYPES = [
  { value: "Main", label: "Main" },
  { value: "Side", label: "Side" },
  { value: "Daily", label: "Daily" },
  { value: "Event", label: "Event" },
];

const DEFAULT_STATUSES = [
  { value: "NotStarted", label: "Not Started" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Claimed", label: "Claimed" },
  { value: "Failed", label: "Failed" },
];

const OBJECTIVE_TYPES = [
  { value: "Explore", label: "Explore" },
  { value: "Defeat", label: "Defeat" },
  { value: "Collect", label: "Collect" },
  { value: "Talk", label: "Talk" },
  { value: "OpenChest", label: "Open Chest" },
  { value: "Interact", label: "Interact" },
];

export default function EditQuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemOptions, setItemOptions] = useState<ItemResponse[]>([]);
  type FormData = {
    title: string;
    description: string;
    type: string;
    defaultStatus: string;
    mapName: string;
    regionName: string;
    objectiveType: string;
    objectiveTarget: string;
    objectiveLocation: string;
    questGiverName: string;
    requiredLevel: number;
    targetAmount: number;
    rewardExperience: number;
    rewardGold: number;
    rewardGems: number;
    rewardItemId: number | null;
    rewardSkillId: number | null;
    isActive: boolean;
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "Main",
    defaultStatus: "NotStarted",
    mapName: "ElfForest",
    regionName: "",
    objectiveType: "Explore",
    objectiveTarget: "",
    objectiveLocation: "",
    questGiverName: "",
    requiredLevel: 1,
    targetAmount: 1,
    rewardExperience: 0,
    rewardGold: 0,
    rewardGems: 0,
    rewardItemId: null as number | null,
    rewardSkillId: null as number | null,
    isActive: true,
  });


  useEffect(() => {
    getItems()
      .then(setItemOptions)
      .catch(() => setItemOptions([]));
  }, []);
  useEffect(() => {
    if (!questId) return;
    getById(Number(questId))
      .then((quest: QuestResponse) => {
        setFormData({
          title: quest.title,
          description: quest.description || "",
          type: quest.type,
          defaultStatus: DEFAULT_STATUSES.some(
            (status) => status.value === quest.defaultStatus,
          )
            ? quest.defaultStatus
            : "NotStarted",
          mapName: quest.mapName || "ElfForest",
          regionName: quest.regionName || "",
          objectiveType: OBJECTIVE_TYPES.some(
            (objective) => objective.value === quest.objectiveType,
          )
            ? quest.objectiveType
            : "Explore",
          objectiveTarget: quest.objectiveTarget || "",
          objectiveLocation: quest.objectiveLocation || "",
          questGiverName: quest.questGiverName || "",
          requiredLevel: quest.requiredLevel,
          targetAmount: Math.max(1, quest.targetAmount || 1),
          rewardExperience: quest.rewardExperience,
          rewardGold: quest.rewardGold,
          rewardGems: quest.rewardGems,
          rewardItemId: quest.rewardItemId,
          rewardSkillId: quest.rewardSkillId,
          isActive: quest.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load quest");
      })
      .finally(() => setFetching(false));
  }, [questId]);

  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(questId), {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        defaultStatus: formData.defaultStatus,
        mapName: formData.mapName.trim() || "ElfForest",
        regionName: formData.regionName.trim() || null,
        objectiveType: formData.objectiveType,
        objectiveTarget: formData.objectiveTarget.trim() || null,
        objectiveLocation: formData.objectiveLocation.trim() || null,
        questGiverName: formData.questGiverName.trim() || null,
        requiredLevel: formData.requiredLevel,
        targetAmount: Math.max(1, formData.targetAmount),
        rewardExperience: formData.rewardExperience,
        rewardGold: formData.rewardGold,
        rewardGems: formData.rewardGems,
        rewardItemId: formData.rewardItemId,
        rewardSkillId: formData.rewardSkillId,
        isActive: formData.isActive,
      });
      router.push("/manage-quests");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update quest");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffc032]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-quests")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Update Quest</h1>
          <p className="text-white/50 text-sm">
            Update quest details (ID: {questId})
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Quest Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Quest Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              >
                {QUEST_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="bg-[#1a1a1a]"
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Default Status
              </label>
              <select
                value={formData.defaultStatus}
                onChange={(e) => handleChange("defaultStatus", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {DEFAULT_STATUSES.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                    className="bg-[#1a1a1a]"
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Map Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.mapName}
                onChange={(e) => handleChange("mapName", e.target.value)}
                placeholder="ElfForest"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Region Name
              </label>
              <input
                type="text"
                value={formData.regionName}
                onChange={(e) => handleChange("regionName", e.target.value)}
                placeholder="Forest Entrance"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Objective Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.objectiveType}
                onChange={(e) => handleChange("objectiveType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              >
                {OBJECTIVE_TYPES.map((objective) => (
                  <option
                    key={objective.value}
                    value={objective.value}
                    className="bg-[#1a1a1a]"
                  >
                    {objective.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Objective Target
              </label>
              <input
                type="text"
                value={formData.objectiveTarget}
                onChange={(e) =>
                  handleChange("objectiveTarget", e.target.value)
                }
                placeholder="Boss name, chest key, NPC name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Objective Location
              </label>
              <input
                type="text"
                value={formData.objectiveLocation}
                onChange={(e) =>
                  handleChange("objectiveLocation", e.target.value)
                }
                placeholder="x,y or area name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Quest Giver
              </label>
              <input
                type="text"
                value={formData.questGiverName}
                onChange={(e) => handleChange("questGiverName", e.target.value)}
                placeholder="NPC display name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Required Level
              </label>
              <input
                type="number"
                value={formData.requiredLevel}
                onChange={(e) =>
                  handleChange("requiredLevel", Number(e.target.value))
                }
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Target Amount
              </label>
              <input
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  handleChange("targetAmount", Number(e.target.value))
                }
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Experience
              </label>
              <input
                type="number"
                value={formData.rewardExperience}
                onChange={(e) =>
                  handleChange("rewardExperience", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Gold
              </label>
              <input
                type="number"
                value={formData.rewardGold}
                onChange={(e) =>
                  handleChange("rewardGold", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Gems
              </label>
              <input
                type="number"
                value={formData.rewardGems}
                onChange={(e) =>
                  handleChange("rewardGems", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Item
              </label>
              <select
                value={formData.rewardItemId ?? ""}
                onChange={(e) =>
                  handleChange(
                    "rewardItemId",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                <option value="" className="bg-[#1a1a1a]">
                  No item reward
                </option>
                {itemOptions.map((item) => (
                  <option
                    key={item.itemId}
                    value={item.itemId}
                    className="bg-[#1a1a1a]"
                  >
                    {item.name} #{item.itemId}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Skill ID
              </label>
              <input
                type="number"
                value={formData.rewardSkillId ?? ""}
                onChange={(e) =>
                  handleChange(
                    "rewardSkillId",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="Optional skill id"
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm text-white/70 cursor-pointer"
            >
              Quest is active
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-quests")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? "Updating..." : "Update Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
