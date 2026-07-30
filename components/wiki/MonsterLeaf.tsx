"use client";

import React, { useState, useEffect } from "react";
import {
  Ghost, Swords, Shield, HeartPulse, Skull, Sparkles,
  Coins, Award, Package, Quote, Zap, Gauge,
} from "lucide-react";
import { getWikiMonster, type MonsterDetailResponse, type MonsterResponse } from "@/lib/api/wiki";
import { BookStatTable, BookPageTitle } from "@/components/ui/BookSpread";
import Banner from "@/components/ui/Banner";

export function MonsterTypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t === "boss") return <Skull style={{ width: size, height: size }} />;
  if (t === "elite") return <Swords style={{ width: size, height: size }} />;
  return <Ghost style={{ width: size, height: size }} />;
}

function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toFixed(1).replace(/\.0$/, "");
}

/* Compact visual stat bar component */
function VisualStatBar({
  label,
  value,
  maxVal = 100,
  color,
  icon,
}: {
  label: string;
  value: number;
  maxVal?: number;
  color: "red" | "blue" | "green" | "amber";
  icon: React.ReactNode;
}) {
  const percentage = Math.min(100, Math.max(5, (value / maxVal) * 100));

  const bgGradient = {
    red: "from-red-700 to-rose-500 border-red-900",
    blue: "from-sky-700 to-indigo-500 border-sky-900",
    green: "from-emerald-700 to-teal-400 border-emerald-900",
    amber: "from-amber-600 to-yellow-400 border-amber-800",
  }[color];

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="flex items-center gap-1 uppercase tracking-wider text-on-parchment/80">
          {icon}
          {label}
        </span>
        <span className="font-black tabular-nums text-on-parchment">{formatNumber(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden border border-wood/60 bg-wood-dark/40 p-0.5 shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${bgGradient} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function MonsterLeaf({ monster }: { monster: MonsterResponse }) {
  const [detail, setDetail] = useState<MonsterDetailResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    getWikiMonster(monster.monsterId)
      .then((res) => { if (mounted) setDetail(res); })
      .catch(() => {});
    return () => { mounted = false; };
  }, [monster.monsterId]);

  const typeTone = {
    Boss: "crimson",
    Elite: "gold",
    Regular: "royal",
    Normal: "royal",
  }[monster.type] as "crimson" | "gold" | "royal" ?? "royal";

  const drops = detail?.monsterDrops?.filter((d) => d.isActive) ?? [];

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Top Header */}
      <div>
        <BookPageTitle as="h2" align="center" eyebrow={`${monster.type} Monster`}>
          {monster.name}
        </BookPageTitle>

        {/* Showcase Plate & Pedestal */}
        <div className="my-2 flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center bg-wood-dark border-2 shadow-md group">
            <div
              className="absolute -inset-0.5 rounded-sm opacity-50 blur-sm animate-rarity-pulse"
              style={{
                backgroundColor: monster.type === "Boss" ? "#ef4444" : monster.type === "Elite" ? "#f97316" : "#60a5fa",
              }}
            />
            <div className="relative flex h-full w-full items-center justify-center bg-wood-dark p-1 border border-accent-deep/40 overflow-hidden">
              {monster.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={monster.imageUrl}
                  alt={monster.name}
                  className="pixelated h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-amber-300 transition-transform duration-300 group-hover:scale-110">
                  <MonsterTypeIcon type={monster.type} size={36} />
                </span>
              )}
            </div>
          </div>

          <div className="mt-1.5">
            <Banner tone={typeTone} pennant={false}>
              Level {monster.level}
            </Banner>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="min-h-0 flex-1 overflow-y-auto space-y-2.5 py-1">
        {/* Monster Description */}
        {monster.description && (
          <div className="relative mx-auto max-w-[48ch] border-y border-wood/30 py-1.5 px-3 bg-wood/5">
            <Quote className="absolute top-0.5 left-0.5 h-3 w-3 text-on-parchment/20 rotate-180" />
            <p className="text-center text-[11px] italic leading-snug text-on-parchment/90 font-serif">
              &ldquo;{monster.description}&rdquo;
            </p>
            <Quote className="absolute bottom-0.5 right-0.5 h-3 w-3 text-on-parchment/20" />
          </div>
        )}

        {/* Combat Overview Stat Bars */}
        <div className="rounded border border-wood/40 bg-wood/5 p-2 space-y-1.5">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-parchment/70">
            Combat Statistics
          </h3>
          <VisualStatBar
            label="Health Points"
            value={monster.maxHp}
            maxVal={5000}
            color="green"
            icon={<HeartPulse className="h-3 w-3 text-emerald-700" />}
          />
          <VisualStatBar
            label="Attack Power"
            value={monster.atk}
            maxVal={500}
            color="red"
            icon={<Swords className="h-3 w-3 text-red-700" />}
          />
          <VisualStatBar
            label="Defense Rating"
            value={monster.def}
            maxVal={300}
            color="blue"
            icon={<Shield className="h-3 w-3 text-sky-700" />}
          />
        </div>

        {/* Core Properties Table */}
        <div>
          <BookStatTable
            rows={[
              { label: "Type", value: monster.type, icon: <MonsterTypeIcon type={monster.type} size={14} /> },
              { label: "Level", value: `Level ${monster.level}`, icon: <Sparkles className="h-3.5 w-3.5 text-amber-600" /> },
              { label: "EXP Reward", value: formatNumber(monster.experienceReward), icon: <Award className="h-3.5 w-3.5 text-purple-700" /> },
              { label: "Gold Reward", value: `${formatNumber(monster.goldReward)} Gold`, icon: <Coins className="h-3.5 w-3.5 text-amber-600" /> },
              ...(monster.moveSpeed > 0 ? [{ label: "Move Speed", value: formatNumber(monster.moveSpeed), icon: <Gauge className="h-3.5 w-3.5" /> }] : []),
              ...(monster.attackSpeed > 0 ? [{ label: "Attack Speed", value: formatNumber(monster.attackSpeed), icon: <Zap className="h-3.5 w-3.5 text-amber-600" /> }] : []),
            ]}
          />
        </div>

        {/* Loot Drop Table */}
        {drops.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-parchment/70">
              <Package className="h-3 w-3" />
              Possible Drops
            </h3>
            <div className="border border-wood/40 bg-wood/5 divide-y divide-wood/20 text-[11px]">
              {drops.map((d) => (
                <div key={d.monsterDropId} className="flex items-center justify-between px-3 py-1">
                  <span className="font-bold text-on-parchment/90">{d.itemName || `Item #${d.itemId}`}</span>
                  <div className="flex items-center gap-2 text-[10px] text-on-parchment/65">
                    <span>{d.minQuantity === d.maxQuantity ? `${d.minQuantity}x` : `${d.minQuantity}-${d.maxQuantity}x`}</span>
                    <span className="font-black text-amber-900 bg-amber-500/20 px-1 py-0.2 border border-amber-600/30">
                      {d.isGuaranteed ? "100%" : `${(d.dropRate * 100).toFixed(0)}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Page Footer Folio */}
      <div className="mt-auto border-t border-wood/30 pt-1 text-center text-[10px] tracking-wider text-on-parchment/50">
        Monster № {monster.monsterId}
      </div>
    </div>
  );
}
