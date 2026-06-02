"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

const QUEST_TYPES = [
  { value: "Main", label: "Main Quest" },
  { value: "Side", label: "Side Quest" },
  { value: "Daily", label: "Daily Quest" },
];

export default function CreateQuestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Main",
    reqLevel: 1,
    expReward: 0,
    goldReward: 0,
    gemReward: 0,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating quest:", formData);
    router.push("/manage-quests");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-quests")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Quest</h1>
          <p className="text-white/50 text-sm">Add a new quest to the game</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Quest Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter quest title"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Quest Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {QUEST_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Required Level <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.reqLevel}
                onChange={(e) => handleChange("reqLevel", Number(e.target.value))}
                placeholder="1"
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* EXP Reward */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                EXP Reward <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.expReward}
                onChange={(e) => handleChange("expReward", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Gold Reward */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Gold Reward <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.goldReward}
                onChange={(e) => handleChange("goldReward", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Gem Reward */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Gem Reward
              </label>
              <input
                type="number"
                value={formData.gemReward}
                onChange={(e) => handleChange("gemReward", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter quest description"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              required
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="text-sm text-white/70">
              Quest is active and can be completed
            </label>
          </div>

          {/* Actions */}
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Create Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
