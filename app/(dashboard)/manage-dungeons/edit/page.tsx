"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

const mockDungeon = {
  id: 1,
  name: "Goblin Cave",
  description: "A dark cave filled with goblins.",
  reqLevel: 5,
  energyCost: 10,
  maxPlayers: 4,
  isActive: true,
};

export default function EditDungeonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dungeonId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reqLevel: 1,
    energyCost: 10,
    maxPlayers: 4,
    isActive: true,
  });

  useEffect(() => {
    if (dungeonId) {
      setFormData({
        name: mockDungeon.name,
        description: mockDungeon.description,
        reqLevel: mockDungeon.reqLevel,
        energyCost: mockDungeon.energyCost,
        maxPlayers: mockDungeon.maxPlayers,
        isActive: mockDungeon.isActive,
      });
    }
  }, [dungeonId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating dungeon:", formData);
    router.push("/manage-dungeons");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-dungeons")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Dungeon</h1>
          <p className="text-white/50 text-sm">Update dungeon details (ID: {dungeonId})</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Dungeon Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter dungeon name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Required Level <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.reqLevel}
                onChange={(e) => handleChange("reqLevel", Number(e.target.value))}
                placeholder="1"
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Energy Cost <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.energyCost}
                onChange={(e) => handleChange("energyCost", Number(e.target.value))}
                placeholder="10"
                min="1"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Max Players <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.maxPlayers}
                onChange={(e) => handleChange("maxPlayers", Number(e.target.value))}
                placeholder="4"
                min="1"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter dungeon description (optional)"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
            />
            <label htmlFor="isActive" className="text-sm text-white/70">
              Dungeon is active and can be accessed
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-dungeons")}
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
