"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, ItemResponse } from "@/lib/api/items";
import {
  uploadImageWithCleanup,
} from "@/lib/api/cloudinary";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

const ITEM_TYPES = [
  { value: "Weapon", label: "Weapon" },
  { value: "Armor", label: "Armor" },
  { value: "Accessory", label: "Accessory" },
  { value: "Consumable", label: "Consumable" },
  { value: "Material", label: "Material" },
  { value: "QuestItem", label: "Quest Item" },
];

const RARITIES = [
  { value: "Common", label: "Common" },
  { value: "Uncommon", label: "Uncommon" },
  { value: "Rare", label: "Rare" },
  { value: "Epic", label: "Epic" },
  { value: "Legendary", label: "Legendary" },
  { value: "Mythic", label: "Mythic" },
];

const SLOTS = [
  { value: "None", label: "None" },
  { value: "Weapon", label: "Weapon" },
  { value: "Armor", label: "Armor" },
  { value: "Helmet", label: "Helmet" },
  { value: "Gloves", label: "Gloves" },
  { value: "Boots", label: "Boots" },
  { value: "Ring", label: "Ring" },
  { value: "Necklace", label: "Necklace" },
];

export default function EditItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [originalIconUrl, setOriginalIconUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    type: "Weapon",
    rarity: "Common",
    slot: "None",
    description: "",
    baseValue: 0,
    maxStack: 1,
    iconUrl: "" as string | File | null,
  });



  useEffect(() => {
    if (!itemId) return;
    getById(Number(itemId))
      .then((item: ItemResponse) => {
        setOriginalIconUrl(item.iconUrl || "");
        setFormData({
          name: item.name,
          type: item.type,
          rarity: item.rarity,
          slot: item.slot,
          description: item.description || "",
          baseValue: item.baseValue,
          maxStack: item.maxStack,
          iconUrl: item.iconUrl || "",
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load item");
      })
      .finally(() => setFetching(false));
  }, [itemId]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) return;
    try {
      setLoading(true);
      setError(null);

      let finalIconUrl: string | undefined;
      if (formData.iconUrl instanceof File) {
        const result = await uploadImageWithCleanup(formData.iconUrl, originalIconUrl);
        finalIconUrl = result.secureUrl;
      } else if (typeof formData.iconUrl === 'string' && formData.iconUrl) {
        finalIconUrl = formData.iconUrl;
      }

      await update(Number(itemId), {
        name: formData.name,
        type: formData.type,
        rarity: formData.rarity,
        slot: formData.slot,
        description: formData.description || undefined,
        baseValue: formData.baseValue,
        maxStack: formData.maxStack,
        iconUrl: finalIconUrl,
      });
      router.push("/manage-items");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update item");
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
          onClick={() => router.push("/manage-items")}
          title="Back to manage items"
          aria-label="Back to manage items"
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Update Item</h1>
          <p className="text-white/50 text-sm">Update item details (ID: {itemId})</p>
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
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                aria-label="Item name"
                title="Item name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Type <span className="text-red-400">*</span>
              </label>
              <select
                aria-label="Item type"
                title="Item type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              >
                {ITEM_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Rarity</label>
              <select
                aria-label="Item rarity"
                title="Item rarity"
                value={formData.rarity}
                onChange={(e) => handleChange("rarity", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {RARITIES.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#1a1a1a]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Equipment Slot</label>
              <select
                aria-label="Equipment slot"
                title="Equipment slot"
                value={formData.slot}
                onChange={(e) => handleChange("slot", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {SLOTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#1a1a1a]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Base Value (Gold)</label>
              <input
                aria-label="Base value"
                title="Base value"
                type="number"
                value={formData.baseValue}
                onChange={(e) => handleChange("baseValue", Number(e.target.value))}
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Max Stack</label>
              <input
                aria-label="Max stack"
                title="Max stack"
                type="number"
                value={formData.maxStack}
                onChange={(e) => handleChange("maxStack", Number(e.target.value))}
                min="1"
                max="9999"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Description</label>
            <textarea
              aria-label="Item description"
              title="Item description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
            <ImageUploader
              value={formData.iconUrl}
              onChange={(url) => handleChange("iconUrl", url)}
              label="Item Icon"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-items")}
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
              {loading ? "Updating..." : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
