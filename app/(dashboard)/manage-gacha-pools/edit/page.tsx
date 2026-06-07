"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, GachaBannerDetailResponse } from "@/lib/api/gacha";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const BANNER_TYPES = [
  { value: "Standard", label: "Standard" },
  { value: "Event", label: "Event" },
  { value: "Limited", label: "Limited" },
];

export default function EditGachaBannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    pullCost: 100,
    pityLimit: 100,
    isActive: true,
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    if (!bannerId) return;
    getById(Number(bannerId))
      .then((banner: GachaBannerDetailResponse) => {
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0];
        };
        setFormData({
          name: banner.name,
          type: banner.type,
          pullCost: banner.pullCost,
          pityLimit: banner.pityLimit,
          isActive: banner.isActive,
          startAt: formatDate(banner.startAt),
          endAt: formatDate(banner.endAt),
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load gacha banner");
      })
      .finally(() => setFetching(false));
  }, [bannerId]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(bannerId), {
        name: formData.name,
        type: formData.type,
        pullCost: formData.pullCost,
        pityLimit: formData.pityLimit,
        isActive: formData.isActive,
        startAt: formData.startAt,
        endAt: formData.endAt,
      });
      router.push("/manage-gacha-pools");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update gacha banner");
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
          onClick={() => router.push("/manage-gacha-pools")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Gacha Banner</h1>
          <p className="text-white/50 text-sm">Update gacha banner details (ID: {bannerId})</p>
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
                Banner Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter banner name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Banner Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {BANNER_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Pull Cost (Gems) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.pullCost}
                onChange={(e) => handleChange("pullCost", Number(e.target.value))}
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Pity Limit <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.pityLimit}
                onChange={(e) => handleChange("pityLimit", Number(e.target.value))}
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.startAt}
                onChange={(e) => handleChange("startAt", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                End Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.endAt}
                onChange={(e) => handleChange("endAt", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>
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
              Banner is active and available for pulls
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-gacha-pools")}
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
