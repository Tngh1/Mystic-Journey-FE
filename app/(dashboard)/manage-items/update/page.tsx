"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, ItemResponse } from "@/lib/api/items";
import { uploadImageWithCleanup } from "@/lib/api/cloudinary";
import { Save, Loader2, Package, Shield, Image as ImageIcon, Sparkles, Coins } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, SelectInput, Checkbox } from "@/components/form/FormInput";

const ITEM_TYPES = [
  { value: "Weapon", label: "Weapon" },
  { value: "Armor", label: "Armor" },
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

const RARITY_THEMES: Record<string, string> = {
  Common: "border-slate-500 text-slate-300 bg-slate-500/10",
  Uncommon: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
  Rare: "border-sky-500 text-sky-400 bg-sky-500/10",
  Epic: "border-purple-500 text-purple-400 bg-purple-500/10",
  Legendary: "border-amber-500 text-amber-400 bg-amber-500/10",
  Mythic: "border-rose-500 text-rose-400 bg-rose-500/10",
};

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
          isActive: item.isActive ?? true,
          baseHp: item.baseHp || 0,
          baseAtk: item.baseAtk || 0,
          baseDef: item.baseDef || 0,
          bonusHp: item.bonusHp || 0,
          bonusAtk: item.bonusAtk || 0,
          bonusDef: item.bonusDef || 0,
          bonusCritRate: item.bonusCritRate || 0,
          bonusCritDamage: item.bonusCritDamage || 0,
          iconUrl: item.iconUrl || "",
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load item");
      })
      .finally(() => setFetching(false));
  }, [itemId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (type: "weapon" | "armor" | "consumable") => {
    if (type === "weapon") {
      setFormData((prev) => ({
        ...prev,
        type: "Weapon",
        slot: "Weapon",
        baseAtk: Math.max(50, prev.baseAtk || 100),
        bonusCritRate: 5,
        bonusCritDamage: 15,
      }));
    } else if (type === "armor") {
      setFormData((prev) => ({
        ...prev,
        type: "Armor",
        slot: "Armor",
        baseHp: Math.max(200, prev.baseHp || 500),
        baseDef: Math.max(30, prev.baseDef || 60),
      }));
    } else if (type === "consumable") {
      setFormData((prev) => ({
        ...prev,
        type: "Consumable",
        slot: "None",
        maxStack: 99,
        baseValue: 100,
      }));
    }
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
      } else if (typeof formData.iconUrl === "string" && formData.iconUrl) {
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
        isActive: formData.isActive,
        baseHp: formData.baseHp || undefined,
        baseAtk: formData.baseAtk || undefined,
        baseDef: formData.baseDef || undefined,
        bonusHp: formData.bonusHp || undefined,
        bonusAtk: formData.bonusAtk || undefined,
        bonusDef: formData.bonusDef || undefined,
        bonusCritRate: formData.bonusCritRate || undefined,
        bonusCritDamage: formData.bonusCritDamage || undefined,
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading item details...</p>
      </div>
    );
  }

  const previewIconUrl =
    formData.iconUrl instanceof File
      ? URL.createObjectURL(formData.iconUrl)
      : formData.iconUrl || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Item"
        subtitle={`Edit item attributes and combat stats (ID: ${itemId})`}
        backHref="/manage-items"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main Edit Form */}
        <div className="space-y-6">
          <FormSection title="Basic Information" icon={Package}>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-white/50 self-center mr-1">Quick Presets:</span>
              <button
                type="button"
                onClick={() => applyPreset("weapon")}
                className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                ⚔️ Weapon Stats
              </button>
              <button
                type="button"
                onClick={() => applyPreset("armor")}
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-300 hover:bg-blue-500/20"
              >
                🛡️ Armor Stats
              </button>
              <button
                type="button"
                onClick={() => applyPreset("consumable")}
                className="rounded-lg border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-300 hover:bg-green-500/20"
              >
                🧪 Consumable Stack
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Item Name" htmlFor="name" required>
                <TextInput
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Item Type" htmlFor="type" required>
                <SelectInput
                  id="type"
                  options={ITEM_TYPES}
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Rarity" htmlFor="rarity" required>
                <SelectInput
                  id="rarity"
                  options={RARITIES}
                  value={formData.rarity}
                  onChange={(e) => handleChange("rarity", e.target.value)}
                />
              </FormField>

              <FormField label="Equipment Slot" htmlFor="slot">
                <SelectInput
                  id="slot"
                  options={SLOTS}
                  value={formData.slot}
                  onChange={(e) => handleChange("slot", e.target.value)}
                />
              </FormField>

              <FormField label="Base Value" htmlFor="baseValue" hint="Gold" required>
                <TextInput
                  id="baseValue"
                  type="number"
                  value={formData.baseValue}
                  onChange={(e) => handleChange("baseValue", Number(e.target.value))}
                  min="0"
                  required
                />
              </FormField>

              <FormField label="Max Stack" htmlFor="maxStack" required>
                <TextInput
                  id="maxStack"
                  type="number"
                  value={formData.maxStack}
                  onChange={(e) => handleChange("maxStack", Number(e.target.value))}
                  min="1"
                  max="9999"
                  required
                />
              </FormField>
            </div>

            <FormField label="Description" htmlFor="description">
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </FormField>

            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              label="Item is active and usable in-game"
            />
          </FormSection>

          <FormSection
            title="Combat Stats & Modifiers"
            subtitle="Flat base stats and percentage bonuses"
            icon={Shield}
            iconColor="text-blue-400"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Base HP" htmlFor="baseHp">
                <TextInput
                  id="baseHp"
                  type="number"
                  value={formData.baseHp}
                  onChange={(e) => handleChange("baseHp", Number(e.target.value))}
                />
              </FormField>
              <FormField label="Base Attack" htmlFor="baseAtk">
                <TextInput
                  id="baseAtk"
                  type="number"
                  value={formData.baseAtk}
                  onChange={(e) => handleChange("baseAtk", Number(e.target.value))}
                />
              </FormField>
              <FormField label="Base Defense" htmlFor="baseDef">
                <TextInput
                  id="baseDef"
                  type="number"
                  value={formData.baseDef}
                  onChange={(e) => handleChange("baseDef", Number(e.target.value))}
                />
              </FormField>

              <FormField label="Bonus HP" htmlFor="bonusHp" hint="%">
                <TextInput
                  id="bonusHp"
                  type="number"
                  value={formData.bonusHp}
                  onChange={(e) => handleChange("bonusHp", Number(e.target.value))}
                />
              </FormField>
              <FormField label="Bonus Attack" htmlFor="bonusAtk" hint="%">
                <TextInput
                  id="bonusAtk"
                  type="number"
                  value={formData.bonusAtk}
                  onChange={(e) => handleChange("bonusAtk", Number(e.target.value))}
                />
              </FormField>
              <FormField label="Bonus Defense" htmlFor="bonusDef" hint="%">
                <TextInput
                  id="bonusDef"
                  type="number"
                  value={formData.bonusDef}
                  onChange={(e) => handleChange("bonusDef", Number(e.target.value))}
                />
              </FormField>

              <FormField label="Crit Rate" htmlFor="bonusCritRate" hint="%">
                <TextInput
                  id="bonusCritRate"
                  type="number"
                  value={formData.bonusCritRate}
                  onChange={(e) => handleChange("bonusCritRate", Number(e.target.value))}
                  step="0.1"
                />
              </FormField>
              <FormField label="Crit Damage" htmlFor="bonusCritDamage" hint="%">
                <TextInput
                  id="bonusCritDamage"
                  type="number"
                  value={formData.bonusCritDamage}
                  onChange={(e) => handleChange("bonusCritDamage", Number(e.target.value))}
                  step="0.1"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Item Icon" icon={ImageIcon} iconColor="text-purple-400">
            <ImageUploader
              value={formData.iconUrl}
              onChange={(url) => handleChange("iconUrl", url)}
              label="Upload Item Icon"
            />
          </FormSection>
        </div>

        {/* Live MMORPG Item Card Preview */}
        <aside className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#ffc032]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">In-Game Tooltip Preview</h3>
            </div>

            {/* MMORPG Card */}
            <div className={`rounded-xl border p-4 bg-[#0a0a0a] ${RARITY_THEMES[formData.rarity] || "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-black/40 ${RARITY_THEMES[formData.rarity] || "border-white/10"}`}>
                  {previewIconUrl ? (
                    <img src={previewIconUrl} alt={formData.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-7 w-7 text-white/30" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${RARITY_THEMES[formData.rarity]?.split(" ")[1] || "text-white"}`}>
                    {formData.rarity} {formData.type}
                  </span>
                  <h4 className="truncate text-base font-bold text-white">{formData.name || "Item Name"}</h4>
                  {formData.slot !== "None" && (
                    <span className="text-xs text-white/40">Slot: {formData.slot}</span>
                  )}
                </div>
              </div>

              {formData.description && (
                <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-white/60 italic">
                  &ldquo;{formData.description}&rdquo;
                </p>
              )}

              {/* Stats Breakdown */}
              <div className="mt-3 border-t border-white/5 pt-3 space-y-1.5 text-xs font-semibold">
                {formData.baseHp > 0 && <div className="text-red-400">+ {formData.baseHp} Max Health</div>}
                {formData.baseAtk > 0 && <div className="text-amber-400">+ {formData.baseAtk} Attack Damage</div>}
                {formData.baseDef > 0 && <div className="text-blue-400">+ {formData.baseDef} Armor Defense</div>}
                {formData.bonusHp > 0 && <div className="text-rose-300">+ {formData.bonusHp}% Health Bonus</div>}
                {formData.bonusAtk > 0 && <div className="text-yellow-300">+ {formData.bonusAtk}% Attack Bonus</div>}
                {formData.bonusDef > 0 && <div className="text-sky-300">+ {formData.bonusDef}% Armor Bonus</div>}
                {formData.bonusCritRate > 0 && <div className="text-purple-300">+ {formData.bonusCritRate}% Critical Rate</div>}
                {formData.bonusCritDamage > 0 && <div className="text-pink-300">+ {formData.bonusCritDamage}% Critical Damage</div>}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/40">
                <span>Stack: x{formData.maxStack}</span>
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Coins className="h-3.5 w-3.5" />
                  {formData.baseValue} Gold
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <FormActions
        onCancel={() => router.push("/manage-items")}
        submitLabel="Update Item"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}