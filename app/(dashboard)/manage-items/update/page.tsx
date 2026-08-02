"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, ItemResponse } from "@/lib/api/items";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { uploadImageWithCleanup } from "@/lib/api/cloudinary";
import { Save, Loader2, Package, Shield, Image as ImageIcon } from "lucide-react";
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
      await showSuccessAlert("Success!", "Item updated successfully.");
      router.push("/manage-items");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update item";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading item data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Item"
        subtitle={`Edit item details (ID: ${itemId})`}
        backHref="/manage-items"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Basic Information" icon={Package}>
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
        title="Combat Stats & Bonuses"
        subtitle="Optional"
        icon={Shield}
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

      <FormSection title="Item Icon" icon={ImageIcon}>
        <ImageUploader
          value={formData.iconUrl}
          onChange={(url) => handleChange("iconUrl", url)}
          label="Upload Item Icon"
        />
      </FormSection>

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