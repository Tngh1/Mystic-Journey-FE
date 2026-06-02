"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

const ITEM_TYPES = [
  { value: "Weapon", label: "Weapon" },
  { value: "Armor", label: "Armor" },
  { value: "Accessory", label: "Accessory" },
  { value: "Consumable", label: "Consumable" },
  { value: "Material", label: "Material" },
  { value: "Quest", label: "Quest Item" },
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
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    rarity: "Common",
    slot: "None",
    description: "",
    baseValue: 0,
    maxStack: 1,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating item:", formData);
    router.push("/manage-items");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-items")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Item</h1>
          <p className="text-white/50 text-sm">Add a new item to the game</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter item name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
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

            {/* Rarity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Rarity <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.rarity}
                onChange={(e) => handleChange("rarity", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {RARITIES.map((rarity) => (
                  <option key={rarity.value} value={rarity.value} className="bg-[#1a1a1a]">
                    {rarity.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Slot */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Equipment Slot
              </label>
              <select
                value={formData.slot}
                onChange={(e) => handleChange("slot", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value} className="bg-[#1a1a1a]">
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Value */}
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Max Stack */}
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter item description (optional)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
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
              Item is active and can be used in game
            </label>
          </div>

          {/* Actions */}
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
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
