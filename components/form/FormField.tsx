"use client";

import React from "react";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3;
}

export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className = "",
  span,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center justify-between text-sm font-medium text-white/80"
        >
          <span>
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </span>
          {hint && !error && (
            <span className="text-xs font-normal text-white/40">{hint}</span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}