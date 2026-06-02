"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

const CURRENCY_TYPES = [
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
  { value: "USD", label: "USD (Real Money)" },
];

export default function CreateShopItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    price: 0,
    currencyType: "Gold",
    stock: -1,
    isActive: true,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating shop item:", formData);
    router.push("/manage-shop");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-shop")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Shop Item</h1>
          <p className="text-white/50 text-sm">Add a new item to the shop</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.itemName}
                onChange={(e) => handleChange("itemName", e.target.value)}
                placeholder="Enter item name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Currency Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.currencyType}
                onChange={(e) => handleChange("currencyType", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {CURRENCY_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Price <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Stock (-1 = Unlimited)
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                placeholder="-1"
                min="-1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
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
              Item is available for purchase
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-shop")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Create Shop Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
