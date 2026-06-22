"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, MonsterResponse } from "@/lib/api/monster";
import {
  deleteImageFromCloudinary,
  extractPublicIdFromCloudinaryUrl,
  uploadImageToCloudinary,
} from "@/lib/api/cloudinary";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

const MONSTER_TYPES = [
  { value: "Normal", label: "Normal" },
  { value: "Elite", label: "Elite" },
  { value: "Boss", label: "Boss" },
];

export default function EditMonsterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monsterId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    type: "Normal",
    description: "",
    level: 1,
    maxHp: 100,
    atk: 10,
    def: 5,
    expReward: 10,
    goldReward: 5,
    imageUrl: "" as string | File | null,
  });



  useEffect(() => {
    if (!monsterId) return;
    getById(Number(monsterId))
      .then((m: MonsterResponse) => {
        setOriginalImageUrl(m.imageUrl || "");
        setFormData({
          name: m.name,
          type: m.type,
          description: m.description || "",
          level: m.level,
          maxHp: m.maxHp,
          atk: m.atk,
          def: m.def,
          expReward: m.experienceReward,
          goldReward: m.goldReward,
          imageUrl: m.imageUrl || "",
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load monster");
      })
      .finally(() => setFetching(false));
  }, [monsterId]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monsterId) return;
    try {
      setLoading(true);
      setError(null);

      let finalImageUrl = formData.imageUrl;
      if (finalImageUrl instanceof File) {
        const result = await uploadImageToCloudinary(finalImageUrl);
        finalImageUrl = result.secureUrl;
      }

      const imageUrl = typeof finalImageUrl === 'string' && finalImageUrl ? finalImageUrl : undefined;
      const originalPublicId = originalImageUrl ? extractPublicIdFromCloudinaryUrl(originalImageUrl) : null;

      if (imageUrl !== originalImageUrl && originalPublicId) {
        await deleteImageFromCloudinary(originalPublicId);
      }

      await update(Number(monsterId), {
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        level: formData.level,
        maxHp: formData.maxHp,
        atk: formData.atk,
        def: formData.def,
        experienceReward: formData.expReward,
        goldReward: formData.goldReward,
        imageUrl,
      });
      router.push("/manage-monsters");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update monster");
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
          onClick={() => router.push("/manage-monsters")}
          title="Back to manage monsters"
          aria-label="Back to manage monsters"
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Update Monster</h1>
          <p className="text-white/50 text-sm">Update monster details (ID: {monsterId})</p>
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
                Monster Name <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Monster name"
                title="Monster name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Monster Type</label>
              <select
                aria-label="Monster type"
                title="Monster type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {MONSTER_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#1a1a1a]">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-white/80">Description</label>
              <textarea
                aria-label="Monster description"
                title="Monster description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Level</label>
              <input
                aria-label="Monster level"
                title="Monster level"
                type="number"
                value={formData.level}
                onChange={(e) => handleChange("level", Number(e.target.value))}
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Max HP</label>
              <input
                aria-label="Monster max hp"
                title="Monster max hp"
                type="number"
                value={formData.maxHp}
                onChange={(e) => handleChange("maxHp", Number(e.target.value))}
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">ATK</label>
              <input
                aria-label="Monster attack"
                title="Monster attack"
                type="number"
                value={formData.atk}
                onChange={(e) => handleChange("atk", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">DEF</label>
              <input
                aria-label="Monster defense"
                title="Monster defense"
                type="number"
                value={formData.def}
                onChange={(e) => handleChange("def", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">EXP Reward</label>
              <input
                aria-label="Monster experience reward"
                title="Monster experience reward"
                type="number"
                value={formData.expReward}
                onChange={(e) => handleChange("expReward", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Gold Reward</label>
              <input
                aria-label="Monster gold reward"
                title="Monster gold reward"
                type="number"
                value={formData.goldReward}
                onChange={(e) => handleChange("goldReward", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
            <ImageUploader
              value={formData.imageUrl}
              onChange={(url) => handleChange("imageUrl", url)}
              label="Monster Image"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-monsters")}
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
              {loading ? "Updating..." : "Update Monster"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
