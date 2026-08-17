"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, Image as ImageIcon, Loader2, Save, Sparkles, Swords } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import FormField from "@/components/form/FormField";
import FormHeader from "@/components/form/FormHeader";
import { Checkbox, SelectInput, TextArea, TextInput } from "@/components/form/FormInput";
import FormSection from "@/components/form/FormSection";
import { getSkillById, updateSkill, type UpdateSkillRequest } from "@/lib/api/skills";
import { uploadImageWithCleanup } from "@/lib/api/cloudinary";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils/swal";

// Renders the skill_types view component.
// Returns the JSX element hierarchy for the page view.
const SKILL_TYPES = ["Active", "Passive", "Buff", "Debuff"].map((value) => ({ value, label: value }));
// Renders the damage_types view component.
// Returns the JSX element hierarchy for the page view.
const DAMAGE_TYPES = ["Physical", "Magical", "TrueDamage"].map((value) => ({ value, label: value }));
// Renders the target_types view component.
// Returns the JSX element hierarchy for the page view.
const TARGET_TYPES = ["SingleTarget", "Area", "Self", "Ally"].map((value) => ({ value, label: value }));
// Renders the class_requirements view component.
// Returns the JSX element hierarchy for the page view.
const CLASS_REQUIREMENTS = ["Knight", "Archer", "Mage", "All"].map((value) => ({ value, label: value }));

const EMPTY_FORM: UpdateSkillRequest = {
  name: "",
  description: "",
  imageUrl: null,
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  type: "Active",
  // Supported damage types: Physical, Magical, or TrueDamage; the value selects how skill damage is categorized and resolved.
  damageType: "Physical",
  // Supported target types: SingleTarget, Area, Self, or Ally; the value determines who can receive the skill effect.
  targetType: "SingleTarget",
  // Supported class requirements: Knight, Archer, Mage, or All; All allows every player class to use the skill or reward.
  classRequirement: "Knight",
  cooldownSeconds: 0,
  baseDamage: 0,
  damagePerLevel: 0,
  damageGrowthPercent: 0,
  unlockLevel: 1,
  corruptionCost: 0,
  isActive: true,
};

