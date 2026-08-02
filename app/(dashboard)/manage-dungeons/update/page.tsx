"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, DungeonConfigResponse } from "@/lib/api/dungeons";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { Save, Loader2, Swords } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, Checkbox } from "@/components/form/FormInput";

export default function EditDungeonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dungeonId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    levelRequirement: 1,
    maxMembers: 4,
    difficulty: 1,
    recommendedPower: 0,
    energyCost: 10,
    isActive: true,
  });

  useEffect(() => {
    if (!dungeonId) return;
    getById(Number(dungeonId))
      .then((d: DungeonConfigResponse) => {
        setFormData({
          name: d.name,
          description: d.description || "",
          levelRequirement: d.levelRequirement,
          maxMembers: d.maxMembers,
          difficulty: d.difficulty,
          recommendedPower: d.recommendedPower,
          energyCost: d.energyCost,
          isActive: d.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dungeon");
      })
      .finally(() => setFetching(false));
  }, [dungeonId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dungeonId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(dungeonId), {
        name: formData.name,
        description: formData.description || undefined,
        levelRequirement: formData.levelRequirement,
        maxMembers: formData.maxMembers,
        difficulty: formData.difficulty,
        recommendedPower: formData.recommendedPower,
        energyCost: formData.energyCost,
        isActive: formData.isActive,
      });
      await showSuccessAlert("Success!", "Dungeon updated successfully.");
      router.push("/manage-dungeons");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update dungeon";
      setError(msg);
      await showErrorAlert("Error", msg);
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
        title="Update Dungeon"
        subtitle={`Update dungeon details (ID: ${dungeonId})`}
        backHref="/manage-dungeons"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Dungeon Details" icon={Swords}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Dungeon Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </FormField>

          <FormField label="Required Level" htmlFor="levelRequirement">
            <TextInput
              id="levelRequirement"
              type="number"
              value={formData.levelRequirement}
              onChange={(e) => handleChange("levelRequirement", Number(e.target.value))}
              min="1"
              max="100"
            />
          </FormField>

          <FormField label="Max Players" htmlFor="maxMembers">
            <TextInput
              id="maxMembers"
              type="number"
              value={formData.maxMembers}
              onChange={(e) => handleChange("maxMembers", Number(e.target.value))}
              min="1"
              max="100"
            />
          </FormField>

          <FormField label="Difficulty" htmlFor="difficulty" hint="1-10">
            <TextInput
              id="difficulty"
              type="number"
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", Number(e.target.value))}
              min="1"
              max="10"
            />
          </FormField>

          <FormField label="Recommended Power" htmlFor="recommendedPower">
            <TextInput
              id="recommendedPower"
              type="number"
              value={formData.recommendedPower}
              onChange={(e) => handleChange("recommendedPower", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="Energy Cost" htmlFor="energyCost" hint="Energy spent to open the reward chest">
            <TextInput
              id="energyCost"
              type="number"
              value={formData.energyCost}
              onChange={(e) => handleChange("energyCost", Number(e.target.value))}
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
          label="Dungeon is active and can be accessed"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-dungeons")}
        submitLabel="Update Dungeon"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}