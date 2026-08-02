"use client";

import { useEffect, useMemo, useState } from "react";
import { getNpcOptions } from "@/lib/api/quests";
import { getAll as getItems } from "@/lib/api/items";
import { getAll as getMonsters } from "@/lib/api/monsters";
import { getSkills, type SkillResponse } from "@/lib/api/skills";
import type { ItemResponse, MonsterResponse, NPCResponse, QuestResponse, UpdateQuestRequest } from "@/lib/types";
import {
  BookOpen,
  Gift,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  Save,
  Shield,
  Sparkles,
  Target,
  Trash2,
  Skull,
} from "lucide-react";
import FormActions from "@/components/form/FormActions";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, SelectInput, Checkbox } from "@/components/form/FormInput";
import ItemPickerModal from "@/components/ui/ItemPickerModal";
import MonsterPickerModal from "@/components/ui/MonsterPickerModal";

const QUEST_TYPES = [
  { value: "Main", label: "Main Story" },
  { value: "Side", label: "Side Quest" },
  { value: "Daily", label: "Daily Quest" },
  { value: "Event", label: "Event Quest" },
];

const DEFAULT_STATUSES = [
  { value: "NotStarted", label: "Not Started" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Claimed", label: "Claimed" },
];

const OBJECTIVE_TYPES = [
  { value: "Explore", label: "Explore Area" },
  { value: "Defeat", label: "Defeat Monsters" },
  { value: "Collect", label: "Collect Items" },
  { value: "Talk", label: "Talk to NPC" },
  { value: "OpenChest", label: "Open Chest" },
  { value: "Interact", label: "Interact with Object" },
];

const MAP_PRESETS = [
  { value: "ElfForest", label: "ElfForest - Elf Forest" },
  { value: "AutumnPumpkin", label: "AutumnPumpkin - Autumn Pumpkin Town" },
  { value: "AutumnTown", label: "AutumnTown - Autumn Town" },
  { value: "FrozenMountain", label: "FrozenMountain - Frozen Mountains" },
  { value: "AbandonedCastle", label: "AbandonedCastle - Vestige Of Era" },
];

type RewardItemDraft = {
  itemId: number | null;
  quantity: number;
};

type RewardSkillDraft = {
  skillId: number | null;
};

export type QuestFormData = {
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

interface QuestFormProps {
  mode: "create" | "update";
  initialData?: QuestResponse | null;
  loading: boolean;
  error?: string | null;
  onDismissError?: () => void;
  onCancel: () => void;
  onSubmit: (payload: UpdateQuestRequest) => Promise<void> | void;
}

const EMPTY_FORM: QuestFormData = {
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
  rewardExperience: 100,
  rewardGold: 50,
  rewardGems: 0,
  rewardItems: [],
  rewardSkills: [],
  isActive: true,
};

function formFromInitial(initial?: QuestResponse | null): QuestFormData {
  if (!initial) return EMPTY_FORM;
  return {
    title: initial.title || "",
    description: initial.description || "",
    dialogueContent: initial.dialogueContent || "",
    type: initial.type || "Main",
    defaultStatus: initial.defaultStatus || "NotStarted",
    mapName: initial.mapName || "ElfForest",
    regionName: initial.regionName || "",
    objectiveType: initial.objectiveType || "Explore",
    objectiveTarget: initial.objectiveTarget || "",
    objectiveLocation: initial.objectiveLocation || "",
    questGiverName: initial.questGiverName || "",
    requiredLevel: initial.requiredLevel || 1,
    targetAmount: initial.targetAmount || 1,
    rewardExperience: initial.rewardExperience || 0,
    rewardGold: initial.rewardGold || 0,
    rewardGems: initial.rewardGems || 0,
    rewardItems: initial.rewardItems?.length
      ? initial.rewardItems.map((item) => ({ itemId: item.itemId, quantity: item.quantity }))
      : initial.rewardItemId
      ? [{ itemId: initial.rewardItemId, quantity: 1 }]
      : [],
    rewardSkills: initial.rewardSkills?.length
      ? initial.rewardSkills.map((skill) => ({ skillId: skill.skillId }))
      : initial.rewardSkillId
      ? [{ skillId: initial.rewardSkillId }]
      : [],
    isActive: initial.isActive ?? true,
  };
}

export default function QuestForm({
  mode,
  initialData,
  loading,
  error,
  onDismissError,
  onCancel,
  onSubmit,
}: QuestFormProps) {
  const [formData, setFormData] = useState<QuestFormData>(() => formFromInitial(initialData));
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [monsters, setMonsters] = useState<MonsterResponse[]>([]);
  const [npcs, setNpcs] = useState<NPCResponse[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Modals
  const [itemPickerOpen, setItemPickerOpen] = useState(false);
  const [activeItemRewardIndex, setActiveItemRewardIndex] = useState<number | null>(null);
  const [targetItemPickerOpen, setTargetItemPickerOpen] = useState(false);
  const [monsterPickerOpen, setMonsterPickerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([getItems(1, 1000), getSkills(1, 1000), getMonsters(1, 1000)])
      .then(([itemsRes, skillsRes, monstersRes]) => {
        if (!mounted) return;
        setItems(itemsRes.items);
        setSkills(skillsRes.items);
        setMonsters(monstersRes.items);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    getNpcOptions(formData.mapName || undefined)
      .then((data) => { if (mounted) setNpcs(data); })
      .catch(() => { if (mounted) setNpcs([]); });
    return () => { mounted = false; };
  }, [formData.mapName]);

  const handleChange = <K extends keyof QuestFormData>(field: K, value: QuestFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (presetType: "defeat" | "talk" | "collect" | "daily") => {
    if (presetType === "defeat") {
      setFormData((prev) => ({
        ...prev,
        type: "Main",
        objectiveType: "Defeat",
        targetAmount: 5,
        rewardExperience: 500,
        rewardGold: 250,
      }));
    } else if (presetType === "talk") {
      setFormData((prev) => ({
        ...prev,
        type: "Main",
        objectiveType: "Talk",
        targetAmount: 1,
        rewardExperience: 200,
        rewardGold: 100,
      }));
    } else if (presetType === "collect") {
      setFormData((prev) => ({
        ...prev,
        type: "Side",
        objectiveType: "Collect",
        targetAmount: 10,
        rewardExperience: 400,
        rewardGold: 300,
      }));
    } else if (presetType === "daily") {
      setFormData((prev) => ({
        ...prev,
        type: "Daily",
        objectiveType: "Defeat",
        targetAmount: 15,
        rewardExperience: 1000,
        rewardGold: 500,
        rewardGems: 10,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setLocalError("Quest title is required.");
      return;
    }

    setLocalError(null);
    const validItems = formData.rewardItems
      .filter((i) => i.itemId != null && i.itemId > 0)
      .map((i) => ({ itemId: i.itemId!, quantity: Math.max(1, i.quantity) }));

    const validSkills = formData.rewardSkills
      .filter((s) => s.skillId != null && s.skillId > 0)
      .map((s) => ({ skillId: s.skillId! }));

    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      type: formData.type,
      defaultStatus: formData.defaultStatus,
      mapName: formData.mapName,
      regionName: formData.regionName.trim() || null,
      objectiveType: formData.objectiveType,
      objectiveTarget: formData.objectiveTarget.trim() || null,
      objectiveLocation: formData.objectiveLocation.trim() || null,
      questGiverName: formData.questGiverName.trim() || null,
      requiredLevel: Math.max(1, formData.requiredLevel),
      targetAmount: Math.max(1, formData.targetAmount),
      rewardExperience: Math.max(0, formData.rewardExperience),
      rewardGold: Math.max(0, formData.rewardGold),
      rewardGems: Math.max(0, formData.rewardGems),
      rewardItemId: validItems[0]?.itemId ?? null,
      rewardItems: validItems,
      rewardSkillId: validSkills[0]?.skillId ?? null,
      rewardSkills: validSkills,
      syncDialogue: true,
      dialogueContent: formData.dialogueContent.trim() || null,
      dialogueDisplayOrder: 0,
      dialogueIsActive: Boolean(formData.dialogueContent.trim()),
      isActive: formData.isActive,
    });
  };

  const alertMessage = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      {alertMessage && (
        <FormAlert message={alertMessage} onDismiss={() => { setLocalError(null); onDismissError?.(); }} />
      )}

      {/* Target Monster Picker Modal */}
      <MonsterPickerModal
        isOpen={monsterPickerOpen}
        onClose={() => setMonsterPickerOpen(false)}
        onSelect={(monster) => handleChange("objectiveTarget", monster.name)}
        selectedMonsterName={formData.objectiveTarget}
      />

      {/* Target Item Picker Modal */}
      <ItemPickerModal
        isOpen={targetItemPickerOpen}
        onClose={() => setTargetItemPickerOpen(false)}
        onSelect={(item) => handleChange("objectiveTarget", item.name)}
        title="Select Target Item to Collect"
      />

      {/* Reward Item Picker Modal */}
      <ItemPickerModal
        isOpen={itemPickerOpen}
        onClose={() => { setItemPickerOpen(false); setActiveItemRewardIndex(null); }}
        onSelect={(item) => {
          if (activeItemRewardIndex != null) {
            const updated = [...formData.rewardItems];
            updated[activeItemRewardIndex] = { ...updated[activeItemRewardIndex], itemId: item.itemId };
            handleChange("rewardItems", updated);
          }
        }}
        title="Select Quest Reward Item"
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main Quest Form Fields */}
        <div className="space-y-6">
          {/* General Section */}
          <FormSection title="General Information" icon={BookOpen}>
            {/* Quick Templates */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-white/50 self-center mr-1">Quick Templates:</span>
              <button
                type="button"
                onClick={() => applyPreset("defeat")}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/20"
              >
                ⚔️ Defeat Monsters
              </button>
              <button
                type="button"
                onClick={() => applyPreset("talk")}
                className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500/20"
              >
                📜 NPC Dialogue
              </button>
              <button
                type="button"
                onClick={() => applyPreset("collect")}
                className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                🌾 Gathering Item
              </button>
              <button
                type="button"
                onClick={() => applyPreset("daily")}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
              >
                ⚡ Daily Challenge
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Quest Title" htmlFor="title" required>
                <TextInput
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Clear the Pumpkin Clearing"
                  required
                />
              </FormField>

              <FormField label="Quest Type" htmlFor="type" required>
                <SelectInput
                  id="type"
                  options={QUEST_TYPES}
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Map / World Location" htmlFor="mapName" required>
                <SelectInput
                  id="mapName"
                  options={MAP_PRESETS}
                  value={formData.mapName}
                  onChange={(e) => handleChange("mapName", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Required Level" htmlFor="requiredLevel">
                <TextInput
                  id="requiredLevel"
                  type="number"
                  value={formData.requiredLevel}
                  onChange={(e) => handleChange("requiredLevel", Math.max(1, Number(e.target.value)))}
                  min="1"
                />
              </FormField>
            </div>

            <FormField label="Quest Journal Description" htmlFor="description">
              <TextArea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief story background shown in player's quest book..."
                rows={3}
              />
            </FormField>

            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              label="Quest is active and playable in game world"
            />
          </FormSection>

          {/* NPC & Dialogue Section */}
          <FormSection title="NPC Quest Giver & Dialogue" icon={MessageSquare}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Quest Giver NPC" htmlFor="questGiverName">
                <SelectInput
                  id="questGiverName"
                  options={[
                    { value: "", label: "-- None (System Auto Quest) --" },
                    ...npcs.map((n) => ({ value: n.name, label: `${n.name} (${n.mapName})` })),
                  ]}
                  value={formData.questGiverName}
                  onChange={(e) => handleChange("questGiverName", e.target.value)}
                />
              </FormField>

              <FormField label="Region Sub-Area" htmlFor="regionName" hint="Optional">
                <TextInput
                  id="regionName"
                  value={formData.regionName}
                  onChange={(e) => handleChange("regionName", e.target.value)}
                  placeholder="e.g., Rowan Tree Shrine"
                />
              </FormField>
            </div>

            <FormField label="NPC Conversation Dialogue" htmlFor="dialogueContent">
              <TextArea
                id="dialogueContent"
                value={formData.dialogueContent}
                onChange={(e) => handleChange("dialogueContent", e.target.value)}
                placeholder="What the NPC says when giving or completing this quest..."
                rows={3}
              />
            </FormField>
          </FormSection>

          {/* Objectives Section */}
          <FormSection title="Objective Config" icon={Target}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Objective Type" htmlFor="objectiveType" required>
                <SelectInput
                  id="objectiveType"
                  options={OBJECTIVE_TYPES}
                  value={formData.objectiveType}
                  onChange={(e) => handleChange("objectiveType", e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Objective Target Name" htmlFor="objectiveTarget" required>
                <div className="flex gap-2">
                  <TextInput
                    id="objectiveTarget"
                    value={formData.objectiveTarget}
                    onChange={(e) => handleChange("objectiveTarget", e.target.value)}
                    placeholder="Monster name, item name, or area..."
                    required
                  />
                  {formData.objectiveType === "Defeat" && (
                    <button
                      type="button"
                      onClick={() => setMonsterPickerOpen(true)}
                      className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 text-xs font-bold text-red-300 hover:bg-red-500/20"
                    >
                      <Skull className="h-3.5 w-3.5" /> Pick Monster
                    </button>
                  )}
                  {formData.objectiveType === "Collect" && (
                    <button
                      type="button"
                      onClick={() => setTargetItemPickerOpen(true)}
                      className="flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-amber-300 hover:bg-amber-500/20"
                    >
                      <Package className="h-3.5 w-3.5" /> Pick Item
                    </button>
                  )}
                </div>
              </FormField>

              <FormField label="Target Quantity" htmlFor="targetAmount" required>
                <TextInput
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleChange("targetAmount", Math.max(1, Number(e.target.value)))}
                  min="1"
                  required
                />
              </FormField>

              <FormField label="Objective Location Hint" htmlFor="objectiveLocation">
                <TextInput
                  id="objectiveLocation"
                  value={formData.objectiveLocation}
                  onChange={(e) => handleChange("objectiveLocation", e.target.value)}
                  placeholder="e.g., Deep in Forest Clearing"
                />
              </FormField>
            </div>
          </FormSection>

          {/* Rewards Section */}
          <FormSection title="Rewards & Loot Config" icon={Gift}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField label="Experience Points" htmlFor="rewardExperience">
                <TextInput
                  id="rewardExperience"
                  type="number"
                  value={formData.rewardExperience}
                  onChange={(e) => handleChange("rewardExperience", Math.max(0, Number(e.target.value)))}
                  min="0"
                />
              </FormField>

              <FormField label="Gold Reward" htmlFor="rewardGold">
                <TextInput
                  id="rewardGold"
                  type="number"
                  value={formData.rewardGold}
                  onChange={(e) => handleChange("rewardGold", Math.max(0, Number(e.target.value)))}
                  min="0"
                />
              </FormField>

              <FormField label="Gems Reward" htmlFor="rewardGems">
                <TextInput
                  id="rewardGems"
                  type="number"
                  value={formData.rewardGems}
                  onChange={(e) => handleChange("rewardGems", Math.max(0, Number(e.target.value)))}
                  min="0"
                />
              </FormField>
            </div>

            {/* Item Rewards */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70">Item Rewards</h4>
                <button
                  type="button"
                  onClick={() => handleChange("rewardItems", [...formData.rewardItems, { itemId: null, quantity: 1 }])}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300 hover:bg-green-500/20"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Item Reward
                </button>
              </div>

              {formData.rewardItems.length === 0 ? (
                <p className="text-xs text-white/40 italic">No item rewards configured.</p>
              ) : (
                <div className="space-y-2">
                  {formData.rewardItems.map((item, idx) => {
                    const picked = items.find((i) => i.itemId === item.itemId);
                    return (
                      <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveItemRewardIndex(idx);
                            setItemPickerOpen(true);
                          }}
                          className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white hover:border-[#ffc032]/40"
                        >
                          {picked ? (
                            <div className="flex items-center gap-2 truncate">
                              <img src={picked.iconUrl || "/images/demo.jpg"} alt={picked.name} className="h-5 w-5 rounded object-cover" />
                              <span className="truncate">{picked.name}</span>
                              <span className="text-white/40">#{picked.itemId}</span>
                            </div>
                          ) : (
                            <span className="text-white/40">Click to select reward item...</span>
                          )}
                          <Package className="h-3.5 w-3.5 text-[#ffc032]" />
                        </button>

                        <div className="w-24">
                          <TextInput
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...formData.rewardItems];
                              updated[idx].quantity = Math.max(1, Number(e.target.value));
                              handleChange("rewardItems", updated);
                            }}
                            min="1"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.rewardItems.filter((_, i) => i !== idx);
                            handleChange("rewardItems", updated);
                          }}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </FormSection>
        </div>

        {/* Live Player Quest Journal Preview */}
        <aside className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#ffc032]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quest Book Preview</h3>
              </div>
              <span className="rounded bg-[#ffc032]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#ffc032]">
                {formData.type}
              </span>
            </div>

            {/* In-Game Quest Card */}
            <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                  <span>{formData.mapName}</span>
                  <span>Req. Lv.{formData.requiredLevel}</span>
                </div>
                <h4 className="text-base font-bold text-[#ffc032]">{formData.title || "Untitled Quest"}</h4>
              </div>

              {formData.description && (
                <p className="text-xs leading-relaxed text-white/60 italic border-l-2 border-[#ffc032]/40 pl-2.5">
                  {formData.description}
                </p>
              )}

              {/* Objective Tracker Box */}
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">Objective Tracker</span>
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>
                    {formData.objectiveType}: {formData.objectiveTarget || "Target"}
                  </span>
                  <span className="text-red-400 font-mono">0 / {formData.targetAmount}</span>
                </div>
                {formData.objectiveLocation && (
                  <p className="text-[10px] text-white/40">Location: {formData.objectiveLocation}</p>
                )}
              </div>

              {/* Rewards Summary */}
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 block">Rewards</span>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  {formData.rewardExperience > 0 && <span className="text-cyan-300">+{formData.rewardExperience} XP</span>}
                  {formData.rewardGold > 0 && <span className="text-amber-300">+{formData.rewardGold} Gold</span>}
                  {formData.rewardGems > 0 && <span className="text-cyan-400">+{formData.rewardGems} Gems</span>}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <FormActions
        onCancel={onCancel}
        submitLabel={mode === "create" ? "Create Quest" : "Update Quest"}
        loadingLabel={mode === "create" ? "Creating..." : "Updating..."}
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}
