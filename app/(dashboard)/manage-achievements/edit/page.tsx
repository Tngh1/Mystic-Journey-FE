"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

const mockAchievement = {
  id: 1,
  name: "First Blood",
  description: "Defeat your first monster.",
  points: 10,
  rewardItem: "10 Gems",
  rewardAmount: 10,
  isActive: true,
};

export default function EditAchievementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const achievementId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    points: 10,
    rewardItem: "",
    rewardAmount: 0,
    isActive: true,
  });

  useEffect(() => {
    if (achievementId) {
      setFormData({
        name: mockAchievement.name,
        description: mockAchievement.description,
        points: mockAchievement.points,
        rewardItem: mockAchievement.rewardItem,
        rewardAmount: mockAchievement.rewardAmount,
        isActive: mockAchievement.isActive,
      });
    }
  }, [achievementId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating achievement:", formData);
    router.push("/manage-achievements");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-achievements")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Achievement</h1>
          <p className="text-white/50 text-sm">Update achievement details (ID: {achievementId})</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Achievement Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter achievement name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Points <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => handleChange("points", Number(e.target.value))}
                placeholder="10"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Item
              </label>
              <input
                type="text"
                value={formData.rewardItem}
                onChange={(e) => handleChange("rewardItem", e.target.value)}
                placeholder="e.g., 10 Gems, Golden Sword"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Reward Amount
              </label>
              <input
                type="number"
                value={formData.rewardAmount}
                onChange={(e) => handleChange("rewardAmount", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter achievement description"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="text-sm text-white/70">
              Achievement is active and can be unlocked
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-achievements")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
