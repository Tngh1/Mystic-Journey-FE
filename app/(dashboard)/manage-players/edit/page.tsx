"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";

const PLAYER_CLASSES = [
  { value: "Knight", label: "Knight" },
  { value: "Mage", label: "Mage" },
  { value: "Archer", label: "Archer" },
  { value: "Rogue", label: "Rogue" },
  { value: "Priest", label: "Priest" },
];

const mockPlayer = {
  id: 1,
  displayName: "Hero123",
  email: "hero123@example.com",
  class: "Knight",
  level: 10,
  exp: 4500,
  gold: 1200.5,
  gems: 50,
  energy: 80,
  isBanned: false,
};

export default function EditPlayerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get("id");
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    class: "Knight",
    level: 1,
    exp: 0,
    gold: 0,
    gems: 0,
    energy: 0,
    isBanned: false,
  });

  useEffect(() => {
    if (playerId) {
      setFormData({
        displayName: mockPlayer.displayName,
        email: mockPlayer.email,
        class: mockPlayer.class,
        level: mockPlayer.level,
        exp: mockPlayer.exp,
        gold: mockPlayer.gold,
        gems: mockPlayer.gems,
        energy: mockPlayer.energy,
        isBanned: mockPlayer.isBanned,
      });
    }
  }, [playerId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating player:", formData);
    router.push("/manage-players");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/manage-players")}
          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Player</h1>
          <p className="text-white/50 text-sm">Update player details (ID: {playerId})</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                placeholder="Enter display name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="player@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Class <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.class}
                onChange={(e) => handleChange("class", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              >
                {PLAYER_CLASSES.map((cls) => (
                  <option key={cls.value} value={cls.value} className="bg-[#1a1a1a]">
                    {cls.label}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                EXP
              </label>
              <input
                type="number"
                value={formData.exp}
                onChange={(e) => handleChange("exp", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Gold
              </label>
              <input
                type="number"
                value={formData.gold}
                onChange={(e) => handleChange("gold", Number(e.target.value))}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Gems
              </label>
              <input
                type="number"
                value={formData.gems}
                onChange={(e) => handleChange("gems", Number(e.target.value))}
                placeholder="0"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/80">
                Energy
              </label>
              <input
                type="number"
                value={formData.energy}
                onChange={(e) => handleChange("energy", Number(e.target.value))}
                placeholder="100"
                min="0"
                max="100"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isBanned"
              checked={formData.isBanned}
              onChange={(e) => handleChange("isBanned", e.target.checked)}
              className="w-5 h-5 rounded border-white/20 bg-white/5 text-red-400 focus:ring-red-400 focus:ring-offset-0"
            />
            <label htmlFor="isBanned" className="text-sm text-red-400">
              Ban this player account
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.push("/manage-players")}
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
