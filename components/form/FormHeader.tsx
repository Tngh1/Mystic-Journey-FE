"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  badge?: string;
  badgeTone?: "default" | "primary" | "success" | "warning" | "danger";
  actions?: React.ReactNode;
}

const BADGE_TONE: Record<NonNullable<FormHeaderProps["badgeTone"]>, string> = {
  default: "bg-white/5 border-white/10 text-white/60",
  primary: "bg-[#ffc032]/10 border-[#ffc032]/30 text-[#ffc032]",
  success: "bg-green-500/10 border-green-500/30 text-green-400",
  warning: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  danger: "bg-red-500/10 border-red-500/30 text-red-400",
};

export default function FormHeader({
  title,
  subtitle,
  backHref,
  badge,
  badgeTone = "default",
  actions,
}: FormHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => router.push(backHref)}
        title="Back"
        aria-label="Back"
        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-white truncate">{title}</h1>
          {badge && (
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${BADGE_TONE[badgeTone]}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-white/50 mt-1 truncate">{subtitle}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}