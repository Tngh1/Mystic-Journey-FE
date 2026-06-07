"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAll, ItemResponse } from "@/lib/api/item";
import { create } from "@/lib/api/shop";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const CURRENCY_TYPES = [
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
  { value: "USD", label: "USD (Real Money)" },
];

export default function CreateShopItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemId: 0,
    currency: "Gold",
    price: 0,
    stock: -1,
    isActive: true,
  });

  useEffect(() => {
    getAll()
      .then((res) => setItems(res.items))
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await create({
        itemId: formData.itemId,
        currency: formData.currency,
        price: formData.price,
        stock: formData.stock,
        isActive: formData.isActive,
      });
      router.push("/manage-shop");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create shop item");
    } finally {
      setLoading(false);
    }
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
                Select Item <span className="text-red-400">*</span>
              </label>
              {loadingItems ? (
                <div className="flex items-center gap-2 text-white/50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading items...</span>
                </div>
              ) : (
                <select
                  value={formData.itemId}
                  onChange={(e) => handleChange("itemId", Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                  required
                >
                  <option value={0} className="bg-[#1a1a1a]">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id} className="bg-[#1a1a1a]">
                      {item.name} ({item.type} - {item.rarity})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Currency Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
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
                min="-1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
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
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? "Creating..." : "Create Shop Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
