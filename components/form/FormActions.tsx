"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  submitIcon?: LucideIcon;
  sticky?: boolean;
}

export default function FormActions({
  onCancel,
  cancelLabel = "Cancel",
  submitLabel,
  loadingLabel,
  loading = false,
  disabled = false,
  submitIcon: SubmitIcon,
  sticky = true,
}: FormActionsProps) {
  const inner = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-6 py-2.5 text-sm font-medium text-white/70 bg-[#111111] border border-gray-800 hover:bg-[#252525] hover:text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#111] bg-[#ffc032] hover:bg-[#ffd04c] rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#ffc032]/10"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : SubmitIcon ? (
          <SubmitIcon className="w-4 h-4" />
        ) : null}
        {loading && loadingLabel ? loadingLabel : submitLabel}
      </button>
    </div>
  );

  if (!sticky) return inner;

  return (
    <div className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-gradient-to-t from-[#111] via-[#111] to-transparent">
      <div className="bg-[#111111] border border-gray-800 rounded-2xl px-6 py-4 shadow-2xl shadow-black/40">
        {inner}
      </div>
    </div>
  );
}