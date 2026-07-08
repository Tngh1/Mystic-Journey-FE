"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/items";
import { Package, Save, Shield, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageToCloudinary } from "@/lib/api/cloudinary";
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

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
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
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Item"
        subtitle="Add a new item to the game"
        backHref="/manage-items"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Basic Information" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Item Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter item name"
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
              placeholder="0"
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
              placeholder="1"
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
            placeholder="Enter item description (optional)"
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
        iconColor="text-blue-400"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Base HP" htmlFor="baseHp">
            <TextInput
              id="baseHp"
              type="number"
              value={formData.baseHp}
              onChange={(e) => handleChange("baseHp", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>
          <FormField label="Base Attack" htmlFor="baseAtk">
            <TextInput
              id="baseAtk"
              type="number"
              value={formData.baseAtk}
              onChange={(e) => handleChange("baseAtk", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>
          <FormField label="Base Defense" htmlFor="baseDef">
            <TextInput
              id="baseDef"
              type="number"
              value={formData.baseDef}
              onChange={(e) => handleChange("baseDef", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>

          <FormField label="Bonus HP" htmlFor="bonusHp" hint="%">
            <TextInput
              id="bonusHp"
              type="number"
              value={formData.bonusHp}
              onChange={(e) => handleChange("bonusHp", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>
          <FormField label="Bonus Attack" htmlFor="bonusAtk" hint="%">
            <TextInput
              id="bonusAtk"
              type="number"
              value={formData.bonusAtk}
              onChange={(e) => handleChange("bonusAtk", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>
          <FormField label="Bonus Defense" htmlFor="bonusDef" hint="%">
            <TextInput
              id="bonusDef"
              type="number"
              value={formData.bonusDef}
              onChange={(e) => handleChange("bonusDef", Number(e.target.value))}
              placeholder="0"
            />
          </FormField>

          <FormField label="Crit Rate" htmlFor="bonusCritRate" hint="%">
            <TextInput
              id="bonusCritRate"
              type="number"
              value={formData.bonusCritRate}
              onChange={(e) => handleChange("bonusCritRate", Number(e.target.value))}
              placeholder="0"
              step="0.1"
            />
          </FormField>
          <FormField label="Crit Damage" htmlFor="bonusCritDamage" hint="%">
            <TextInput
              id="bonusCritDamage"
              type="number"
              value={formData.bonusCritDamage}
              onChange={(e) => handleChange("bonusCritDamage", Number(e.target.value))}
              placeholder="0"
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

      <FormActions
        onCancel={() => router.push("/manage-items")}
        submitLabel="Create Item"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}