"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/monster";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageToCloudinary } from "@/lib/api/cloudinary";

const MONSTER_TYPES = [
  { value: "Normal", label: "Normal" },
  { value: "Elite", label: "Elite" },
  { value: "Boss", label: "Boss" },
];

export default function CreateMonsterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      let finalImageUrl = formData.imageUrl;
      if (finalImageUrl instanceof File) {
        const result = await uploadImageToCloudinary(finalImageUrl);
        finalImageUrl = result.secureUrl;
      }

      const imageUrl = typeof finalImageUrl === 'string' && finalImageUrl ? finalImageUrl : undefined;

      await create({
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
      setError(err instanceof Error ? err.message : "Failed to create monster");
    } finally {
      setLoading(false);
    }
  };



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
          <h1 className="text-2xl font-bold text-white">Create New Monster</h1>
          <p className="text-white/50 text-sm">Add a new monster to the game</p>
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
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter monster name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Monster Type <span className="text-red-400">*</span>
              </label>
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
                placeholder="Enter monster description"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Level <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Monster level"
                title="Monster level"
                type="number"
                value={formData.level}
                onChange={(e) => handleChange("level", Number(e.target.value))}
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Max HP <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Monster max hp"
                title="Monster max hp"
                type="number"
                value={formData.maxHp}
                onChange={(e) => handleChange("maxHp", Number(e.target.value))}
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                ATK <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Monster attack"
                title="Monster attack"
                type="number"
                value={formData.atk}
                onChange={(e) => handleChange("atk", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                DEF <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Monster defense"
                title="Monster defense"
                type="number"
                value={formData.def}
                onChange={(e) => handleChange("def", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
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

          <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
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
              {loading ? "Creating..." : "Create Monster"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
