"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";


interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders form section modal/form component.
// Returns the interactive form JSX element.
export default function FormSection({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`pixel-bevel-plate overflow-hidden border-2 border-black/60 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-black/60 bg-iron-dark px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black/60 bg-iron text-parchment shadow-sm">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-xs font-black uppercase tracking-[0.15em] text-accent">
              {title}
            </h2>
            {subtitle && (
              <p className="truncate text-xs text-parchment-dim">{subtitle}</p>
            )}
          </div>
        </div>
        {actions}
      </div>
      <div className="space-y-6 p-5">{children}</div>
    </section>
  );
}
