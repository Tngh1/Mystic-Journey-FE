"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/monsters";
import { Save, Ghost, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import { uploadImageToCloudinary } from "@/lib/api/cloudinary";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, SelectInput } from "@/components/form/FormInput";

const MONSTER_TYPES = [
  { value: "Normal", label: "Normal" },
  { value: "Elite", label: "Elite" },
  { value: "Boss", label: "Boss" },
];

export default function CreateMonsterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Normal",
    description: "",
    level: 1,
    maxHp: 100,
    atk: 10,
    def: 5,
    expReward: 10,
    goldReward: 5,
    imageUrl: "" as string | File | null,
  });

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      let finalImageUrl = formData.imageUrl;
      if (finalImageUrl instanceof File) {
        const result = await uploadImageToCloudinary(finalImageUrl);
        finalImageUrl = result.secureUrl;
      }

      const imageUrl = typeof finalImageUrl === 'string' && finalImageUrl ? finalImageUrl : undefined;

      await create({
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        level: formData.level,
        maxHp: formData.maxHp,
        atk: formData.atk,
        def: formData.def,
        experienceReward: formData.expReward,
        goldReward: formData.goldReward,
        imageUrl,
      });
      router.push("/manage-monsters");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create monster");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Monster"
        subtitle="Add a new monster to the game"
        backHref="/manage-monsters"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Monster Details" icon={Ghost}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Monster Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter monster name"
              required
            />
          </FormField>

          <FormField label="Monster Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={MONSTER_TYPES}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </FormField>

          <div className="md:col-span-2">
            <FormField label="Description" htmlFor="description">
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter monster description"
                rows={3}
              />
            </FormField>
          </div>
        </div>
      </FormSection>

      <FormSection title="Stats" subtitle="Combat stats and rewards" icon={Ghost} iconColor="text-blue-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Level" htmlFor="level" required>
            <TextInput
              id="level"
              type="number"
              value={formData.level}
              onChange={(e) => handleChange("level", Number(e.target.value))}
              min="1"
              max="100"
              required
            />
          </FormField>
          <FormField label="Max HP" htmlFor="maxHp" required>
            <TextInput
              id="maxHp"
              type="number"
              value={formData.maxHp}
              onChange={(e) => handleChange("maxHp", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>
          <FormField label="ATK" htmlFor="atk" required>
            <TextInput
              id="atk"
              type="number"
              value={formData.atk}
              onChange={(e) => handleChange("atk", Number(e.target.value))}
              min="0"
              required
            />
          </FormField>
          <FormField label="DEF" htmlFor="def" required>
            <TextInput
              id="def"
              type="number"
              value={formData.def}
              onChange={(e) => handleChange("def", Number(e.target.value))}
              min="0"
              required
            />
          </FormField>
          <FormField label="EXP Reward" htmlFor="expReward">
            <TextInput
              id="expReward"
              type="number"
              value={formData.expReward}
              onChange={(e) => handleChange("expReward", Number(e.target.value))}
              min="0"
            />
          </FormField>
          <FormField label="Gold Reward" htmlFor="goldReward">
            <TextInput
              id="goldReward"
              type="number"
              value={formData.goldReward}
              onChange={(e) => handleChange("goldReward", Number(e.target.value))}
              min="0"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Monster Image" icon={ImageIcon} iconColor="text-purple-400">
        <ImageUploader
          value={formData.imageUrl}
          onChange={(url) => handleChange("imageUrl", url)}
          label="Monster Image"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-monsters")}
        submitLabel="Create Monster"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}