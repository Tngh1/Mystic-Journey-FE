"use client";

import React from "react";
import {
  Package, Sword, Shield, Heart, Sparkles, Box,
  Layers, HeartPulse, Zap, Gauge, Activity, Coins,
  Quote,
} from "lucide-react";
import type { ItemResponse } from "@/lib/api/items";
import { BookStatTable, BookPageTitle } from "@/components/ui/BookSpread";
import { getRarityMeta } from "@/lib/data/rarity";
import Banner from "@/components/ui/Banner";

// Renders the item type icon reusable UI component.
// Returns the styled JSX element.
export function ItemTypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t.includes("weapon")) return <Sword style={{ width: size, height: size }} />;
  if (t.includes("armor")) return <Shield style={{ width: size, height: size }} />;
  if (t.includes("consumable")) return <Heart style={{ width: size, height: size }} />;
  if (t.includes("quest")) return <Sparkles style={{ width: size, height: size }} />;
  if (t.includes("material")) return <Box style={{ width: size, height: size }} />;
  return <Package style={{ width: size, height: size }} />;
}

// Helper function executing type label.
// Processes input parameters and returns the calculated result.
export function typeLabel(type: string): string {
  return type === "QuestItem" ? "Quest Item" : type;
}

// Helper function executing has stat.
// Processes input parameters and returns the calculated result.
function hasStat(v: number | null | undefined): boolean {
  return typeof v === "number" && !Number.isNaN(v) && v !== 0;
}

// Helper function executing format number.
// Processes input parameters and returns the calculated result.
function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toFixed(1).replace(/\.0$/, "");
}

type StatRowData = { label: string; value: number | null | undefined; suffix?: string };

// Renders the visual stat bar reusable UI component.
// Returns the styled JSX element.
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

  // Helper function executing bg gradient.
  // Processes input parameters and returns the calculated result.
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

// Renders the leaf stat group reusable UI component.
// Returns the styled JSX element.
function LeafStatGroup({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: StatRowData[];
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-on-parchment/70" aria-hidden="true">{icon}</span>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-parchment/70">
          {title}
        </h3>
      </div>
      <BookStatTable
        rows={rows.map((r) => ({
          label: r.label,
          value: `${formatNumber(r.value)}${r.suffix ?? ""}`,
        }))}
      />
    </div>
  );
}

// Renders the item leaf reusable UI component.
// Returns the styled JSX element.
export default function ItemLeaf({ item }: { item: ItemResponse }) {
  const m = getRarityMeta(item.rarity);

  const totalHp = (item.baseHp ?? 0) + (item.bonusHp ?? 0);
  const totalAtk = (item.baseAtk ?? 0) + (item.bonusAtk ?? 0);
  const totalDef = (item.baseDef ?? 0) + (item.bonusDef ?? 0);

  const groups = [
    {
      key: "base",
      title: "Base Stats",
      icon: <Activity className="h-3.5 w-3.5" />,
      rows: ([
        { label: "HP", value: item.baseHp },
        { label: "ATK", value: item.baseAtk },
        { label: "DEF", value: item.baseDef },
      ] as StatRowData[]).filter((r) => hasStat(r.value)),
    },
    {
      key: "bonus",
      title: "Bonus Attributes",
      icon: <Zap className="h-3.5 w-3.5" />,
      rows: ([
        { label: "HP", value: item.bonusHp },
        { label: "ATK", value: item.bonusAtk },
        { label: "DEF", value: item.bonusDef },
      ] as StatRowData[]).filter((r) => hasStat(r.value)),
    },
    {
      key: "ratio",
      title: "Critical Ratios",
      icon: <Gauge className="h-3.5 w-3.5" />,
      rows: ([
        { label: "Crit Rate", value: item.bonusCritRate, suffix: "%" },
        { label: "Crit Damage", value: item.bonusCritDamage, suffix: "%" },
      ] as StatRowData[]).filter((r) => hasStat(r.value)),
    },
  ].filter((g) => g.rows.length > 0);

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <BookPageTitle as="h2" align="center" eyebrow={typeLabel(item.type)}>
          {item.name}
        </BookPageTitle>

        <div className="my-2 flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center bg-wood-dark border-2 shadow-md group">
            <div
              className="absolute -inset-0.5 rounded-sm opacity-50 blur-sm animate-rarity-pulse"
              style={{ backgroundColor: `${m.hex}88` }}
            />

            <div className="relative flex h-full w-full items-center justify-center bg-wood-dark p-1 border border-accent-deep/40 overflow-hidden">
              {item.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  className="pixelated h-full w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <span className="text-parchment transition-transform duration-300 group-hover:scale-110">
                  <ItemTypeIcon type={item.type} size={28} />
                </span>
              )}
            </div>
          </div>

          <div className="mt-1.5">
            <Banner tone={m.tone} pennant={false}>{m.label}</Banner>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-2.5 py-1">
        {item.description && (
          <div className="relative mx-auto max-w-[48ch] border-y border-wood/30 py-1.5 px-3 bg-wood/5">
            <Quote className="absolute top-0.5 left-0.5 h-3 w-3 text-on-parchment/20 rotate-180" />
            <p className="text-center text-[11px] italic leading-snug text-on-parchment/90 font-serif">
              &ldquo;{item.description}&rdquo;
            </p>
            <Quote className="absolute bottom-0.5 right-0.5 h-3 w-3 text-on-parchment/20" />
          </div>
        )}

        {(totalAtk > 0 || totalDef > 0 || totalHp > 0) && (
          <div className="rounded border border-wood/40 bg-wood/5 p-2 space-y-1.5">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-parchment/70">
              Attribute Overview
            </h3>
            {totalAtk > 0 && (
              <VisualStatBar label="Attack Power" value={totalAtk} maxVal={150} color="red" icon={<Sword className="h-3 w-3 text-red-700" />} />
            )}
            {totalDef > 0 && (
              <VisualStatBar label="Defense Rating" value={totalDef} maxVal={150} color="blue" icon={<Shield className="h-3 w-3 text-sky-700" />} />
            )}
            {totalHp > 0 && (
              <VisualStatBar label="Health Point" value={totalHp} maxVal={500} color="green" icon={<HeartPulse className="h-3 w-3 text-emerald-700" />} />
            )}
          </div>
        )}

        <div>
          <BookStatTable
            rows={[
              {
                label: "Type",
                value: typeLabel(item.type),
                icon: <ItemTypeIcon type={item.type} size={14} />,
              },
              ...(item.slot && item.slot !== "None"
                ? [{ label: "Equipment Slot", value: item.slot, icon: <Shield className="h-3.5 w-3.5" aria-hidden="true" /> }]
                : []),
              ...(item.maxStack > 1
                ? [{ label: "Max Stack", value: item.maxStack, icon: <Layers className="h-3.5 w-3.5" aria-hidden="true" /> }]
                : []),
              ...(hasStat(item.baseValue)
                ? [{ label: "Base Value", value: `${formatNumber(item.baseValue)} Gold`, icon: <Coins className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" /> }]
                : []),
            ]}
          />
        </div>

        {groups.length > 0 && (
          <div className="space-y-2.5">
            {groups.map((g) => (
              <LeafStatGroup
                key={g.key}
                title={g.title}
                icon={g.icon}
                rows={g.rows}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-wood/30 pt-1 text-center text-[10px] tracking-wider text-on-parchment/50">
        Entry № {item.itemId}
      </div>
    </div>
  );
}
