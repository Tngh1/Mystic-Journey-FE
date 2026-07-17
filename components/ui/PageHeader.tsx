"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

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
  iconGradient?: string;
  stats?: PageHeaderStat[];
  actions?: PageHeaderAction[];
}

const TONE_TEXT: Record<NonNullable<PageHeaderStat["tone"]>, string> = {
  default: "text-white",
  primary: "text-[#ffc032]",
  success: "text-green-400",
  warning: "text-orange-400",
  danger: "text-red-400",
};

const TONE_ICON: Record<NonNullable<PageHeaderStat["tone"]>, string> = {
  default: "bg-white/5 text-white/70",
  primary: "bg-[#ffc032]/10 text-[#ffc032]",
  success: "bg-green-500/10 text-green-400",
  warning: "bg-orange-500/10 text-orange-400",
  danger: "bg-red-500/10 text-red-400",
};

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconGradient = "from-[#ffc032] to-[#ff8c00]",
  stats,
  actions,
}: PageHeaderProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shrink-0 shadow-lg shadow-black/20`}
          >
            <Icon className="w-7 h-7 text-[#111]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/50 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action, idx) => {
              const variant = action.variant ?? "primary";
              const variantClass =
                variant === "primary"
                  ? "bg-[#ffc032] text-[#111] hover:bg-[#ffd04c]"
                  : variant === "secondary"
                    ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5";
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`inline-flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClass}`}
                >
                  {ActionIcon && <ActionIcon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {stats.map((stat, idx) => {
            const tone = stat.tone ?? "default";
            const StatIcon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#111111] border border-white/10 rounded-xl px-4 py-3.5 flex items-center gap-3 hover:border-white/20 transition-colors"
              >
                {StatIcon && (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TONE_ICON[tone]}`}>
                    <StatIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/50 truncate">{stat.label}</p>
                  <p className={`text-lg font-bold truncate ${TONE_TEXT[tone]}`}>{stat.value}</p>
                  {stat.hint && (
                    <p className="text-[10px] text-white/40 truncate mt-0.5">{stat.hint}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}