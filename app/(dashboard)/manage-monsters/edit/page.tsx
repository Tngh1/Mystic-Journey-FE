"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

const MONSTER_TYPES = [
  { value: "Normal", label: "Normal" },
  { value: "Elite", label: "Elite" },
  { value: "Boss", label: "Boss" },
];

// Mock data - in real app, fetch from API
const mockMonster = {
  id: 1,
  name: "Slime",
  type: "Normal",
  level: 1,
  maxHp: 50,
  atk: 5,
  def: 2,
  expReward: 10,
  goldReward: 5,
  isActive: true,
};

export default function EditMonsterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const monsterId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    name: "",
    type: "Normal",
    level: 1,
    maxHp: 100,
    atk: 10,
    def: 5,
    expReward: 10,
    goldReward: 5,
    isActive: true,
  });

  useEffect(() => {
    if (monsterId) {
      setFormData({
        name: mockMonster.name,
        type: mockMonster.type,
        level: mockMonster.level,
        maxHp: mockMonster.maxHp,
        atk: mockMonster.atk,
        def: mockMonster.def,
        expReward: mockMonster.expReward,
        goldReward: mockMonster.goldReward,
        isActive: mockMonster.isActive,
      });
    }
  }, [monsterId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating monster:", formData);
    router.push("/manage-monsters");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-monsters")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Monster</h1>
          <p className="text-white/50 text-sm">Update monster details (ID: {monsterId})</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Monster Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter monster name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Monster Type <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {MONSTER_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#1a1a1a]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Level <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.level}
                onChange={(e) => handleChange("level", Number(e.target.value))}
                placeholder="1"
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Max HP */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Max HP <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.maxHp}
                onChange={(e) => handleChange("maxHp", Number(e.target.value))}
                placeholder="100"
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* ATK */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Attack (ATK) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.atk}
                onChange={(e) => handleChange("atk", Number(e.target.value))}
                placeholder="10"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* DEF */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Defense (DEF) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.def}
                onChange={(e) => handleChange("def", Number(e.target.value))}
                placeholder="5"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* EXP Reward */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                EXP Reward <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.expReward}
                onChange={(e) => handleChange("expReward", Number(e.target.value))}
                placeholder="10"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            {/* Gold Reward */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Gold Reward <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.goldReward}
                onChange={(e) => handleChange("goldReward", Number(e.target.value))}
                placeholder="5"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="text-sm text-white/70">
              Monster is active and can spawn in game
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-monsters")}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
