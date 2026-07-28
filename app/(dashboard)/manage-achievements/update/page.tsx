"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, AchievementResponse } from "@/lib/api/achievements";
import { Save, Loader2, Trophy, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageWithCleanup } from "@/lib/api/cloudinary";
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

export default function EditAchievementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const achievementId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalIconUrl, setOriginalIconUrl] = useState<string>("");
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

  useEffect(() => {
    if (!achievementId) return;
    getById(Number(achievementId))
      .then((achievement: AchievementResponse) => {
        setOriginalIconUrl(achievement.iconUrl || "");
        setFormData({
          name: achievement.name,
          description: achievement.description || "",
          type: achievement.type,
          iconUrl: achievement.iconUrl || "",
          requiredValue: achievement.requiredValue,
          rewardGold: achievement.rewardGold,
          rewardGem: achievement.rewardGem,
          rewardItemId: achievement.rewardItemId,
          rewardQuantity: achievement.rewardQuantity,
          isActive: achievement.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load achievement");
      })
      .finally(() => setFetching(false));
  }, [achievementId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementId) return;
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

      await update(Number(achievementId), {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        iconUrl: finalIconUrl || null,
        requiredValue: formData.requiredValue,
        rewardGold: formData.rewardGold,
        rewardGem: formData.rewardGem,
        rewardItemId: formData.rewardItemId,
        rewardQuantity: formData.rewardQuantity,
        isActive: formData.isActive,
      });
      router.push("/manage-achievements");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update achievement");
    } finally {
      setLoading(false);
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
        title="Update Achievement"
        subtitle={`Update achievement details (ID: ${achievementId})`}
        backHref="/manage-achievements"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Achievement Details" icon={Trophy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Achievement Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
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
              min="1"
            />
          </FormField>

          <FormField label="Reward Gold" htmlFor="rewardGold">
            <TextInput
              id="rewardGold"
              type="number"
              value={formData.rewardGold}
              onChange={(e) => handleChange("rewardGold", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="Reward Gems" htmlFor="rewardGem">
            <TextInput
              id="rewardGem"
              type="number"
              value={formData.rewardGem}
              onChange={(e) => handleChange("rewardGem", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="Reward Item Quantity" htmlFor="rewardQuantity">
            <TextInput
              id="rewardQuantity"
              type="number"
              value={formData.rewardQuantity}
              onChange={(e) => handleChange("rewardQuantity", Number(e.target.value))}
              min="0"
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
          label="Achievement is active"
        />
      </FormSection>

      <FormSection title="Achievement Icon" icon={ImageIcon}>
        <ImageUploader
          value={formData.iconUrl}
          onChange={(url) => handleChange("iconUrl", url)}
          label="Achievement Icon"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-achievements")}
        submitLabel="Update Achievement"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}