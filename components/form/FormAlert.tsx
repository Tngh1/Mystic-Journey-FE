"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface FormAlertProps {
  type?: "error" | "warning" | "info";
  message: string;
  title?: string;
  onDismiss?: () => void;
}

const TYPE_STYLE: Record<NonNullable<FormAlertProps["type"]>, string> = {
  error: "bg-red-500/10 border-red-500/30 text-red-400",
  warning: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

const ICON: Record<NonNullable<FormAlertProps["type"]>, typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertCircle,
  info: AlertCircle,
};

export default function FormAlert({
  type = "error",
  message,
  title,
  onDismiss,
}: FormAlertProps) {
  const Icon = ICON[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${TYPE_STYLE[type]}`}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        <p className={`text-sm ${title ? "mt-1 opacity-90" : ""}`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}