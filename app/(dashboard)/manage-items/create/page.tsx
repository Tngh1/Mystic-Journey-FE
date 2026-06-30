"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/items";
import { ArrowLeft, Save, Loader2, Package, Shield, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageToCloudinary } from "@/lib/api/cloudinary";

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

export default function CreateItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Weapon",
    rarity: "Common",
    slot: "None",
    description: "",
    baseValue: 0,
    maxStack: 1,
    isActive: true,
    baseHp: 0,
    baseAtk: 0,
    baseDef: 0,
    bonusHp: 0,
    bonusAtk: 0,
    bonusDef: 0,
    bonusCritRate: 0,
    bonusCritDamage: 0,
    iconUrl: "" as string | File | null,
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      let finalIconUrl = formData.iconUrl;
      if (finalIconUrl instanceof File) {
        const result = await uploadImageToCloudinary(finalIconUrl);
        finalIconUrl = result.secureUrl;
      }

      const iconUrl = typeof finalIconUrl === 'string' && finalIconUrl ? finalIconUrl : undefined;

      await create({
        name: formData.name,
        type: formData.type,
        rarity: formData.rarity,
        slot: formData.slot,
        description: formData.description || undefined,
        baseValue: formData.baseValue,
        maxStack: formData.maxStack,
        isActive: formData.isActive,
        baseHp: formData.baseHp || undefined,
        baseAtk: formData.baseAtk || undefined,
        baseDef: formData.baseDef || undefined,
        bonusHp: formData.bonusHp || undefined,
        bonusAtk: formData.bonusAtk || undefined,
        bonusDef: formData.bonusDef || undefined,
        bonusCritRate: formData.bonusCritRate || undefined,
        bonusCritDamage: formData.bonusCritDamage || undefined,
        iconUrl,
      });
      router.push("/manage-items");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-items")}
          title="Back to manage items"
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#ffc032]">Create Item</h1>
          <p className="text-white/50 text-sm">Add a new item to the game</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Panel */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Package className="w-5 h-5 text-[#ffc032]" />
            <h2 className="text-lg font-bold text-white">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter item name"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                required
              >
                <option value="" className="bg-[#1a1a1a]">Select Item Type</option>
                {ITEM_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Rarity <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.rarity}
                onChange={(e) => handleChange("rarity", e.target.value)}
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032] transition-colors"
              >
                {RARITIES.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#1a1a1a]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Equipment Slot
              </label>
              <select
                value={formData.slot}
                onChange={(e) => handleChange("slot", e.target.value)}
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032] transition-colors"
              >
                {SLOTS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#1a1a1a]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Base Value (Gold) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.baseValue}
                onChange={(e) => handleChange("baseValue", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Max Stack <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.maxStack}
                onChange={(e) => handleChange("maxStack", Number(e.target.value))}
                placeholder="1"
                min="1"
                max="9999"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter item description (optional)"
              rows={3}
              className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-gray-700 bg-[#111] text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm text-white/70 cursor-pointer">
              Item is active and usable in-game
            </label>
          </div>
        </div>

        {/* Combat Stats Panel */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Combat Stats & Bonuses</h2>
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Base HP</label>
              <input
                type="number"
                value={formData.baseHp}
                onChange={(e) => handleChange("baseHp", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Base Attack</label>
              <input
                type="number"
                value={formData.baseAtk}
                onChange={(e) => handleChange("baseAtk", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Base Defense</label>
              <input
                type="number"
                value={formData.baseDef}
                onChange={(e) => handleChange("baseDef", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Bonus HP (%)</label>
              <input
                type="number"
                value={formData.bonusHp}
                onChange={(e) => handleChange("bonusHp", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Bonus Attack (%)</label>
              <input
                type="number"
                value={formData.bonusAtk}
                onChange={(e) => handleChange("bonusAtk", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Bonus Defense (%)</label>
              <input
                type="number"
                value={formData.bonusDef}
                onChange={(e) => handleChange("bonusDef", Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Crit Rate (%)</label>
              <input
                type="number"
                value={formData.bonusCritRate}
                onChange={(e) => handleChange("bonusCritRate", Number(e.target.value))}
                placeholder="0"
                step="0.1"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">Crit Damage (%)</label>
              <input
                type="number"
                value={formData.bonusCritDamage}
                onChange={(e) => handleChange("bonusCritDamage", Number(e.target.value))}
                placeholder="0"
                step="0.1"
                className="w-full bg-[#111] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Panel */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Item Icon</h2>
          </div>
          
          <ImageUploader
            value={formData.iconUrl}
            onChange={(url) => handleChange("iconUrl", url)}
            label="Upload Item Icon"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/manage-items")}
            className="px-6 py-2.5 text-sm font-medium text-white/70 bg-[#1a1a1a] border border-gray-800 hover:bg-[#252525] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#111] bg-[#ffc032] hover:bg-[#ffd04c] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Item"}
          </button>
        </div>
      </form>
    </div>
  );
}
