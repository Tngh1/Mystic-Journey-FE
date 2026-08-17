"use client";

import React from "react";
import {
  Zap, Star, Shield, Ghost, Sparkles, Swords,
  Clock, Lock, Activity, Flame, Target, Layers, Quote,
} from "lucide-react";
import type { SkillResponse } from "@/lib/api/skills";
import { BookStatTable, BookPageTitle } from "@/components/ui/BookSpread";
import Banner from "@/components/ui/Banner";

// Renders the skill type icon reusable UI component.
// Returns the styled JSX element.
export function SkillTypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t === "active") return <Zap style={{ width: size, height: size }} />;
  if (t === "passive") return <Star style={{ width: size, height: size }} />;
  if (t === "buff") return <Shield style={{ width: size, height: size }} />;
  if (t === "debuff") return <Ghost style={{ width: size, height: size }} />;
  return <Sparkles style={{ width: size, height: size }} />;
}

// Renders the class icon reusable UI component.
// Returns the styled JSX element.
export function ClassIcon({ cls, size = 14 }: { cls: string; size?: number }) {
  const c = cls.toLowerCase();
  if (c === "knight") return <Shield style={{ width: size, height: size }} />;
  if (c === "archer") return <Swords style={{ width: size, height: size }} />;
  if (c === "mage") return <Sparkles style={{ width: size, height: size }} />;
  return <Star style={{ width: size, height: size }} />;
}

// Helper function executing format number.
// Processes input parameters and returns the calculated result.
function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toFixed(1).replace(/\.0$/, "");
}

// Renders the visual stat bar reusable UI component.
// Returns the styled JSX element.
function VisualStatBar({
  label,
  value,
  maxVal = 100,
  color,
  icon,
  suffix = "",
}: {
  label: string;
  value: number;
  maxVal?: number;
  color: "red" | "blue" | "green" | "purple";
  icon: React.ReactNode;
  suffix?: string;
}) {
  const percentage = Math.min(100, Math.max(5, (value / maxVal) * 100));

  // Helper function executing bg gradient.
  // Processes input parameters and returns the calculated result.
  const bgGradient = {
    red: "from-red-700 to-rose-500 border-red-900",
    blue: "from-sky-700 to-indigo-500 border-sky-900",
    green: "from-emerald-700 to-teal-400 border-emerald-900",
    purple: "from-purple-700 to-fuchsia-400 border-purple-900",
  }[color];

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="flex items-center gap-1 uppercase tracking-wider text-on-parchment/80">
          {icon}
          {label}
        </span>
        <span className="font-black tabular-nums text-on-parchment">
          {formatNumber(value)}{suffix}
        </span>
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

// Renders the skill leaf reusable UI component.
// Returns the styled JSX element.
export default function SkillLeaf({ skill }: { skill: SkillResponse }) {
  // Helper function executing type banner tone.
  // Processes input parameters and returns the calculated result.
  const typeBannerTone = {
    Active: "crimson",
    Passive: "arcane",
    Buff: "gold",
    Debuff: "royal",
  }[skill.type] as "crimson" | "arcane" | "gold" | "royal" ?? "royal";

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <BookPageTitle as="h2" align="center" eyebrow={`${skill.type} Skill · ${skill.classRequirement}`}>
          {skill.name}
        </BookPageTitle>

        <div className="my-2 flex flex-col items-center">
          <div className="relative flex h-16 w-16 items-center justify-center bg-wood-dark border-2 shadow-md group">
            <div className="absolute -inset-0.5 rounded-sm opacity-50 blur-sm animate-rarity-pulse bg-amber-500/60" />
            <div className="relative flex h-full w-full items-center justify-center bg-wood-dark p-1 border border-accent-deep/40 overflow-hidden">
              <span className="text-amber-300 transition-transform duration-300 group-hover:scale-110">
                <SkillTypeIcon type={skill.type} size={32} />
              </span>
            </div>
          </div>

          <div className="mt-1.5">
            <Banner tone={typeBannerTone} pennant={false}>
              Level {skill.unlockLevel} Required
            </Banner>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-2.5 py-1">
        {skill.description && (
          <div className="relative mx-auto max-w-[48ch] border-y border-wood/30 py-1.5 px-3 bg-wood/5">
            <Quote className="absolute top-0.5 left-0.5 h-3 w-3 text-on-parchment/20 rotate-180" />
            <p className="text-center text-[11px] italic leading-snug text-on-parchment/90 font-serif">
              &ldquo;{skill.description}&rdquo;
            </p>
            <Quote className="absolute bottom-0.5 right-0.5 h-3 w-3 text-on-parchment/20" />
          </div>
        )}

        <div className="rounded border border-wood/40 bg-wood/5 p-2 space-y-1.5">
          <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-parchment/70">
            Skill Overview
          </h3>
          {skill.baseDamage > 0 && (
            <VisualStatBar
              label="Base Damage"
              value={skill.baseDamage}
              maxVal={250}
              color="red"
              icon={<Flame className="h-3 w-3 text-red-700" />}
            />
          )}
          {skill.cooldownSeconds > 0 && (
            <VisualStatBar
              label="Cooldown"
              value={skill.cooldownSeconds}
              maxVal={60}
              color="blue"
              icon={<Clock className="h-3 w-3 text-sky-700" />}
              suffix="s"
            />
          )}
          {skill.corruptionCost > 0 && (
            <VisualStatBar
              label="Corruption Cost"
              value={skill.corruptionCost}
              maxVal={100}
              color="purple"
              icon={<Activity className="h-3 w-3 text-purple-700" />}
            />
          )}
        </div>

        <div>
          <BookStatTable
            rows={[
              {
                label: "Type",
                value: skill.type,
                icon: <SkillTypeIcon type={skill.type} size={14} />,
              },
              {
                label: "Class Req.",
                value: skill.classRequirement,
                icon: <ClassIcon cls={skill.classRequirement} size={14} />,
              },
              {
                label: "Damage Type",
                value: skill.damageType,
                icon: <Swords className="h-3.5 w-3.5 text-rose-700" aria-hidden="true" />,
              },
              {
                label: "Target Type",
                value: skill.targetType,
                icon: <Target className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />,
              },
              ...(skill.damagePerLevel > 0
                ? [{ label: "Growth / Level", value: `+${formatNumber(skill.damagePerLevel)} Dmg`, icon: <Layers className="h-3.5 w-3.5" aria-hidden="true" /> }]
                : []),
              ...(skill.unlockLevel > 1
                ? [{ label: "Unlock Level", value: `Level ${skill.unlockLevel}`, icon: <Lock className="h-3.5 w-3.5" aria-hidden="true" /> }]
                : []),
            ]}
          />
        </div>
      </div>

      <div className="mt-auto border-t border-wood/30 pt-1 text-center text-[10px] tracking-wider text-on-parchment/50">
        Skill № {skill.skillId}
      </div>
    </div>
  );
}
