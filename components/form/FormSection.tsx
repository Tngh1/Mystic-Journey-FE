"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-[#ffc032]",
  actions,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <section
      className={`bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-3 bg-gradient-to-r from-white/[0.02] to-transparent">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div
              className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${iconColor}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white truncate">{title}</h2>
            {subtitle && (
              <p className="text-xs text-white/50 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {actions}
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </section>
  );
}