// Renders the update skill page view component.
// Key functionality: manages local UI state, pagination, and filter values; fetches asynchronous page data on initial load and parameter changes.
// Returns the JSX element hierarchy for the page view.
export default function UpdateSkillPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const skillId = rawId ? Number(rawId) : Number.NaN;
  const validId = Number.isInteger(skillId) && skillId > 0;

  const [formData, setFormData] = useState<UpdateSkillRequest>(EMPTY_FORM);
  const [image, setImage] = useState<string | File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [fetching, setFetching] = useState(validId);
  const [saving, setSaving] = useState(false);  // Initialize boolean flag as inactive
  const [error, setError] = useState<string | null>(
    validId ? null : "A valid skill ID is required.",
  );

  // Load skill by id when the dependencies change, update image, original image url, form data, error, and fetching, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (!validId) return;

    getSkillById(skillId)
      .then((skill) => {
        setImage(skill.imageUrl);
        setOriginalImageUrl(skill.imageUrl ?? "");
        setFormData({
          name: skill.name,
          description: skill.description,
          imageUrl: skill.imageUrl,
          // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
          type: skill.type,
          // Supported damage types: Physical, Magical, or TrueDamage; the value selects how skill damage is categorized and resolved.
          damageType: skill.damageType,
          // Supported target types: SingleTarget, Area, Self, or Ally; the value determines who can receive the skill effect.
          targetType: skill.targetType,
          // Supported class requirements: Knight, Archer, Mage, or All; All allows every player class to use the skill or reward.
          classRequirement: skill.classRequirement,
          cooldownSeconds: skill.cooldownSeconds,
          baseDamage: skill.baseDamage,
          damagePerLevel: skill.damagePerLevel,
          damageGrowthPercent: skill.damageGrowthPercent,
          unlockLevel: skill.unlockLevel,
          corruptionCost: skill.corruptionCost,
          isActive: skill.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load skill data.");
      })
      .finally(() => setFetching(false));
  }, [skillId, validId]);

  // Renders the change view component.
  // Returns the JSX element hierarchy for the page view.
  const change = <K extends keyof UpdateSkillRequest>(field: K, value: UpdateSkillRequest[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  // Renders the submit view component.
  // Key functionality: displays interactive alert dialogues for user actions.
  // Returns the JSX element hierarchy for the page view.
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validId) return;

    setSaving(true);
    setError(null);
    try {
      let imageUrl = typeof image === "string" ? image || null : null;
      if (image instanceof File) {
        const result = await uploadImageWithCleanup(image, originalImageUrl);
        imageUrl = result.secureUrl;
      }

      await updateSkill(skillId, {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        imageUrl,
      });
      await showSuccessAlert("Success!", "Skill updated successfully.");  // Display styled success alert dialog to the user
      router.push("/manage-skills");  // Navigate to the next page and push to history stack
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update skill.";
      setError(message);
      await showErrorAlert("Error", message);  // Display styled error alert dialog to the user
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-4" role="status">
        <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden="true" />
        <p className="text-fg-muted">Loading skill data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Skill"
        subtitle={validId ? `Edit game skill ID #${skillId}` : "Invalid skill"}
        backHref="/manage-skills"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Skill Identity" icon={Sparkles}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField label="Skill Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(event) => change("name", event.target.value)}
              maxLength={150}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Skill Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={SKILL_TYPES}
              value={formData.type}
              onChange={(event) => change("type", event.target.value)}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Class Requirement" htmlFor="classRequirement" required>
            <SelectInput
              id="classRequirement"
              options={CLASS_REQUIREMENTS}
              value={formData.classRequirement}
              onChange={(event) => change("classRequirement", event.target.value)}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Unlock Level" htmlFor="unlockLevel" required>
            <TextInput
              id="unlockLevel"
              type="number"
              min={1}
              max={100}
              value={formData.unlockLevel}
              onChange={(event) => change("unlockLevel", Number(event.target.value))}
              required
              disabled={!validId}
            />
          </FormField>
        </div>
        <FormField label="Description" htmlFor="description" hint="Maximum 500 characters">
          <TextArea
            id="description"
            rows={4}
            maxLength={500}
            value={formData.description ?? ""}
            onChange={(event) => change("description", event.target.value)}
            disabled={!validId}
          />
        </FormField>
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(event) => change("isActive", event.target.checked)}
          label="Skill is active and available in-game"
          disabled={!validId}
        />
      </FormSection>

      <FormSection title="Skill Image" icon={ImageIcon}>
        <ImageUploader
          value={image}
          onChange={setImage}
          label="Skill Image"
        />
      </FormSection>

      <FormSection title="Combat Configuration" icon={Swords}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FormField label="Damage Type" htmlFor="damageType" required>
            <SelectInput
              id="damageType"
              options={DAMAGE_TYPES}
              value={formData.damageType}
              onChange={(event) => change("damageType", event.target.value)}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Target Type" htmlFor="targetType" required>
            <SelectInput
              id="targetType"
              options={TARGET_TYPES}
              value={formData.targetType}
              onChange={(event) => change("targetType", event.target.value)}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Cooldown" htmlFor="cooldownSeconds" hint="Seconds" required>
            <TextInput
              id="cooldownSeconds"
              type="number"
              min={0}
              value={formData.cooldownSeconds}
              onChange={(event) => change("cooldownSeconds", Number(event.target.value))}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Base Damage" htmlFor="baseDamage" required>
            <TextInput
              id="baseDamage"
              type="number"
              min={0}
              step="0.01"
              value={formData.baseDamage}
              onChange={(event) => change("baseDamage", Number(event.target.value))}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Damage Per Level" htmlFor="damagePerLevel" required>
            <TextInput
              id="damagePerLevel"
              type="number"
              min={0}
              step="0.01"
              value={formData.damagePerLevel}
              onChange={(event) => change("damagePerLevel", Number(event.target.value))}
              required
              disabled={!validId}
            />
          </FormField>
          <FormField label="Damage Growth" htmlFor="damageGrowthPercent" hint="Percent per level" required>
            <TextInput
              id="damageGrowthPercent"
              type="number"
              min={0}
              max={1000}
              step="0.01"
              value={formData.damageGrowthPercent}
              onChange={(event) => change("damageGrowthPercent", Number(event.target.value))}
              required
              disabled={!validId}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Corruption Effect"
        subtitle="Applied when this skill is used"
        icon={Activity}
      >
        <FormField label="Corruption Cost" htmlFor="corruptionCost" hint="Points">
          <TextInput
            id="corruptionCost"
            type="number"
            min={0}
            step="0.01"
            value={formData.corruptionCost}
            onChange={(event) => change("corruptionCost", Number(event.target.value))}
            disabled={!validId}
          />
        </FormField>
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-skills")}  // Navigate to the next page and push to history stack
        submitLabel="Update Skill"
        loadingLabel="Updating..."
        loading={saving}
        disabled={!validId}
        submitIcon={Save}
      />
    </form>
  );
}
