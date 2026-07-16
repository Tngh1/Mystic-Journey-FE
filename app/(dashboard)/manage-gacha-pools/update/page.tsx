"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, GachaBannerDetailResponse } from "@/lib/api/gacha-banners";
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

export default function EditGachaBannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bannerId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    if (!bannerId) return;
    getById(Number(bannerId))
      .then((banner: GachaBannerDetailResponse) => {
        const formatDate = (dateStr: string) => {
          if (!dateStr) return "";
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0];
        };
        setFormData({
          name: banner.name,
          type: banner.type,
          pullCost: banner.pullCost,
          pityLimit: banner.pityLimit,
          isActive: banner.isActive,
          startAt: formatDate(banner.startAt),
          endAt: formatDate(banner.endAt),
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load gacha banner");
      })
      .finally(() => setFetching(false));
  }, [bannerId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(bannerId), {
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
      setError(err instanceof Error ? err.message : "Failed to update gacha banner");
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
        title="Update Gacha Banner"
        subtitle={`Update gacha banner details (ID: ${bannerId})`}
        backHref="/manage-gacha-pools"
        badge="Editing"
        badgeTone="warning"
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
        submitLabel="Update Gacha Banner"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}