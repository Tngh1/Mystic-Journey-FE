"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";


interface FormAlertProps {
  type?: "error" | "warning" | "info";
  message: string;
  title?: string;
  onDismiss?: () => void;
}

type AlertType = NonNullable<FormAlertProps["type"]>;

const TYPE_PLATE: Record<AlertType, string> = {
  error: "bg-heraldry-crimson text-parchment",
  warning: "bg-heraldry-ember text-parchment",
  info: "bg-heraldry-royal text-parchment",
};

const TYPE_EDGE: Record<AlertType, string> = {
  error: "border-danger",
  warning: "border-accent-deep",
  info: "border-info",
};

const ICON: Record<AlertType, typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Renders form alert modal/form component.
// Returns the interactive form JSX element.
export default function FormAlert({
  type = "error",
  message,
  title,
  onDismiss,
}: FormAlertProps) {
  const Icon = ICON[type];

  return (
    <div
      className={`pixel-bevel-plate flex items-start gap-3 border-2 p-3.5 ${TYPE_EDGE[type]}`}
      role="alert"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black/60 shadow-sm ${TYPE_PLATE[type]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        {title && <p className="text-sm font-bold text-fg">{title}</p>}
        <p className={`text-sm text-parchment ${title ? "mt-0.5" : ""}`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-my-1 -mr-1 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 border-transparent text-parchment-dim transition-colors hover:border-accent hover:text-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
