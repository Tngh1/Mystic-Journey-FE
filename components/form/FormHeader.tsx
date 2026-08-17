"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


interface FormHeaderProps {
  title: string;
  subtitle?: string;
  backHref: string;
  badge?: string;
  badgeTone?: "default" | "primary" | "success" | "warning" | "danger";
  actions?: React.ReactNode;
}

const BADGE_TONE: Record<NonNullable<FormHeaderProps["badgeTone"]>, string> = {
  default: "border-black/60 bg-iron text-parchment",
  primary: "border-accent bg-accent text-on-accent",
  success: "border-black/60 bg-heraldry-pine text-parchment",
  warning: "border-black/60 bg-heraldry-ember text-parchment",
  danger: "border-black/60 bg-heraldry-crimson text-parchment",
};

// Renders form header modal/form component.
// Returns the interactive form JSX element.
export default function FormHeader({
  title,
  subtitle,
  backHref,
  badge,
  badgeTone = "default",
  actions,
}: FormHeaderProps) {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => router.push(backHref)}  // Navigate to the next page and push to history stack
        title="Back"
        aria-label="Back"
        className="pixel-press flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment shadow-sm transition-colors hover:text-accent"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="truncate text-2xl font-bold text-fg">{title}</h1>
          {badge && (
            <span
              className={`border-2 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] shadow-sm ${BADGE_TONE[badgeTone]}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 truncate text-sm text-fg-muted">{subtitle}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
