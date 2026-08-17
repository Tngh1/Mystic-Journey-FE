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

// Renders form actions modal/form component.
// Returns the interactive form JSX element.
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
  // Process inner and returns the computed result.
  const inner = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="pixel-press h-11 cursor-pointer border-2 border-black/60 bg-iron px-5 text-xs font-black uppercase tracking-[0.1em] text-parchment shadow-sm transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className="pixel-press flex h-11 cursor-pointer items-center gap-2 border-2 border-accent bg-accent px-5 text-xs font-black uppercase tracking-[0.1em] text-on-accent shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : SubmitIcon ? (
          <SubmitIcon className="h-4 w-4" aria-hidden="true" />
        ) : null}
        {loading && loadingLabel ? loadingLabel : submitLabel}
      </button>
    </div>
  );

  if (!sticky) return inner;

  return (
    <div className="sticky bottom-0 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="pixel-bevel-plate border-2 border-black/60 px-5 py-3.5 shadow-lg">
        {inner}
      </div>
    </div>
  );
}
