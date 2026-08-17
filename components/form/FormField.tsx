"use client";

import React from "react";
import { AlertCircle } from "lucide-react";


interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}

// Renders form field modal/form component.
// Returns the interactive form JSX element.
export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center justify-between gap-2 text-sm font-bold text-fg"
        >
          <span>
            {label}
            {required && (
              <span className="ml-0.5 text-danger" title="Required">
                *
              </span>
            )}
          </span>
          {hint && !error && (
            <span className="text-xs font-normal text-fg-muted">{hint}</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-start gap-1.5 text-xs text-danger">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
