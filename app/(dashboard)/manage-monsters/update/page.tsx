"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, MonsterResponse } from "@/lib/api/monsters";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { uploadImageWithCleanup } from "@/lib/api/cloudinary";
import { Save, Loader2, Skull, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
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

// Renders the edit monster page view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
export default function EditMonsterPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const searchParams = useSearchParams();
  const monsterId = searchParams.get("id");

  const [loading, setLoading] = useState(false);  // Initialize boolean flag as inactive
  const [fetching, setFetching] = useState(true);  // Initialize loading flag as active on first render
  const [error, setError] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
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

  // Load by id when the dependencies change, update original image url, form data, error, and fetching, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!monsterId) return;
    getById(Number(monsterId))
      .then((m: MonsterResponse) => {
        setOriginalImageUrl(m.imageUrl || "");
        setFormData({
          name: m.name,
          // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
          type: m.type,
          description: m.description || "",
          level: m.level,
          maxHp: m.maxHp,
          atk: m.atk,
          def: m.def,
          expReward: m.experienceReward,
          goldReward: m.goldReward,
          imageUrl: m.imageUrl || "",
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load monster");
      })
      .finally(() => setFetching(false));
  }, [monsterId]);

  // Renders the handle change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Renders the handle submit view component.
  // Key functionality: displays interactive alert dialogues for user actions.
  // Returns the JSX element hierarchy for the page view.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    if (!monsterId) return;
    try {
      setLoading(true);
      setError(null);

      let finalImageUrl: string | undefined;
      if (formData.imageUrl instanceof File) {
        const result = await uploadImageWithCleanup(formData.imageUrl, originalImageUrl);
        finalImageUrl = result.secureUrl;
      } else if (typeof formData.imageUrl === 'string' && formData.imageUrl) {
        finalImageUrl = formData.imageUrl;
      }

      await update(Number(monsterId), {
        name: formData.name,
        // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
        type: formData.type,
        description: formData.description || undefined,
        level: formData.level,
        maxHp: formData.maxHp,
        atk: formData.atk,
        def: formData.def,
        experienceReward: formData.expReward,
        goldReward: formData.goldReward,
        imageUrl: finalImageUrl,
      });
      await showSuccessAlert("Success!", "Monster updated successfully.");  // Display styled success alert dialog to the user
      router.push("/manage-monsters");  // Navigate to the next page and push to history stack
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update monster";
      setError(msg);
      await showErrorAlert("Error", msg);  // Display styled error alert dialog to the user
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
        title="Update Monster"
        subtitle={`Update monster details (ID: ${monsterId})`}
        backHref="/manage-monsters"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Monster Stats" icon={Skull}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Monster Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </FormField>

          <FormField label="Monster Type" htmlFor="type">
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
                rows={3}
              />
            </FormField>
          </div>

          <FormField label="Level" htmlFor="level">
            <TextInput
              id="level"
              type="number"
              value={formData.level}
              onChange={(e) => handleChange("level", Number(e.target.value))}
              min="1"
              max="100"
            />
          </FormField>

          <FormField label="Max HP" htmlFor="maxHp">
            <TextInput
              id="maxHp"
              type="number"
              value={formData.maxHp}
              onChange={(e) => handleChange("maxHp", Number(e.target.value))}
              min="1"
            />
          </FormField>

          <FormField label="ATK" htmlFor="atk">
            <TextInput
              id="atk"
              type="number"
              value={formData.atk}
              onChange={(e) => handleChange("atk", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="DEF" htmlFor="def">
            <TextInput
              id="def"
              type="number"
              value={formData.def}
              onChange={(e) => handleChange("def", Number(e.target.value))}
              min="0"
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

      <FormSection title="Monster Image" icon={ImageIcon}>
        <ImageUploader
          value={formData.imageUrl}
          onChange={(url) => handleChange("imageUrl", url)}
          label="Monster Image"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-monsters")}  // Navigate to the next page and push to history stack
        submitLabel="Update Monster"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
