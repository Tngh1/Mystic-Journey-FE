"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import Panel from "@/components/ui/Panel";

/* The board a manage-* screen hangs at the top: a gilt sigil plate, the title,
   and the counts on steel tiles beneath.

   The old version had a `rounded-2xl` gradient sigil, `iconGradient` as a prop
   (a per-page gradient string — five ways to be off-system), and five tones each
   built from a raw hex. Tones now map to heraldic cloth, and each one carries a
   plate beside the number so the reading never rests on colour alone.

   The tiles are `plate`, not the Panel default: the admin keep is rolled steel on
   a forge floor, and a wood tile there was the last of the wiki's furniture left
   in the dashboard. */

export interface PageHeaderStat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  hint?: string;
}

export interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  stats?: PageHeaderStat[];
  actions?: PageHeaderAction[];
}

type Tone = NonNullable<PageHeaderStat["tone"]>;

/* Cloth for the plate, ink for the number. Both clear 4.5:1 on wood. */
const TONE_PLATE: Record<Tone, string> = {
  default: "bg-iron text-parchment",
  primary: "bg-accent text-on-accent",
  success: "bg-heraldry-pine text-parchment",
  warning: "bg-heraldry-ember text-parchment",
  danger: "bg-heraldry-crimson text-parchment",
};

const TONE_VALUE: Record<Tone, string> = {
  default: "text-fg",
  primary: "text-accent",
  success: "text-success",
  warning: "text-accent-deep",
  danger: "text-danger",
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  stats,
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="pixel-bevel-gold flex h-14 w-14 shrink-0 items-center justify-center border-2 border-accent bg-accent">
            <Icon className="h-7 w-7 text-on-accent" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-fg">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 truncate text-sm text-fg-muted">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => {
              const variant = action.variant ?? "primary";
              const variantClass =
                variant === "primary"
                  ? "border-accent bg-accent text-on-accent hover:bg-accent-hover"
                  : variant === "secondary"
                    ? "border-black/60 bg-iron text-parchment hover:border-accent hover:text-accent"
                    : "border-transparent text-fg-muted hover:border-accent hover:text-accent";
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`pixel-press inline-flex h-11 cursor-pointer items-center gap-2 border-2 px-4 text-xs font-black uppercase tracking-[0.1em] shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClass}`}
                >
                  {ActionIcon && <ActionIcon className="h-4 w-4" aria-hidden="true" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const tone = stat.tone ?? "default";
            const StatIcon = stat.icon;
            return (
              <Panel
                key={stat.label}
                material="plate"
                className="flex items-center gap-3 px-3 py-3"
              >
                {StatIcon && (
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black/60 shadow-sm ${TONE_PLATE[tone]}`}
                  >
                    <StatIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] uppercase tracking-[0.12em] text-parchment-dim">
                    {stat.label}
                  </p>
                  <p
                    className={`truncate text-lg font-bold tabular-nums ${TONE_VALUE[tone]}`}
                  >
                    {stat.value}
                  </p>
                  {stat.hint && (
                    <p className="mt-0.5 truncate text-[10px] text-parchment-dim">
                      {stat.hint}
                    </p>
                  )}
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
