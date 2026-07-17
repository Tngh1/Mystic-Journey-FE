"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, getNpcOptions } from "@/lib/api/quests";
import type { QuestResponse } from "@/lib/api/quests";
import { getAll as getItems } from "@/lib/api/items";
import { getAll as getMonsters } from "@/lib/api/monsters";
import { getSkills, type SkillResponse } from "@/lib/api/skills";
import type { ItemResponse, MonsterResponse, NPCResponse } from "@/lib/types";
import {
  BookOpen,
  Coins,
  Gift,
  ListChecks,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Save,
  Shield,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
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

const SINGLE_AMOUNT_OBJECTIVES = new Set(["Explore", "Talk", "OpenChest", "Interact"]);

const MAP_PRESETS = [
  { value: "ElfForest", label: "ElfForest - Elf Forest Slot" },
  { value: "AutumnTown", label: "AutumnTown - Autumn Pumpkin Slot" },
  { value: "FrozenMountain", label: "FrozenMountain - Frozen Mountains Slot" },
  { value: "AbandonedCastle", label: "AbandonedCastle - Vestige Of Era Slot" },
];

const OBJECTIVE_META: Record<string, { targetPlaceholder: string; locationPlaceholder: string; targetHint: string }> = {
  Explore: {
    targetPlaceholder: "Area, waypoint, or discovery key",
    locationPlaceholder: "Forest Edge, Old Willow Clearing",
    targetHint: "Area",
  },
  Defeat: {
    targetPlaceholder: "Monster or boss name",
    locationPlaceholder: "Spawn region or arena",
    targetHint: "Enemy",
  },
  Collect: {
    targetPlaceholder: "Item name or item key",
    locationPlaceholder: "Gathering area",
    targetHint: "Item",
  },
  Talk: {
    targetPlaceholder: "NPC display name",
    locationPlaceholder: "NPC standing location",
    targetHint: "NPC",
  },
  OpenChest: {
    targetPlaceholder: "Chest key or chest name",
    locationPlaceholder: "Chest location",
    targetHint: "Chest",
  },
  Interact: {
    targetPlaceholder: "Object key, lever, marker, or shrine",
    locationPlaceholder: "Object location",
    targetHint: "Object",
  },
};

type RewardItemDraft = {
  itemId: number | null;
  quantity: number;
};
type RewardSkillDraft = {
  skillId: number | null;
};

type SelectOption = { value: string; label: string };

function addFallbackOption(options: SelectOption[], value: string, labelSuffix = "legacy value") {
  const normalized = value.trim();
  if (!normalized || options.some((option) => option.value === normalized)) return options;
  return [{ value: normalized, label: `${normalized} - ${labelSuffix}` }, ...options];
}
type FormData = {
  title: string;
  description: string;
  dialogueContent: string;
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
  rewardItems: RewardItemDraft[];
  rewardSkills: RewardSkillDraft[];
  isActive: boolean;
};

const INITIAL_FORM: FormData = {
  title: "",
  description: "",
  dialogueContent: "",
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
  rewardItems: [],
  rewardSkills: [],
  isActive: true,
};

function toNumber(value: string, fallback = 0) {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeRewardItems(items: RewardItemDraft[]) {
  const grouped = new Map<number, number>();

  for (const item of items) {
    if (item.itemId == null) continue;
    const quantity = Math.max(1, Math.min(10000, Math.floor(item.quantity || 1)));
    grouped.set(item.itemId, Math.min(10000, (grouped.get(item.itemId) ?? 0) + quantity));
  }

  return Array.from(grouped, ([itemId, quantity]) => ({ itemId, quantity }));
}
function normalizeRewardSkills(skills: RewardSkillDraft[]) {
  const seen = new Set<number>();
  const normalized: { skillId: number }[] = [];

  for (const skill of skills) {
    if (skill.skillId == null || seen.has(skill.skillId)) continue;
    seen.add(skill.skillId);
    normalized.push({ skillId: skill.skillId });
  }

  return normalized;
}

function getObjectiveText(formData: FormData) {
  const target = formData.objectiveTarget.trim() || formData.objectiveLocation.trim() || "No target";
  const amount = formData.targetAmount > 1 ? ` x${formData.targetAmount}` : "";
  return `${formData.objectiveType}${amount} - ${target}`;
}
export default function EditQuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");
  const hasQuestId = Boolean(questId);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(hasQuestId);
  const [error, setError] = useState<string | null>(hasQuestId ? null : "Quest id is missing.");
  const [itemOptions, setItemOptions] = useState<ItemResponse[]>([]);
  const [skillOptions, setSkillOptions] = useState<SkillResponse[]>([]);
  const [monsterOptions, setMonsterOptions] = useState<MonsterResponse[]>([]);
  const [npcOptions, setNpcOptions] = useState<NPCResponse[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  useEffect(() => {
    let mounted = true;

    Promise.all([getItems(), getSkills(1, 1000), getMonsters(1, 1000)])
      .then(([itemsRes, skillsRes, monstersRes]) => {
        if (!mounted) return;
        setItemOptions(itemsRes.items);
        setSkillOptions(skillsRes.items);
        setMonsterOptions(monstersRes.items);
      })
      .catch(() => {
        if (!mounted) return;
        setItemOptions([]);
        setSkillOptions([]);
        setMonsterOptions([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    getNpcOptions(formData.mapName || undefined)
      .then((npcs) => {
        if (!mounted) return;
        setNpcOptions(npcs);
      })
      .catch(() => {
        if (!mounted) return;
        setNpcOptions([]);
      });

    return () => {
      mounted = false;
    };
  }, [formData.mapName]);

  useEffect(() => {
    if (!questId) return;

    getById(Number(questId))
      .then((quest: QuestResponse) => {
        const rewardItems = quest.rewardItems?.length
          ? quest.rewardItems.map((item) => ({
              itemId: item.itemId,
              quantity: Math.max(1, item.quantity || 1),
            }))
          : quest.rewardItemId
            ? [{ itemId: quest.rewardItemId, quantity: 1 }]
            : [];
        const rewardSkills = quest.rewardSkills?.length
          ? quest.rewardSkills.map((skill) => ({ skillId: skill.skillId }))
          : quest.rewardSkillId
            ? [{ skillId: quest.rewardSkillId }]
            : [];
        const objectiveType = OBJECTIVE_TYPES.some((objective) => objective.value === quest.objectiveType)
          ? quest.objectiveType
          : "Explore";

        setFormData({
          title: quest.title,
          description: quest.description || "",
          dialogueContent: quest.dialogueContent || quest.description || "",
          type: quest.type,
          defaultStatus: DEFAULT_STATUSES.some((status) => status.value === quest.defaultStatus)
            ? quest.defaultStatus
            : "NotStarted",
          mapName: quest.mapName || "ElfForest",
          regionName: quest.regionName || "",
          objectiveType,
          objectiveTarget: quest.objectiveTarget || "",
          objectiveLocation: quest.objectiveLocation || "",
          questGiverName: quest.questGiverName || "",
          requiredLevel: quest.requiredLevel,
          targetAmount: SINGLE_AMOUNT_OBJECTIVES.has(objectiveType) ? 1 : Math.max(1, quest.targetAmount || 1),
          rewardExperience: quest.rewardExperience,
          rewardGold: quest.rewardGold,
          rewardGems: quest.rewardGems,
          rewardItems,
          rewardSkills,
          isActive: quest.isActive,
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load quest"))
      .finally(() => setFetching(false));
  }, [questId]);

  const rewardItemOptions = useMemo(
    () => itemOptions.map((item) => ({ value: String(item.itemId), label: `${item.name} #${item.itemId}` })),
    [itemOptions],
  );

  const rewardSkillOptions = useMemo(
    () =>
      skillOptions.map((skill) => ({
        value: String(skill.skillId),
        label: `${skill.name} #${skill.skillId}${skill.classRequirement ? ` - ${skill.classRequirement}` : ""}`,
      })),
    [skillOptions],
  );

  const npcSelectOptions = useMemo(() => {
    const options = npcOptions.map((npc) => ({
      value: npc.name,
      label: `${npc.name} #${npc.npcId}${npc.mapName ? ` - ${npc.mapName}` : ""}`,
    }));
    return addFallbackOption(options, formData.questGiverName);
  }, [formData.questGiverName, npcOptions]);

  const talkTargetOptions = useMemo(
    () => addFallbackOption(npcSelectOptions, formData.objectiveTarget),
    [formData.objectiveTarget, npcSelectOptions],
  );

  const itemTargetOptions = useMemo(() => {
    const options = itemOptions.map((item) => ({
      value: item.name,
      label: `${item.name} #${item.itemId}${item.type ? ` - ${item.type}` : ""}`,
    }));
    return addFallbackOption(options, formData.objectiveTarget);
  }, [formData.objectiveTarget, itemOptions]);

  const monsterTargetOptions = useMemo(() => {
    const options = monsterOptions.map((monster) => ({
      value: monster.name,
      label: `${monster.name} #${monster.monsterId} - Lv.${monster.level}`,
    }));
    return addFallbackOption(options, formData.objectiveTarget);
  }, [formData.objectiveTarget, monsterOptions]);

  const mapOptions = useMemo(() => {
    if (!formData.mapName || MAP_PRESETS.some((map) => map.value === formData.mapName)) return MAP_PRESETS;
    return [{ value: formData.mapName, label: `${formData.mapName} - legacy value` }, ...MAP_PRESETS];
  }, [formData.mapName]);

  const normalizedRewardSkills = useMemo(() => normalizeRewardSkills(formData.rewardSkills), [formData.rewardSkills]);

  const rewardSkillSummaries = useMemo(
    () =>
      normalizedRewardSkills.map((rewardSkill) => {
        const skill = skillOptions.find((option) => option.skillId === rewardSkill.skillId);
        if (!skill) return `Skill #${rewardSkill.skillId}`;
        return `${skill.name}${skill.classRequirement ? ` - ${skill.classRequirement}` : ""}`;
      }),
    [normalizedRewardSkills, skillOptions],
  );

  const objectiveMeta = OBJECTIVE_META[formData.objectiveType] ?? OBJECTIVE_META.Explore;
  const isSingleAmountObjective = SINGLE_AMOUNT_OBJECTIVES.has(formData.objectiveType);

  const dialoguePreview = useMemo(() => {
    if (formData.dialogueContent.trim()) return formData.dialogueContent.trim();
    if (formData.description.trim()) return formData.description.trim();
    if (formData.title.trim()) return `I need help with ${formData.title.trim()}.`;
    return "I have a task for you.";
  }, [formData.description, formData.dialogueContent, formData.title]);

  const normalizedRewardItems = useMemo(() => normalizeRewardItems(formData.rewardItems), [formData.rewardItems]);

  const rewardItemSummaries = useMemo(
    () =>
      normalizedRewardItems.map((rewardItem) => {
        const itemName = itemOptions.find((item) => item.itemId === rewardItem.itemId)?.name ?? `Item #${rewardItem.itemId}`;
        return `${itemName} x${rewardItem.quantity}`;
      }),
    [itemOptions, normalizedRewardItems],
  );

  const rewardItemQuantityTotal = useMemo(
    () => normalizedRewardItems.reduce((total, item) => total + item.quantity, 0),
    [normalizedRewardItems],
  );

  const rewardSummary = useMemo(() => {
    const rewards = [
      formData.rewardExperience > 0 ? `${formData.rewardExperience} EXP` : "",
      formData.rewardGold > 0 ? `${formData.rewardGold} Gold` : "",
      formData.rewardGems > 0 ? `${formData.rewardGems} Gems` : "",
      ...rewardItemSummaries,
      ...rewardSkillSummaries,
    ].filter(Boolean);

    return rewards.length > 0 ? rewards.join(" + ") : "No reward";
  }, [formData.rewardExperience, formData.rewardGems, formData.rewardGold, rewardItemSummaries, rewardSkillSummaries]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectiveTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectiveType: value,
      objectiveTarget: value === "Talk" ? prev.questGiverName : "",
      targetAmount: SINGLE_AMOUNT_OBJECTIVES.has(value) ? 1 : Math.max(1, prev.targetAmount || 1),
    }));
  };

  const handleMapChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mapName: value,
      questGiverName: "",
      objectiveTarget: prev.objectiveType === "Talk" ? "" : prev.objectiveTarget,
    }));
  };

  const handleQuestGiverChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      questGiverName: value,
      objectiveTarget: prev.objectiveType === "Talk" ? value : prev.objectiveTarget,
    }));
  };

  const handleObjectiveTargetChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      objectiveTarget: value,
      questGiverName: prev.objectiveType === "Talk" ? value : prev.questGiverName,
    }));
  };

  const applyTalkObjective = () => {
    setFormData((prev) => ({
      ...prev,
      objectiveType: "Talk",
      objectiveTarget: prev.questGiverName.trim() || prev.objectiveTarget,
      targetAmount: 1,
    }));
  };

  const addRewardItem = () => {
    setFormData((prev) => ({ ...prev, rewardItems: [...prev.rewardItems, { itemId: null, quantity: 1 }] }));
  };

  const updateRewardItem = (index: number, patch: Partial<RewardItemDraft>) => {
    setFormData((prev) => ({
      ...prev,
      rewardItems: prev.rewardItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const removeRewardItem = (index: number) => {
    setFormData((prev) => ({ ...prev, rewardItems: prev.rewardItems.filter((_, itemIndex) => itemIndex !== index) }));
  };
  const addRewardSkill = () => {
    setFormData((prev) => ({ ...prev, rewardSkills: [...prev.rewardSkills, { skillId: null }] }));
  };

  const updateRewardSkill = (index: number, patch: Partial<RewardSkillDraft>) => {
    setFormData((prev) => ({
      ...prev,
      rewardSkills: prev.rewardSkills.map((skill, skillIndex) => (skillIndex === index ? { ...skill, ...patch } : skill)),
    }));
  };

  const removeRewardSkill = (index: number) => {
    setFormData((prev) => ({ ...prev, rewardSkills: prev.rewardSkills.filter((_, skillIndex) => skillIndex !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questId) return;

    if (!formData.title.trim()) {
      setError("Quest title is required.");
      return;
    }

    if (formData.dialogueContent.trim() && !formData.questGiverName.trim()) {
      setError("Choose an existing Quest Giver / NPC before saving dialogue.");
      return;
    }

    if (["Talk", "Collect", "Defeat"].includes(formData.objectiveType) && !formData.objectiveTarget.trim()) {
      setError(`Choose a ${objectiveMeta.targetHint.toLowerCase()} target for this objective.`);
      return;
    }

    const rewardItems = normalizeRewardItems(formData.rewardItems);
    const rewardSkills = normalizeRewardSkills(formData.rewardSkills);

    try {
      setLoading(true);
      setError(null);
      await update(Number(questId), {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        defaultStatus: formData.defaultStatus,
        mapName: formData.mapName || "ElfForest",
        regionName: formData.regionName.trim() || null,
        objectiveType: formData.objectiveType,
        objectiveTarget: formData.objectiveTarget.trim() || null,
        objectiveLocation: formData.objectiveLocation.trim() || null,
        questGiverName: formData.questGiverName.trim() || null,
        requiredLevel: Math.max(1, formData.requiredLevel),
        targetAmount: isSingleAmountObjective ? 1 : Math.max(1, formData.targetAmount),
        rewardExperience: Math.max(0, formData.rewardExperience),
        rewardGold: Math.max(0, formData.rewardGold),
        rewardGems: Math.max(0, formData.rewardGems),
        rewardItemId: rewardItems[0]?.itemId ?? null,
        rewardItems,
        rewardSkillId: rewardSkills[0]?.skillId ?? null,
        rewardSkills,
        syncDialogue: true,
        dialogueContent: formData.dialogueContent.trim() || null,
        dialogueDisplayOrder: 0,
        dialogueIsActive: Boolean(formData.dialogueContent.trim()),
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
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-10 w-10 animate-spin text-[#ffc032]" />
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
        badge={formData.isActive ? "Active" : "Inactive"}
        badgeTone={formData.isActive ? "success" : "danger"}
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <FormSection title="General Information" icon={BookOpen}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

              <div className="flex items-end">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  label="Quest is active and playable"
                />
              </div>
            </div>

            <FormField label="Description" htmlFor="description">
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Story prompt, player-facing quest text, or admin note"
                rows={4}
              />
            </FormField>
          </FormSection>

          <FormSection
            title="NPC Dialogue Link"
            subtitle="NPCDialogue row uses ResponseType Quest and LinkedQuestId"
            icon={MessageSquare}
            iconColor="text-purple-400"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Quest Giver / NPC" htmlFor="questGiverName">
                <SelectInput
                  id="questGiverName"
                  options={npcSelectOptions}
                  placeholder="Choose NPC"
                  value={formData.questGiverName}
                  onChange={(e) => handleQuestGiverChange(e.target.value)}
                />
              </FormField>

              <FormField label="Linked Quest ID">
                <div className="flex h-11 items-center rounded-lg border border-purple-500/20 bg-purple-500/10 px-4 text-sm font-semibold text-purple-200">
                  {questId ? `LinkedQuestId #${questId}` : "No quest id"}
                </div>
              </FormField>
            </div>

            <FormField label="Quest Dialogue Content" htmlFor="dialogueContent">
              <TextArea
                id="dialogueContent"
                value={formData.dialogueContent}
                onChange={(e) => handleChange("dialogueContent", e.target.value)}
                placeholder="NPC dialogue shown for this linked quest"
                rows={4}
              />
            </FormField>

            <button
              type="button"
              onClick={applyTalkObjective}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-500/15"
            >
              <MessageSquare className="h-4 w-4" />
              Use NPC as Talk target
            </button>
          </FormSection>

          <FormSection title="Objectives & Location" icon={Target} iconColor="text-red-400">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Objective Type" htmlFor="objectiveType" required>
                <SelectInput
                  id="objectiveType"
                  options={OBJECTIVE_TYPES}
                  value={formData.objectiveType}
                  onChange={(e) => handleObjectiveTypeChange(e.target.value)}
                />
              </FormField>

              <FormField label={`${objectiveMeta.targetHint} Target`} htmlFor="objectiveTarget" hint={objectiveMeta.targetHint}>
                {formData.objectiveType === "Talk" ? (
                  <SelectInput
                    id="objectiveTarget"
                    options={talkTargetOptions}
                    placeholder="Choose NPC"
                    value={formData.objectiveTarget}
                    onChange={(e) => handleObjectiveTargetChange(e.target.value)}
                  />
                ) : formData.objectiveType === "Collect" ? (
                  <SelectInput
                    id="objectiveTarget"
                    options={itemTargetOptions}
                    placeholder="Choose item"
                    value={formData.objectiveTarget}
                    onChange={(e) => handleObjectiveTargetChange(e.target.value)}
                  />
                ) : formData.objectiveType === "Defeat" ? (
                  <SelectInput
                    id="objectiveTarget"
                    options={monsterTargetOptions}
                    placeholder="Choose monster"
                    value={formData.objectiveTarget}
                    onChange={(e) => handleObjectiveTargetChange(e.target.value)}
                  />
                ) : (
                  <TextInput
                    id="objectiveTarget"
                    value={formData.objectiveTarget}
                    onChange={(e) => handleObjectiveTargetChange(e.target.value)}
                    placeholder={objectiveMeta.targetPlaceholder}
                  />
                )}
              </FormField>

              {isSingleAmountObjective ? (
                <FormField label="Target Amount" htmlFor="targetAmount">
                  <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white/75">
                    1
                  </div>
                </FormField>
              ) : (
                <FormField label="Target Amount" htmlFor="targetAmount" required>
                  <TextInput
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => handleChange("targetAmount", Math.max(1, toNumber(e.target.value, 1)))}
                    min="1"
                    required
                  />
                </FormField>
              )}

              <FormField label="Objective Location" htmlFor="objectiveLocation">
                <TextInput
                  id="objectiveLocation"
                  value={formData.objectiveLocation}
                  onChange={(e) => handleChange("objectiveLocation", e.target.value)}
                  placeholder={objectiveMeta.locationPlaceholder}
                />
              </FormField>

              <FormField label="Map Name" htmlFor="mapName" required>
                <SelectInput
                  id="mapName"
                  options={mapOptions}
                  value={formData.mapName}
                  onChange={(e) => handleMapChange(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Region / Area Key" htmlFor="regionName" hint="Optional">
                <TextInput
                  id="regionName"
                  value={formData.regionName}
                  onChange={(e) => handleChange("regionName", e.target.value)}
                  placeholder="Sub-area key, e.g. ElderRowanCamp"
                />
              </FormField>
            </div>
          </FormSection>
          <FormSection title="Requirements" icon={Shield} iconColor="text-blue-400">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Required Level" htmlFor="requiredLevel">
                <TextInput
                  id="requiredLevel"
                  type="number"
                  value={formData.requiredLevel}
                  onChange={(e) => handleChange("requiredLevel", Math.max(1, toNumber(e.target.value, 1)))}
                  min="1"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Rewards" icon={Gift} iconColor="text-green-400">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField label="Reward Experience" htmlFor="rewardExperience">
                <TextInput
                  id="rewardExperience"
                  type="number"
                  value={formData.rewardExperience}
                  onChange={(e) => handleChange("rewardExperience", Math.max(0, toNumber(e.target.value)))}
                  min="0"
                />
              </FormField>

              <FormField label="Reward Gold" htmlFor="rewardGold">
                <TextInput
                  id="rewardGold"
                  type="number"
                  value={formData.rewardGold}
                  onChange={(e) => handleChange("rewardGold", Math.max(0, toNumber(e.target.value)))}
                  min="0"
                />
              </FormField>

              <FormField label="Reward Gems" htmlFor="rewardGems">
                <TextInput
                  id="rewardGems"
                  type="number"
                  value={formData.rewardGems}
                  onChange={(e) => handleChange("rewardGems", Math.max(0, toNumber(e.target.value)))}
                  min="0"
                />
              </FormField>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Reward Items</h3>
                <button
                  type="button"
                  onClick={addRewardItem}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-green-500/25 bg-green-500/10 px-3 text-xs font-semibold text-green-200 transition-colors hover:bg-green-500/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              {formData.rewardItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-white/45">
                  No item rewards
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.rewardItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_140px_44px]">
                      <FormField label={`Item ${index + 1}`} htmlFor={`rewardItem-${index}`}>
                        <SelectInput
                          id={`rewardItem-${index}`}
                          options={rewardItemOptions}
                          placeholder="Choose item"
                          value={item.itemId == null ? "" : String(item.itemId)}
                          onChange={(e) =>
                            updateRewardItem(index, {
                              itemId: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                        />
                      </FormField>

                      <FormField label="Qty" htmlFor={`rewardItemQty-${index}`}>
                        <TextInput
                          id={`rewardItemQty-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateRewardItem(index, {
                              quantity: Math.max(1, Math.min(10000, toNumber(e.target.value, 1))),
                            })
                          }
                          min="1"
                          max="10000"
                        />
                      </FormField>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeRewardItem(index)}
                          title="Remove item reward"
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 transition-colors hover:bg-red-500/15"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Reward Skills</h3>
                <button
                  type="button"
                  onClick={addRewardSkill}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-purple-500/25 bg-purple-500/10 px-3 text-xs font-semibold text-purple-200 transition-colors hover:bg-purple-500/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </button>
              </div>

              {formData.rewardSkills.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-white/45">
                  No skill rewards
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.rewardSkills.map((skill, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_44px]">
                      <FormField label={`Skill ${index + 1}`} htmlFor={`rewardSkill-${index}`}>
                        <SelectInput
                          id={`rewardSkill-${index}`}
                          options={rewardSkillOptions}
                          placeholder="Choose skill"
                          value={skill.skillId == null ? "" : String(skill.skillId)}
                          onChange={(e) =>
                            updateRewardSkill(index, {
                              skillId: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                        />
                      </FormField>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeRewardSkill(index)}
                          title="Remove skill reward"
                          className="flex h-11 w-11 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 transition-colors hover:bg-red-500/15"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </div>
        <aside className="space-y-4 xl:sticky xl:top-24">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffc032]/10 text-[#ffc032]">
                <ListChecks className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Quest Flow</h2>
                <p className="text-xs text-white/40">Runtime summary</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Accept From</p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {formData.questGiverName.trim() || "Unassigned NPC"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Objective</p>
                <p className="mt-1 text-sm font-semibold text-red-200">{getObjectiveText(formData)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Reward</p>
                <p className="mt-1 text-sm font-semibold text-green-300">{rewardSummary}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-300" />
              <h2 className="text-sm font-bold text-purple-100">NPC Dialogue</h2>
            </div>
            <div className="rounded-xl border border-purple-400/20 bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200/60">
                {formData.questGiverName.trim() || "NPC"}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">{dialoguePreview}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-black/20 p-2">
                <p className="text-white/35">ResponseType</p>
                <p className="mt-1 font-semibold text-purple-200">Quest</p>
              </div>
              <div className="rounded-lg bg-black/20 p-2">
                <p className="text-white/35">LinkedQuestId</p>
                <p className="mt-1 font-semibold text-purple-200">#{questId}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#ffc032]" />
              <h2 className="text-sm font-bold text-white">Balance Snapshot</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <Coins className="mx-auto h-4 w-4 text-yellow-300" />
                <p className="mt-2 text-sm font-black text-white">{formData.rewardGold}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/35">Gold</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <Sparkles className="mx-auto h-4 w-4 text-cyan-300" />
                <p className="mt-2 text-sm font-black text-white">{formData.rewardGems}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/35">Gems</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <Package className="mx-auto h-4 w-4 text-green-300" />
                <p className="mt-2 text-sm font-black text-white">{rewardItemQuantityTotal}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/35">Items</p>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/35">World</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
                <MapPin className="h-4 w-4 text-[#ffc032]" />
                {formData.mapName || "No map"}
              </p>
            </div>
          </div>
        </aside>
      </div>

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