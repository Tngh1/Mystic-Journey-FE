"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/dungeons";
import { Save, Loader2, Swords } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, Checkbox } from "@/components/form/FormInput";

export default function CreateDungeonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    levelRequirement: 1,
    maxMembers: 4,
    difficulty: 1,
    recommendedPower: 0,
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
      await create({
        name: formData.name,
        description: formData.description || '',
        levelRequirement: formData.levelRequirement,
        maxMembers: formData.maxMembers,
        difficulty: formData.difficulty,
        recommendedPower: formData.recommendedPower,
        isActive: formData.isActive,
      });
      router.push("/manage-dungeons");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create dungeon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Dungeon"
        subtitle="Add a new dungeon to the game"
        backHref="/manage-dungeons"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Dungeon Details" icon={Swords}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Dungeon Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter dungeon name"
              required
            />
          </FormField>

          <FormField label="Required Level" htmlFor="levelRequirement" required>
            <TextInput
              id="levelRequirement"
              type="number"
              value={formData.levelRequirement}
              onChange={(e) => handleChange("levelRequirement", Number(e.target.value))}
              min="1"
              max="100"
              required
            />
          </FormField>

          <FormField label="Max Players" htmlFor="maxMembers" required>
            <TextInput
              id="maxMembers"
              type="number"
              value={formData.maxMembers}
              onChange={(e) => handleChange("maxMembers", Number(e.target.value))}
              min="1"
              max="100"
              required
            />
          </FormField>

          <FormField label="Difficulty" htmlFor="difficulty" hint="1-10" required>
            <TextInput
              id="difficulty"
              type="number"
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", Number(e.target.value))}
              min="1"
              max="10"
              required
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
        </div>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter dungeon description (optional)"
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
        submitLabel="Create Dungeon"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}