"use client";

import { useEffect, useMemo, useState } from "react";
import { Skull, Search, X, Check } from "lucide-react";
import { getAll as getAllMonsters } from "@/lib/api/monsters";
import type { MonsterResponse } from "@/lib/types";

interface MonsterPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (monster: MonsterResponse) => void;
  selectedMonsterName?: string | null;
  title?: string;
  subtitle?: string;
  includeType?: string;
  excludeType?: string;
}

export default function MonsterPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedMonsterName,
  title = "Select Monster Target",
  subtitle = "Pick a monster from the list",
  includeType,
  excludeType,
}: MonsterPickerModalProps) {
  const [monsters, setMonsters] = useState<MonsterResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    if (!isOpen) return;
    getAllMonsters(1, 500)
      .then((res) => {
        let items = res.items ?? [];
        if (includeType) items = items.filter(m => m.type === includeType);
        if (excludeType) items = items.filter(m => m.type !== excludeType);
        setMonsters(items);
      })
      .catch(() => setMonsters([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const filteredMonsters = useMemo(() => {
    return monsters.filter((m) => {
      const matchesSearch =
        !search.trim() ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        String(m.monsterId).includes(search);
      const matchesType = selectedType === "All" || m.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [monsters, search, selectedType]);

  const monsterTypes = useMemo(() => {
    const types = Array.from(new Set(monsters.map((m) => m.type))).filter(Boolean);
    return ["All", ...types];
  }, [monsters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Skull className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
              <p className="text-xs text-white/50">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="space-y-3 border-b border-white/10 bg-[#161616] p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search monster by name or ID..."
              className="h-10 w-full rounded-xl border border-white/10 bg-[#0d0d0d] pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-red-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            {!includeType && monsterTypes.length > 2 && monsterTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
                  selectedType === type
                    ? "bg-red-500 text-white font-semibold"
                    : "bg-white/[0.04] text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Monster Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center gap-3 text-white/40">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              <span>Loading monsters catalog...</span>
            </div>
          ) : filteredMonsters.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-white/40">
              <Skull className="h-10 w-10 text-white/20" />
              <p className="text-sm font-semibold">No monsters found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {filteredMonsters.map((monster) => {
                const isSelected = selectedMonsterName === monster.name;

                return (
                  <div
                    key={monster.monsterId}
                    onClick={() => {
                      onSelect(monster);
                      onClose();
                    }}
                    className={`group relative flex cursor-pointer items-center gap-3.5 rounded-xl border p-3 transition-all hover:scale-[1.01] ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10">
                      {monster.imageUrl ? (
                        <img
                          src={monster.imageUrl}
                          alt={monster.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <Skull className="h-6 w-6 text-red-400" />
                      )}
                    </div>

                    {/* Monster details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold uppercase">
                        <span>Lv. {monster.level}</span>
                        <span className="text-white/40">• {monster.type}</span>
                      </div>
                      <h4 className="truncate text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                        {monster.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
                        <span>HP: {monster.maxHp.toLocaleString()}</span>
                        <span>ATK: {monster.atk}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#161616] px-6 py-3 text-xs text-white/40">
          <span>Showing {filteredMonsters.length} of {monsters.length} monsters</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
