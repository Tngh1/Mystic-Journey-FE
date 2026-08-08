"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, getDungeonSpawns, addDungeonSpawn, removeDungeonSpawn, updateDungeonSpawn, DungeonConfigResponse, getDungeonChestItems, addDungeonChestItem, updateDungeonChestItem, removeDungeonChestItem } from "@/lib/api/dungeons";
import type { MonsterSpawnResponse, MonsterResponse, ChestItemResponse, ItemResponse } from "@/lib/types";
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from "@/lib/utils/swal";
import { Save, Loader2, Swords, Skull, Plus, Trash2, Edit2, Gift } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, TextArea, Checkbox } from "@/components/form/FormInput";
import MonsterPickerModal from "@/components/ui/MonsterPickerModal";
import ItemPickerModal from "@/components/ui/ItemPickerModal";

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
    type: "Normal",
    levelRequirement: 1,
    maxMembers: 4,
    difficulty: 1,
    recommendedPower: 0,
    energyCost: 10,
    chestId: 0,
    isActive: true,
  });

  const [initialSpawns, setInitialSpawns] = useState<MonsterSpawnResponse[]>([]);
  const [spawns, setSpawns] = useState<MonsterSpawnResponse[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bossPickerOpen, setBossPickerOpen] = useState(false);

  const [initialChestItems, setInitialChestItems] = useState<ChestItemResponse[]>([]);
  const [chestItems, setChestItems] = useState<ChestItemResponse[]>([]);
  const [itemPickerOpen, setItemPickerOpen] = useState(false);

  const loadDungeonData = useCallback(() => {
    if (!dungeonId) return;
    setFetching(true);
    Promise.all([
      getById(Number(dungeonId)),
      getDungeonSpawns(Number(dungeonId)),
      getDungeonChestItems(Number(dungeonId))
    ])
      .then(([d, s, items]) => {
        setFormData({
          name: d.name,
          description: d.description || "",
          type: d.type || "Normal",
          levelRequirement: d.levelRequirement,
          maxMembers: d.maxMembers,
          difficulty: d.difficulty,
          recommendedPower: d.recommendedPower,
          energyCost: d.energyCost,
          chestId: d.chestId || 0,
          isActive: d.isActive,
        });
        setInitialSpawns(s);
        setSpawns(s);
        setInitialChestItems(items);
        setChestItems(items);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load dungeon");
      })
      .finally(() => setFetching(false));
  }, [dungeonId]);

  useEffect(() => {
    loadDungeonData();
  }, [loadDungeonData]);

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
        type: formData.type,
        levelRequirement: formData.levelRequirement,
        maxMembers: formData.maxMembers,
        difficulty: formData.difficulty,
        recommendedPower: formData.recommendedPower,
        energyCost: formData.energyCost,
        chestId: formData.chestId || undefined,
        isActive: formData.isActive,
      });

      // Diff spawns and sync
      const spawnsToRemove = initialSpawns.filter(init => !spawns.some(curr => curr.monsterSpawnId === init.monsterSpawnId));
      const spawnsToAdd = spawns.filter(curr => curr.monsterSpawnId < 0);
      const spawnsToUpdate = spawns.filter(curr => {
        if (curr.monsterSpawnId < 0) return false;
        const init = initialSpawns.find(i => i.monsterSpawnId === curr.monsterSpawnId);
        return init && (init.spawnCount !== curr.spawnCount || init.respawnSeconds !== curr.respawnSeconds);
      });

      for (const s of spawnsToRemove) {
        await removeDungeonSpawn(s.monsterSpawnId);
      }
      for (const s of spawnsToAdd) {
        await addDungeonSpawn({
          monsterId: s.monsterId,
          mapName: s.mapName || formData.name || "Dungeon",
          spawnCount: s.spawnCount,
          respawnSeconds: s.respawnSeconds,
          dungeonId: s.dungeonId ?? undefined,
          isActive: true,
        });
      }
      for (const s of spawnsToUpdate) {
        await updateDungeonSpawn(s.monsterSpawnId, {
          spawnCount: s.spawnCount,
          respawnSeconds: s.respawnSeconds,
        });
      }

      // Diff chest items and sync
      const itemsToRemove = initialChestItems.filter(init => !chestItems.some(curr => curr.chestItemId === init.chestItemId));
      const itemsToAdd = chestItems.filter(curr => curr.chestItemId < 0);
      const itemsToUpdate = chestItems.filter(curr => {
        if (curr.chestItemId < 0) return false;
        const init = initialChestItems.find(i => i.chestItemId === curr.chestItemId);
        return init && (init.quantityMin !== curr.quantityMin || init.quantityMax !== curr.quantityMax || init.dropRate !== curr.dropRate || init.isGuaranteed !== curr.isGuaranteed);
      });

      for (const i of itemsToRemove) {
        await removeDungeonChestItem(Number(dungeonId), i.chestItemId);
      }
      for (const i of itemsToAdd) {
        await addDungeonChestItem(Number(dungeonId), {
          itemId: i.itemId,
          quantityMin: i.quantityMin,
          quantityMax: i.quantityMax,
          dropRate: i.dropRate,
          isGuaranteed: i.isGuaranteed,
        });
      }
      for (const i of itemsToUpdate) {
        await updateDungeonChestItem(Number(dungeonId), i.chestItemId, {
          itemId: i.itemId,
          quantityMin: i.quantityMin,
          quantityMax: i.quantityMax,
          dropRate: i.dropRate,
          isGuaranteed: i.isGuaranteed,
        });
      }

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

  const handleRemoveMonster = async (spawnId: number, monsterName: string) => {
    const regularSpawns = spawns.filter((s) => s.monster.type !== "Boss");
    if (regularSpawns.length <= 1) {
      await showErrorAlert("Action Denied", "A dungeon must have at least one regular monster.");
      return;
    }

    const confirmed = await showConfirmAlert(
      "Remove Monster?",
      `Are you sure you want to remove ${monsterName} from this dungeon?`
    );
    if (!confirmed) return;
    setSpawns(prev => prev.filter(s => s.monsterSpawnId !== spawnId));
  };

  const handleSwapBoss = async (monster: MonsterResponse) => {
    if (!dungeonId) return;
    setSpawns(prev => {
      const withoutBoss = prev.filter(s => s.monster.type !== "Boss");
      const newBossSpawn: MonsterSpawnResponse = {
        monsterSpawnId: -Date.now(),
        monsterId: monster.monsterId,
        monsterName: monster.name,
        monsterType: monster.type,
        mapName: formData.name || "Dungeon",
        regionName: "",
        location: "",
        spawnCount: 1,
        respawnSeconds: 0,
        dungeonId: Number(dungeonId),
        dungeonName: formData.name,
        isDungeonRepeatable: false,
        isActive: true,
        monster: monster
      };
      return [...withoutBoss, newBossSpawn];
    });
  };

  const handleUpdateSpawnCount = async (spawnId: number, count: number) => {
    setSpawns(prev => prev.map(s => s.monsterSpawnId === spawnId ? { ...s, spawnCount: count } : s));
  };

  const handleRemoveChestItem = async (chestItemId: number, itemName: string) => {
    if (chestItems.length <= 1) {
      await showErrorAlert("Action Denied", "A dungeon's chest must have at least one item.");
      return;
    }
    const confirmed = await showConfirmAlert(
      "Remove Item?",
      `Are you sure you want to remove ${itemName} from this dungeon's chest?`
    );
    if (!confirmed) return;
    setChestItems(prev => prev.filter(i => i.chestItemId !== chestItemId));
  };

  const handleUpdateChestItem = (chestItemId: number, field: keyof ChestItemResponse, value: number | boolean) => {
    setChestItems(prev => prev.map(i => i.chestItemId === chestItemId ? { ...i, [field]: value } : i));
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
      </FormSection>

      <FormSection title="Dungeon Boss" icon={Skull}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spawns.some((s) => s.monster.type === "Boss") ? (
              spawns
                .filter((s) => s.monster.type === "Boss")
                .map((s) => (
                  <div key={s.monsterSpawnId} className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors group cursor-pointer" onClick={() => setBossPickerOpen(true)} title="Click to swap boss">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {s.monster.imageUrl ? (
                          <img src={s.monster.imageUrl} alt={s.monster.name} className="w-full h-full object-cover" />
                        ) : (
                          <Skull className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-red-400 truncate">{s.monster.name}</p>
                        <p className="text-xs text-red-500/70">
                          Lvl {s.monster.level} • Boss
                        </p>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg text-white/40 group-hover:text-red-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </div>
                  </div>
                ))
            ) : (
              <div 
                className="col-span-full py-8 flex flex-col items-center justify-center gap-3 text-white/40 border border-dashed border-red-500/30 bg-red-500/5 rounded-xl cursor-pointer hover:bg-red-500/10 hover:text-white transition-all"
                onClick={() => setBossPickerOpen(true)}
              >
                <Skull className="w-8 h-8 text-red-500/50" />
                <p>Click to select a Boss</p>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection title="Regular Monsters" icon={Swords}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Types used: {spawns.filter((s) => s.monster.type !== "Boss").length}/5
            </span>
            {spawns.filter((s) => s.monster.type !== "Boss").length < 5 && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Monster
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spawns
              .filter((s) => s.monster.type !== "Boss")
              .map((s) => (
              <div key={s.monsterSpawnId} className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-[#111] hover:border-white/20 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {s.monster.imageUrl ? (
                        <img src={s.monster.imageUrl} alt={s.monster.name} className="w-full h-full object-cover" />
                      ) : (
                        <Skull className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">{s.monster.name}</p>
                      <p className="text-xs text-gray-400">
                        Lvl {s.monster.level}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMonster(s.monsterSpawnId, s.monster.name)}
                    disabled={spawns.filter((ms) => ms.monster.type !== "Boss").length <= 1}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-20 disabled:hover:text-white/40 disabled:hover:bg-transparent"
                    title={spawns.filter((ms) => ms.monster.type !== "Boss").length <= 1 ? "Minimum 1 regular monster required" : "Remove Monster"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Quantity Input */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-400 flex-1">Quantity (Max 10):</span>
                  <input
                    type="number"
                    defaultValue={s.spawnCount}
                    onBlur={(e) => {
                      const val = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                      e.target.value = val.toString();
                      if (val !== s.spawnCount) handleUpdateSpawnCount(s.monsterSpawnId, val);
                    }}
                    min="1"
                    max="10"
                    className="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
            ))}
            {spawns.filter((s) => s.monster.type !== "Boss").length === 0 && (
              <div className="col-span-full py-8 text-center text-white/40 border border-dashed border-white/10 rounded-xl">
                No regular monsters added to this dungeon yet.
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection title="Dungeon Drops (Chest Items)" icon={Gift}>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              Total items: {chestItems.length}
            </span>
            <button
              type="button"
              onClick={() => setItemPickerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Drop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chestItems.map((item) => (
              <div key={item.chestItemId} className="flex flex-col gap-3 p-4 rounded-xl border border-white/10 bg-[#111] hover:border-white/20 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden p-1">
                      {item.itemIconUrl ? (
                        <img src={item.itemIconUrl} alt={item.itemName || "Item"} className="w-full h-full object-contain" />
                      ) : (
                        <Gift className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate" title={item.itemName || ""}>{item.itemName}</p>
                      <p className="text-xs text-gray-400">
                        {item.itemRarity || "Unknown Rarity"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChestItem(item.chestItemId, item.itemName || "Item")}
                    disabled={chestItems.length <= 1}
                    className="p-2 shrink-0 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-20 disabled:hover:text-white/40 disabled:hover:bg-transparent"
                    title={chestItems.length <= 1 ? "Minimum 1 item required" : "Remove Item"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Min Qty</span>
                    <input
                      type="number"
                      defaultValue={item.quantityMin}
                      onBlur={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        e.target.value = val.toString();
                        if (val !== item.quantityMin) handleUpdateChestItem(item.chestItemId, "quantityMin", val);
                      }}
                      min="1"
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Max Qty</span>
                    <input
                      type="number"
                      defaultValue={item.quantityMax}
                      onBlur={(e) => {
                        const val = Math.max(item.quantityMin, parseInt(e.target.value) || 1);
                        e.target.value = val.toString();
                        if (val !== item.quantityMax) handleUpdateChestItem(item.chestItemId, "quantityMax", val);
                      }}
                      min="1"
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 mt-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Drop Rate (%)</span>
                    <input
                      type="number"
                      defaultValue={item.dropRate}
                      disabled={item.isGuaranteed}
                      step="0.1"
                      onBlur={(e) => {
                        let val = parseFloat(e.target.value) || 0;
                        val = Math.max(0, Math.min(100, val));
                        e.target.value = val.toString();
                        if (val !== item.dropRate) handleUpdateChestItem(item.chestItemId, "dropRate", val);
                      }}
                      min="0"
                      max="100"
                      className={`bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-white/20 ${item.isGuaranteed ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between mt-1 px-1">
                     <span className="text-xs text-gray-400">Guaranteed Drop?</span>
                     <Checkbox 
                       checked={item.isGuaranteed} 
                       onChange={(e) => handleUpdateChestItem(item.chestItemId, "isGuaranteed", e.target.checked)} 
                     />
                  </div>
                </div>
              </div>
            ))}
            {chestItems.length === 0 && (
              <div className="col-span-full py-8 text-center text-white/40 border border-dashed border-white/10 rounded-xl">
                No items in this dungeon's chest yet.
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-dungeons")}
        submitLabel="Update Dungeon"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />

      {/* Monster Picker */}
      <MonsterPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        excludeType="Boss"
        subtitle="Pick a regular monster for the dungeon"
        onSelect={(monster) => {
          if (monster.type === "Boss") {
            showErrorAlert("Invalid Type", "Cannot add a Boss as a regular monster.");
            return;
          }
          if (spawns.some(s => s.monsterId === monster.monsterId)) {
            showErrorAlert("Duplicate Monster", "This monster is already in the dungeon.");
            return;
          }
          // Note: we can use monster object directly since the picker provides it
          const newSpawn: MonsterSpawnResponse = {
            monsterSpawnId: -Date.now(),
            monsterId: monster.monsterId,
            monsterName: monster.name,
            monsterType: monster.type,
            mapName: formData.name || "Dungeon",
            regionName: "", location: "", spawnCount: 1, respawnSeconds: 0,
            dungeonId: Number(dungeonId), dungeonName: formData.name, 
            isDungeonRepeatable: false, isActive: true,
            monster: monster
          };
          setSpawns(prev => [...prev, newSpawn]);
          setPickerOpen(false);
        }}
      />

      <MonsterPickerModal
        isOpen={bossPickerOpen}
        onClose={() => setBossPickerOpen(false)}
        includeType="Boss"
        subtitle="Pick a Boss for the dungeon"
        onSelect={(monster) => {
          if (monster.type !== "Boss") {
            showErrorAlert("Invalid Type", "Please select a Boss type monster.");
            return;
          }
          handleSwapBoss(monster);
          setBossPickerOpen(false);
        }}
        title="Select Boss"
      />

      <ItemPickerModal
        isOpen={itemPickerOpen}
        onClose={() => setItemPickerOpen(false)}
        onSelect={(item: ItemResponse) => {
          if (chestItems.some(i => i.itemId === item.itemId)) {
            showErrorAlert("Duplicate Item", "This item is already in the drop list.");
            return;
          }
          const newItem: ChestItemResponse = {
            chestItemId: -Date.now(),
            chestId: 0,
            itemId: item.itemId,
            itemName: item.name,
            itemIconUrl: item.iconUrl || undefined,
            itemRarity: item.rarity || undefined,
            quantityMin: 1,
            quantityMax: 1,
            dropRate: 10,
            isGuaranteed: false
          };
          setChestItems(prev => [...prev, newItem]);
          setItemPickerOpen(false);
        }}
      />
    </form>
  );
}