"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, addBannerItem, removeBannerItem } from "@/lib/api/gacha-banners";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/lib/utils/swal";
import type { GachaBannerDetailResponse, GachaBannerItemResponse } from "@/lib/api/gacha-banners";
import { getAll as getAllItems } from "@/lib/api/items";
import type { ItemResponse } from "@/lib/api/items";
import { Save, Loader2, Gift, Plus, Trash2, Star } from "lucide-react";
import DateTimePicker from "@/components/ui/DateTimePicker";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, SelectInput, Checkbox } from "@/components/form/FormInput";

const BANNER_TYPES = [
  { value: "Standard", label: "Standard" },
  { value: "Event", label: "Event" },
  { value: "Limited", label: "Limited" },
];

const RARITY_CHIP: Record<string, string> = {
  Legendary: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Epic: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Rare: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Uncommon: "bg-green-500/15 text-green-400 border-green-500/30",
  Common: "bg-white/10 text-white/60 border-white/20",
};

export default function EditGachaBannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerItems, setBannerItems] = useState<GachaBannerItemResponse[]>([]);

  // Add item form
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addItemForm, setAddItemForm] = useState({ itemId: "", dropRate: "10", isFeatured: false });
  const [addItemLoading, setAddItemLoading] = useState(false);
  const [addItemError, setAddItemError] = useState<string | null>(null);

  const [items, setItems] = useState<ItemResponse[]>([]);

  useEffect(() => {
    getAllItems(1, 1000).then(res => setItems(res.items)).catch(console.error);
  }, []);

  // BR-053 / BR-136: pull chỉ nhận ticket item.
  // Loại Currency (Gold / Gem / Exp) khỏi danh sách để admin không cấu hình
  // banner trừ tiền thay vì trừ ticket. BE cũng chặn lại lần nữa.
  const ticketItems = items.filter(
    (i) => i.isActive && i.type?.toLowerCase() !== "currency"
  );

  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    pullCost: 100,
    costItemId: "",
    pityLimit: 100,
    isActive: true,
    startAt: "",
    endAt: "",
  });

  const loadBanner = useCallback(() => {
    if (!bannerId) return;
    setFetching(true);
    getById(Number(bannerId))
      .then((banner: GachaBannerDetailResponse) => {
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          return dateStr;
        };
        setFormData({
          name: banner.name,
          type: banner.type,
          pullCost: banner.pullCost,
          costItemId: banner.costItemId != null ? String(banner.costItemId) : "",
          pityLimit: banner.pityLimit,
          isActive: banner.isActive,
          startAt: formatDate(banner.startAt),
          endAt: formatDate(banner.endAt),
        });
        setBannerItems(banner.bannerItems ?? []);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load gacha banner");
      })
      .finally(() => setFetching(false));
  }, [bannerId]);

  useEffect(() => { loadBanner(); }, [loadBanner]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerId) return;
    // BR-053 / BR-136: banner có phí pull buộc phải có ticket item.
    if (formData.pullCost > 0 && !formData.costItemId) {
      setError("Please select a ticket item. A gacha pull cannot be paid with Gold, Gem or Energy.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await update(Number(bannerId), {
        name: formData.name,
        type: formData.type,
        pullCost: formData.pullCost,
        costItemId: formData.costItemId ? Number(formData.costItemId) : null,
        pityLimit: formData.pityLimit,
        isActive: formData.isActive,
        startAt: formData.startAt,
        endAt: formData.endAt,
      });
      await showSuccessAlert("Success!", "Gacha banner updated successfully.");
      router.push("/manage-gacha-pools");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update gacha banner";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerId) return;
    try {
      setAddItemLoading(true);
      setAddItemError(null);
      const newItem = await addBannerItem(Number(bannerId), {
        itemId: Number(addItemForm.itemId),
        dropRate: Number(addItemForm.dropRate),
        isFeatured: addItemForm.isFeatured,
      });
      const matched = items.find((i) => i.itemId === newItem.itemId);
      const enrichedItem: GachaBannerItemResponse = {
        ...newItem,
        itemName: newItem.itemName ?? matched?.name ?? null,
        itemIconUrl: newItem.itemIconUrl ?? matched?.iconUrl ?? null,
        itemRarity: newItem.itemRarity ?? matched?.rarity ?? null,
      };
      setBannerItems((prev) => [...prev, enrichedItem]);
      setAddItemForm({ itemId: "", dropRate: "10", isFeatured: false });
      setAddItemOpen(false);
      await showSuccessAlert("Success!", "Item added to banner successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add item";
      setAddItemError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setAddItemLoading(false);
    }
  };

  const handleRemoveItem = async (bannerItemId: number) => {
    if (!bannerId) return;
    const confirm = await showConfirmAlert(
      "Remove Item",
      "Are you sure you want to remove this item from the banner?",
      "Remove",
      "Cancel"
    );
    if (!confirm) return;
    try {
      await removeBannerItem(Number(bannerId), bannerItemId);
      setBannerItems((prev) => prev.filter((i) => i.gachaBannerItemId !== bannerItemId));
      await showSuccessAlert("Removed!", "Item removed from banner successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove item";
      setError(msg);
      await showErrorAlert("Error", msg);
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
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Gacha Banner"
        subtitle={`Update gacha banner details (ID: ${bannerId})`}
        backHref="/manage-gacha-pools"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Banner Configuration" icon={Gift}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Banner Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter banner name"
              required
            />
          </FormField>

          <FormField label="Banner Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={BANNER_TYPES}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </FormField>

          <FormField label="Pull Cost" htmlFor="pullCost" hint="Số ticket cần cho 1 lần pull" required>
            <TextInput
              id="pullCost"
              type="number"
              value={formData.pullCost}
              onChange={(e) => handleChange("pullCost", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField
            label="Ticket Item"
            htmlFor="costItemId"
            hint="Gacha chỉ nhận ticket. Không dùng được Gold / Gem / Exp."
            required
          >
            <SelectInput
              id="costItemId"
              placeholder="Chọn ticket item..."
              options={ticketItems.map((item) => ({
                value: item.itemId,
                label: `${item.name} (${item.rarity})`,
              }))}
              value={formData.costItemId}
              onChange={(e) => handleChange("costItemId", e.target.value)}
              required
            />
          </FormField>

          <FormField label="Pity Limit" htmlFor="pityLimit" required>
            <TextInput
              id="pityLimit"
              type="number"
              value={formData.pityLimit}
              onChange={(e) => handleChange("pityLimit", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField label="Start Date" htmlFor="startAt" required>
            <DateTimePicker
              id="startAt"
              value={formData.startAt}
              onChange={(v) => handleChange("startAt", v)}
              minDate={new Date()}
            />
          </FormField>

          <FormField label="End Date" htmlFor="endAt" required>
            <DateTimePicker
              id="endAt"
              value={formData.endAt}
              onChange={(v) => handleChange("endAt", v)}
              minDate={new Date()}
            />
          </FormField>
        </div>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          label="Banner is active and available for pulls"
        />
      </FormSection>

      {/* ── Banner Items Panel ── */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#ffc032]" />
            <h2 className="text-base font-bold text-white">Banner Items</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#ffc032]/10 text-[#ffc032] rounded-full border border-[#ffc032]/20">
              {bannerItems.length} items
            </span>
          </div>
          <button
            type="button"
            onClick={() => setAddItemOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl bg-[#ffc032] text-[#111] hover:bg-[#ffd04c] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* Add item form */}
        {addItemOpen && (
          <div className="px-5 py-4 border-b border-white/10 bg-[#0d0d0d]">
            <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-wider">Add New Item</p>
            {addItemError && (
              <p className="text-red-400 text-sm mb-3">{addItemError}</p>
            )}
            <div className="flex items-end gap-4 flex-wrap">
              <div className="flex-[2] min-w-[200px]">
                <label htmlFor="addItemId" className="block text-xs text-white/60 mb-1.5">Select Item</label>
                <select
                  id="addItemId"
                  value={addItemForm.itemId}
                  onChange={(e) => setAddItemForm((p) => ({ ...p, itemId: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-[#ffc032] focus:outline-none"
                >
                  <option value="">Select an item...</option>
                  {items.map(item => (
                    <option key={item.itemId} value={item.itemId}>
                      {item.name} ({item.rarity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label htmlFor="addDropRate" className="block text-xs text-white/60 mb-1.5">Drop Rate (%)</label>
                <input
                  id="addDropRate"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={addItemForm.dropRate}
                  onChange={(e) => setAddItemForm((p) => ({ ...p, dropRate: e.target.value }))}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-[#ffc032] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <input
                  id="addFeatured"
                  type="checkbox"
                  checked={addItemForm.isFeatured}
                  onChange={(e) => setAddItemForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                  className="accent-[#ffc032]"
                />
                <label htmlFor="addFeatured" className="text-sm text-white/70 cursor-pointer">Featured (Pity)</label>
              </div>
              <div className="flex gap-2 pb-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={addItemLoading}
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-[#ffc032] text-[#111] hover:bg-[#ffd04c] disabled:opacity-60 cursor-pointer transition-colors"
                >
                  {addItemLoading ? "Adding..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setAddItemOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl border border-white/20 text-white/60 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Items list */}
        {bannerItems.length === 0 ? (
          <div className="px-5 py-10 text-center text-white/40 text-sm">
            No items in this banner yet. Click &quot;Add Item&quot; to add your first item.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {bannerItems.map((item) => {
              const matchedItem = items.find((i) => i.itemId === item.itemId);
              const name = item.itemName ?? matchedItem?.name ?? `Item #${item.itemId}`;
              const rarity = item.itemRarity ?? matchedItem?.rarity ?? "Unknown";
              const iconUrl = item.itemIconUrl ?? matchedItem?.iconUrl;
              const rarityClass = RARITY_CHIP[rarity] ?? RARITY_CHIP.Common;
              return (
                <div key={item.gachaBannerItemId} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors group">
                  {iconUrl ? (
                    <img src={iconUrl} alt={name} className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Gift className="w-5 h-5 text-white/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${rarityClass}`}>
                        <Star className="w-3 h-3" />
                        {rarity}
                      </span>
                      {item.isFeatured && (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ffc032]/15 text-[#ffc032] border border-[#ffc032]/30">
                          ✦ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">{item.dropRate}%</p>
                    <p className="text-xs text-white/40">Drop Rate</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.gachaBannerItemId)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Total drop rate indicator */}
        {bannerItems.length > 0 && (
          <div className="px-5 py-3 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/40">Total Drop Rate</span>
            <span className={`text-sm font-bold ${Math.abs(bannerItems.reduce((s, i) => s + Number(i.dropRate), 0) - 100) < 0.01 ? "text-green-400" : "text-orange-400"}`}>
              {bannerItems.reduce((s, i) => s + Number(i.dropRate), 0).toFixed(2)}%
              {Math.abs(bannerItems.reduce((s, i) => s + Number(i.dropRate), 0) - 100) < 0.01 ? " ✓" : " (should be 100%)"}
            </span>
          </div>
        )}
      </div>

      <FormActions
        onCancel={() => router.push("/manage-gacha-pools")}
        submitLabel="Update Gacha Banner"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
