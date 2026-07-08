"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, QuestResponse } from "@/lib/api/quests";
import { getAllSimple as getItems } from "@/lib/api/items";
import type { ItemResponse } from "@/lib/types";
import { Save, Loader2, BookOpen, Target, Shield, Gift } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, SelectInput, Checkbox } from "@/components/form/FormInput";

const QUEST_TYPES = [
  { value: "Main", label: "Main" },
  { value: "Side", label: "Side" },
  { value: "Daily", label: "Daily" },
  { value: "Event", label: "Event" },
];

const DEFAULT_STATUSES = [
  { value: "NotStarted", label: "Not Started" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Claimed", label: "Claimed" },
  { value: "Failed", label: "Failed" },
];

const OBJECTIVE_TYPES = [
  { value: "Explore", label: "Explore" },
  { value: "Defeat", label: "Defeat" },
  { value: "Collect", label: "Collect" },
  { value: "Talk", label: "Talk" },
  { value: "OpenChest", label: "Open Chest" },
  { value: "Interact", label: "Interact" },
];

type FormData = {
  title: string;
  description: string;
  type: string;
  defaultStatus: string;
  mapName: string;
  regionName: string;
  objectiveType: string;
  objectiveTarget: string;
  objectiveLocation: string;
  questGiverName: string;
  requiredLevel: number;
  targetAmount: number;
  rewardExperience: number;
  rewardGold: number;
  rewardGems: number;
  rewardItemId: number | null;
  rewardSkillId: number | null;
  isActive: boolean;
};

export default function EditQuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemOptions, setItemOptions] = useState<ItemResponse[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "Main",
    defaultStatus: "NotStarted",
    mapName: "ElfForest",
    regionName: "",
    objectiveType: "Explore",
    objectiveTarget: "",
    objectiveLocation: "",
    questGiverName: "",
    requiredLevel: 1,
    targetAmount: 1,
    rewardExperience: 0,
    rewardGold: 0,
    rewardGems: 0,
    rewardItemId: null,
    rewardSkillId: null,
    isActive: true,
  });

  useEffect(() => {
    getItems()
      .then(setItemOptions)
      .catch(() => setItemOptions([]));
  }, []);

  useEffect(() => {
    if (!questId) return;
    getById(Number(questId))
      .then((quest: QuestResponse) => {
        setFormData({
          title: quest.title,
          description: quest.description || "",
          type: quest.type,
          defaultStatus: DEFAULT_STATUSES.some((s) => s.value === quest.defaultStatus)
            ? quest.defaultStatus
            : "NotStarted",
          mapName: quest.mapName || "ElfForest",
          regionName: quest.regionName || "",
          objectiveType: OBJECTIVE_TYPES.some((o) => o.value === quest.objectiveType)
            ? quest.objectiveType
            : "Explore",
          objectiveTarget: quest.objectiveTarget || "",
          objectiveLocation: quest.objectiveLocation || "",
          questGiverName: quest.questGiverName || "",
          requiredLevel: quest.requiredLevel,
          targetAmount: Math.max(1, quest.targetAmount || 1),
          rewardExperience: quest.rewardExperience,
          rewardGold: quest.rewardGold,
          rewardGems: quest.rewardGems,
          rewardItemId: quest.rewardItemId,
          rewardSkillId: quest.rewardSkillId,
          isActive: quest.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load quest");
      })
      .finally(() => setFetching(false));
  }, [questId]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(questId), {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        defaultStatus: formData.defaultStatus,
        mapName: formData.mapName.trim() || "ElfForest",
        regionName: formData.regionName.trim() || null,
        objectiveType: formData.objectiveType,
        objectiveTarget: formData.objectiveTarget.trim() || null,
        objectiveLocation: formData.objectiveLocation.trim() || null,
        questGiverName: formData.questGiverName.trim() || null,
        requiredLevel: formData.requiredLevel,
        targetAmount: Math.max(1, formData.targetAmount),
        rewardExperience: formData.rewardExperience,
        rewardGold: formData.rewardGold,
        rewardGems: formData.rewardGems,
        rewardItemId: formData.rewardItemId,
        rewardSkillId: formData.rewardSkillId,
        isActive: formData.isActive,
      });
      router.push("/manage-quests");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update quest");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading quest data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Quest"
        subtitle={`Update quest details (ID: ${questId})`}
        backHref="/manage-quests"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="General Information" icon={BookOpen}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Quest Title" htmlFor="title" required>
            <TextInput
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter quest title"
              required
            />
          </FormField>

          <FormField label="Quest Type" htmlFor="type" required>
            <SelectInput
              id="type"
              options={QUEST_TYPES}
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </FormField>

          <FormField label="Default Status" htmlFor="defaultStatus">
            <SelectInput
              id="defaultStatus"
              options={DEFAULT_STATUSES}
              value={formData.defaultStatus}
              onChange={(e) => handleChange("defaultStatus", e.target.value)}
            />
          </FormField>

          <FormField label="Quest Giver" htmlFor="questGiverName">
            <TextInput
              id="questGiverName"
              value={formData.questGiverName}
              onChange={(e) => handleChange("questGiverName", e.target.value)}
              placeholder="NPC display name"
            />
          </FormField>
        </div>

        <FormField label="Description" htmlFor="description">
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter quest description"
            rows={3}
          />
        </FormField>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          label="Quest is active and playable"
        />
      </FormSection>

      <FormSection title="Objectives & Location" icon={Target} iconColor="text-red-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Objective Type" htmlFor="objectiveType" required>
            <SelectInput
              id="objectiveType"
              options={OBJECTIVE_TYPES}
              value={formData.objectiveType}
              onChange={(e) => handleChange("objectiveType", e.target.value)}
            />
          </FormField>

          <FormField label="Objective Target" htmlFor="objectiveTarget">
            <TextInput
              id="objectiveTarget"
              value={formData.objectiveTarget}
              onChange={(e) => handleChange("objectiveTarget", e.target.value)}
              placeholder="Boss name, chest key, NPC name"
            />
          </FormField>

          <FormField label="Target Amount" htmlFor="targetAmount" required>
            <TextInput
              id="targetAmount"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => handleChange("targetAmount", Number(e.target.value))}
              min="1"
              required
            />
          </FormField>

          <FormField label="Objective Location" htmlFor="objectiveLocation">
            <TextInput
              id="objectiveLocation"
              value={formData.objectiveLocation}
              onChange={(e) => handleChange("objectiveLocation", e.target.value)}
              placeholder="x,y or area name"
            />
          </FormField>

          <FormField label="Map Name" htmlFor="mapName" required>
            <TextInput
              id="mapName"
              value={formData.mapName}
              onChange={(e) => handleChange("mapName", e.target.value)}
              placeholder="ElfForest"
              required
            />
          </FormField>

          <FormField label="Region Name" htmlFor="regionName">
            <TextInput
              id="regionName"
              value={formData.regionName}
              onChange={(e) => handleChange("regionName", e.target.value)}
              placeholder="Forest Entrance"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Requirements" icon={Shield} iconColor="text-blue-400">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Required Level" htmlFor="requiredLevel">
            <TextInput
              id="requiredLevel"
              type="number"
              value={formData.requiredLevel}
              onChange={(e) => handleChange("requiredLevel", Number(e.target.value))}
              min="1"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Rewards" icon={Gift} iconColor="text-green-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField label="Reward Experience" htmlFor="rewardExperience">
            <TextInput
              id="rewardExperience"
              type="number"
              value={formData.rewardExperience}
              onChange={(e) => handleChange("rewardExperience", Number(e.target.value))}
              min="0"
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

          <FormField label="Reward Gems" htmlFor="rewardGems">
            <TextInput
              id="rewardGems"
              type="number"
              value={formData.rewardGems}
              onChange={(e) => handleChange("rewardGems", Number(e.target.value))}
              min="0"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Reward Item" htmlFor="rewardItemId">
            <SelectInput
              id="rewardItemId"
              options={itemOptions.map((item) => ({
                value: String(item.itemId),
                label: `${item.name} #${item.itemId}`,
              }))}
              placeholder="No item reward"
              value={formData.rewardItemId == null ? "" : String(formData.rewardItemId)}
              onChange={(e) =>
                handleChange("rewardItemId", e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </FormField>

          <FormField label="Reward Skill ID" htmlFor="rewardSkillId">
            <TextInput
              id="rewardSkillId"
              type="number"
              value={formData.rewardSkillId ?? ""}
              onChange={(e) =>
                handleChange("rewardSkillId", e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="Optional skill id"
              min="1"
            />
          </FormField>
        </div>
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-quests")}
        submitLabel="Update Quest"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}