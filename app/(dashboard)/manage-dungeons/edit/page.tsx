"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, DungeonConfigResponse } from "@/lib/api/dungeon";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function EditDungeonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dungeonId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    levelRequirement: 1,
    maxMembers: 4,
    difficulty: 1,
    recommendedPower: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!dungeonId) return;
    getById(Number(dungeonId))
      .then((d: DungeonConfigResponse) => {
        setFormData({
          name: d.name,
          description: d.description || "",
          levelRequirement: d.levelRequirement,
          maxMembers: d.maxMembers,
          difficulty: d.difficulty,
          recommendedPower: d.recommendedPower,
          isActive: d.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dungeon");
      })
      .finally(() => setFetching(false));
  }, [dungeonId]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dungeonId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(dungeonId), {
        name: formData.name,
        description: formData.description || undefined,
        levelRequirement: formData.levelRequirement,
        maxMembers: formData.maxMembers,
        difficulty: formData.difficulty,
        recommendedPower: formData.recommendedPower,
        isActive: formData.isActive,
      });
      router.push("/manage-dungeons");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update dungeon");
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
          onClick={() => router.push("/manage-dungeons")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Dungeon</h1>
          <p className="text-white/50 text-sm">Update dungeon details (ID: {dungeonId})</p>
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
                Dungeon Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Required Level
              </label>
              <input
                type="number"
                value={formData.levelRequirement}
                onChange={(e) => handleChange("levelRequirement", Number(e.target.value))}
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Max Players
              </label>
              <input
                type="number"
                value={formData.maxMembers}
                onChange={(e) => handleChange("maxMembers", Number(e.target.value))}
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Difficulty
              </label>
              <input
                type="number"
                value={formData.difficulty}
                onChange={(e) => handleChange("difficulty", Number(e.target.value))}
                min="1"
                max="10"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Recommended Power
              </label>
              <input
                type="number"
                value={formData.recommendedPower}
                onChange={(e) => handleChange("recommendedPower", Number(e.target.value))}
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
              Dungeon is active and can be accessed
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-dungeons")}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
