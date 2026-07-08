"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/achievements";
import { Save, Loader2, Trophy, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageToCloudinary } from "@/lib/api/cloudinary";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, SelectInput, Checkbox } from "@/components/form/FormInput";

const ACHIEVEMENT_TYPES = [
  { value: "Combat", label: "Combat" },
  { value: "Exploration", label: "Exploration" },
  { value: "Social", label: "Social" },
  { value: "Collection", label: "Collection" },
  { value: "Progression", label: "Progression" },
];

export default function CreateAchievementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Combat",
    iconUrl: "" as string | File | null,
    requiredValue: 1,
    rewardGold: 0,
    rewardGem: 0,
    rewardItemId: null as number | null,
    rewardQuantity: 0,
    isActive: true,
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
        description: formData.description,
        type: formData.type,
        iconUrl,
        requiredValue: formData.requiredValue,
        rewardGold: formData.rewardGold,
        rewardGem: formData.rewardGem,
        rewardItemId: formData.rewardItemId,
        rewardQuantity: formData.rewardQuantity,
        isActive: formData.isActive,
      });
      router.push("/manage-achievements");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create achievement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Achievement"
        subtitle="Add a new achievement to the game"
        backHref="/manage-achievements"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Achievement Details" icon={Trophy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Achievement Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter achievement name"
              required
            />
          </FormField>

          <FormField label="Achievement Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={ACHIEVEMENT_TYPES}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </FormField>

          <FormField label="Required Value" htmlFor="requiredValue">
            <TextInput
              id="requiredValue"
              type="number"
              value={formData.requiredValue}
              onChange={(e) => handleChange("requiredValue", Number(e.target.value))}
              placeholder="1"
              min="1"
            />
          </FormField>

          <FormField label="Reward Gold" htmlFor="rewardGold">
            <TextInput
              id="rewardGold"
              type="number"
              value={formData.rewardGold}
              onChange={(e) => handleChange("rewardGold", Number(e.target.value))}
              placeholder="0"
              min="0"
            />
          </FormField>

          <FormField label="Reward Gems" htmlFor="rewardGem">
            <TextInput
              id="rewardGem"
              type="number"
              value={formData.rewardGem}
              onChange={(e) => handleChange("rewardGem", Number(e.target.value))}
              placeholder="0"
              min="0"
            />
          </FormField>

          <FormField label="Reward Item Quantity" htmlFor="rewardQuantity">
            <TextInput
              id="rewardQuantity"
              type="number"
              value={formData.rewardQuantity}
              onChange={(e) => handleChange("rewardQuantity", Number(e.target.value))}
              placeholder="0"
              min="0"
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter achievement description"
            rows={3}
          />
        </FormField>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          label="Achievement is active"
        />
      </FormSection>

      <FormSection title="Achievement Icon" icon={ImageIcon} iconColor="text-purple-400">
        <ImageUploader
          value={formData.iconUrl}
          onChange={(url) => handleChange("iconUrl", url)}
          label="Achievement Icon"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-achievements")}
        submitLabel="Create Achievement"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}