"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { create, addBannerItem } from "@/lib/api/gacha-banners";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { getAll as getAllItems } from "@/lib/api/items";
import type { ItemResponse } from "@/lib/api/items";
import { Save, Gift, Plus, Trash2, Star } from "lucide-react";
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

interface PendingItem {
  key: number;
  itemId: number;
  dropRate: number;
  isFeatured: boolean;
}

export default function CreateGachaBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const nowStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(Math.round(now.getMinutes() / 5) * 5)}`;

  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    pullCost: 100,
    pityLimit: 90,
    isActive: true,
    startAt: nowStr,
    endAt: nowStr,
  });

  // Pending items – stored locally, added to banner after creation
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addItemForm, setAddItemForm] = useState({ itemId: "", dropRate: "10", isFeatured: false });
  const [nextKey, setNextKey] = useState(0);

  const [items, setItems] = useState<ItemResponse[]>([]);

  useEffect(() => {
    getAllItems(1, 1000).then(res => setItems(res.items)).catch(console.error);
  }, []);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPendingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addItemForm.itemId || Number(addItemForm.itemId) <= 0) return;
    setPendingItems((prev) => [
      ...prev,
      {
        key: nextKey,
        itemId: Number(addItemForm.itemId),
        dropRate: Number(addItemForm.dropRate),
        isFeatured: addItemForm.isFeatured,
      },
    ]);
    setNextKey((k) => k + 1);
    setAddItemForm({ itemId: "", dropRate: "10", isFeatured: false });
    setAddItemOpen(false);
  };

  const handleUpdateDropRate = (key: number, dropRate: number) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, dropRate } : item))
    );
  };

  const handleToggleFeatured = (key: number) => {
    setPendingItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, isFeatured: !item.isFeatured } : item))
    );
  };

  const handleRemovePendingItem = (key: number) => {
    setPendingItems((prev) => prev.filter((i) => i.key !== key));
  };

  const totalDropRate = pendingItems.reduce((s, i) => s + i.dropRate, 0);
  const isDropRateValid = Math.abs(totalDropRate - 100) < 0.01 || pendingItems.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startAt || !formData.endAt) {
      setError("Start date and end date are required.");
      return;
    }
    if (pendingItems.length > 0 && !isDropRateValid) {
      setError(`Total drop rate must equal 100%. Current: ${totalDropRate.toFixed(2)}%`);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Step 1: Create the banner
      const created = await create({
        name: formData.name,
        type: formData.type,
        pullCost: formData.pullCost,
        pityLimit: formData.pityLimit,
        isActive: formData.isActive,
        startAt: new Date(formData.startAt).toISOString(),
        endAt: new Date(formData.endAt).toISOString(),
      });

      // Step 2: Add all pending items
      for (const item of pendingItems) {
        await addBannerItem(created.gachaBannerId, {
          itemId: item.itemId,
          dropRate: item.dropRate,
          isFeatured: item.isFeatured,
        });
      }

      await showSuccessAlert("Success!", "Gacha banner created successfully.");
      router.push("/manage-gacha-pools");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create gacha banner.";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Gacha Banner"
        subtitle="Configure a new gacha banner with items and drop rates"
        backHref="/manage-gacha-pools"
        badge="New"
        badgeTone="success"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      {/* ── Banner Info ── */}
      <FormSection title="Banner Configuration" icon={Gift}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Banner Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Winter Legendary Banner"
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

          <FormField label="Pull Cost" htmlFor="pullCost" hint="Gems per pull" required>
            <TextInput
              id="pullCost"
              type="number"
              value={formData.pullCost}
              onChange={(e) => handleChange("pullCost", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField label="Pity Limit" htmlFor="pityLimit" hint="Guaranteed featured item after N pulls" required>
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
          label="Banner is active and available for pulls immediately"
        />
      </FormSection>

      {/* ── Banner Items Panel ── */}
      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#ffc032]" />
            <h2 className="text-base font-bold text-white">Banner Items</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#ffc032]/10 text-[#ffc032] rounded-full border border-[#ffc032]/20">
              {pendingItems.length} items
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

        {/* Add item inline form */}
        {addItemOpen && (
          <div className="px-5 py-4 border-b border-white/10 bg-[#0d0d0d]">
            <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-wider">New Item</p>
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
                  onClick={handleAddPendingItem}
                  className="px-4 py-2 text-sm font-bold rounded-xl bg-[#ffc032] text-[#111] hover:bg-[#ffd04c] cursor-pointer transition-colors"
                >
                  Add
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
        {pendingItems.length === 0 ? (
          <div className="px-5 py-10 text-center text-white/40 text-sm">
            No items added yet. Click <span className="text-[#ffc032]">&quot;Add Item&quot;</span> to add items to this banner.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {pendingItems.map((item) => (
              <div key={item.key} className="flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors group">
                {/* Icon placeholder */}
                {items.find(i => i.itemId === item.itemId)?.iconUrl ? (
                  <img src={items.find(i => i.itemId === item.itemId)!.iconUrl!} alt="" className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-white/30" />
                  </div>
                )}

                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {items.find(i => i.itemId === item.itemId)?.name ?? `Item ID: ${item.itemId}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${RARITY_CHIP[items.find(i => i.itemId === item.itemId)?.rarity ?? "Common"] ?? RARITY_CHIP.Common}`}>
                        <Star className="w-3 h-3" />
                        {items.find(i => i.itemId === item.itemId)?.rarity ?? "Unknown"}
                    </span>
                    {item.isFeatured && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ffc032]/15 text-[#ffc032] border border-[#ffc032]/30">
                        ✦ Featured
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item.key)}
                      className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors"
                    >
                      {item.isFeatured ? "Remove featured" : "Set as featured"}
                    </button>
                  </div>
                </div>

                {/* Editable drop rate */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.01"
                    value={item.dropRate}
                    onChange={(e) => handleUpdateDropRate(item.key, Number(e.target.value))}
                    className="w-20 bg-[#0d0d0d] border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-right focus:border-[#ffc032] focus:outline-none"
                    aria-label={`Drop rate for item ${item.itemId}`}
                  />
                  <span className="text-xs text-white/40">%</span>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemovePendingItem(item.key)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Total drop rate indicator */}
        <div className="px-5 py-3 bg-[#0d0d0d] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/40">Total Drop Rate</span>
          <div className="flex items-center gap-3">
            {/* Progress bar */}
            <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isDropRateValid && pendingItems.length > 0 ? "bg-green-400" : totalDropRate > 100 ? "bg-red-400" : "bg-[#ffc032]"}`}
                style={{ width: `${Math.min(totalDropRate, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${isDropRateValid && pendingItems.length > 0 ? "text-green-400" : totalDropRate > 100 ? "text-red-400" : "text-[#ffc032]"}`}>
              {totalDropRate.toFixed(2)}%
              {isDropRateValid && pendingItems.length > 0 ? " ✓" : pendingItems.length > 0 ? " (must be 100%)" : ""}
            </span>
          </div>
        </div>
      </div>

      <FormActions
        onCancel={() => router.push("/manage-gacha-pools")}
        submitLabel={`Create Banner${pendingItems.length > 0 ? ` with ${pendingItems.length} item${pendingItems.length > 1 ? "s" : ""}` : ""}`}
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
