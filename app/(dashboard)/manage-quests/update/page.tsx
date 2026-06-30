"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, QuestResponse } from "@/lib/api/quests";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const QUEST_TYPES = [
  { value: "Main", label: "Main" },
  { value: "Side", label: "Side" },
  { value: "Daily", label: "Daily" },
  { value: "Event", label: "Event" },
];

const DEFAULT_STATUSES = [
  { value: "Available", label: "Available" },
  { value: "Locked", label: "Locked" },
];

export default function EditQuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Main",
    defaultStatus: "Available",
    requiredLevel: 1,
    rewardExperience: 0,
    rewardGold: 0,
    rewardGems: 0,
    rewardItemId: null as number | null,
    isActive: true,
  });

  useEffect(() => {
    if (!questId) return;
    getById(Number(questId))
      .then((quest: QuestResponse) => {
        setFormData({
          title: quest.title,
          description: quest.description || "",
          type: quest.type,
          defaultStatus: quest.defaultStatus,
          requiredLevel: quest.requiredLevel,
          rewardExperience: quest.rewardExperience,
          rewardGold: quest.rewardGold,
          rewardGems: quest.rewardGems,
          rewardItemId: quest.rewardItemId,
          isActive: quest.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load quest");
      })
      .finally(() => setFetching(false));
  }, [questId]);

  const handleChange = (field: string, value: unknown) => {
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
        requiredLevel: formData.requiredLevel,
        rewardExperience: formData.rewardExperience,
        rewardGold: formData.rewardGold,
        rewardGems: formData.rewardGems,
        rewardItemId: formData.rewardItemId,
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
          <p className="text-white/50 text-sm">Update quest details (ID: {questId})</p>
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
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
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
                  <option key={status.value} value={status.value} className="bg-[#1a1a1a]">
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Required Level
              </label>
              <input
                type="number"
                value={formData.requiredLevel}
                onChange={(e) => handleChange("requiredLevel", Number(e.target.value))}
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
                onChange={(e) => handleChange("rewardExperience", Number(e.target.value))}
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
                onChange={(e) => handleChange("rewardGold", Number(e.target.value))}
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
                onChange={(e) => handleChange("rewardGems", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Description</label>
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
            <label htmlFor="isActive" className="text-sm text-white/70 cursor-pointer">
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Updating..." : "Update Quest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
