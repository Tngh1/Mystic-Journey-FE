"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/gacha-banners";
import { Save, Loader2, Gift } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, SelectInput, Checkbox } from "@/components/form/FormInput";

const BANNER_TYPES = [
  { value: "Standard", label: "Standard" },
  { value: "Event", label: "Event" },
  { value: "Limited", label: "Limited" },
];

export default function CreateGachaBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    pullCost: 100,
    pityLimit: 100,
    isActive: true,
    startAt: "",
    endAt: "",
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
        type: formData.type,
        pullCost: formData.pullCost,
        pityLimit: formData.pityLimit,
        isActive: formData.isActive,
        startAt: formData.startAt,
        endAt: formData.endAt,
      });
      router.push("/manage-gacha-pools");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create gacha banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Gacha Banner"
        subtitle="Add a new gacha banner to the system"
        backHref="/manage-gacha-pools"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Banner Configuration" icon={Gift}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Banner Name" htmlFor="name" required>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter banner name"
              required
            />
          </FormField>

          <FormField label="Banner Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={BANNER_TYPES}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </FormField>

          <FormField label="Pull Cost" htmlFor="pullCost" hint="Gems" required>
            <TextInput
              id="pullCost"
              type="number"
              value={formData.pullCost}
              onChange={(e) => handleChange("pullCost", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField label="Pity Limit" htmlFor="pityLimit" required>
            <TextInput
              id="pityLimit"
              type="number"
              value={formData.pityLimit}
              onChange={(e) => handleChange("pityLimit", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField label="Start Date" htmlFor="startAt" required>
            <TextInput
              id="startAt"
              type="date"
              value={formData.startAt}
              onChange={(e) => handleChange("startAt", e.target.value)}
              required
            />
          </FormField>

          <FormField label="End Date" htmlFor="endAt" required>
            <TextInput
              id="endAt"
              type="date"
              value={formData.endAt}
              onChange={(e) => handleChange("endAt", e.target.value)}
              required
            />
          </FormField>
        </div>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          label="Banner is active and available for pulls"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-gacha-pools")}
        submitLabel="Create Banner"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}