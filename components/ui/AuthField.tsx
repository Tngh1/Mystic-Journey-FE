"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  reveal?: boolean;
  hint?: ReactNode;
  error?: string;
  trailing?: ReactNode;
}

// Renders the auth field reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
export default function AuthField({
  label,
  reveal,
  hint,
  error,
  trailing,
  id,
  type = "text",
  ...rest
}: AuthFieldProps) {
  const [shown, setShown] = useState(false);  // Initialize boolean flag as inactive
  const autoId = useId();
  const fieldId = id ?? autoId;
  // Helper function executing note id.
  // Processes input parameters and returns the calculated result.
  const noteId = `${fieldId}-note`;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-parchment-dim"
      >
        {label}
        {rest.required && (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative flex items-center gap-2">
        <input
          {...rest}
          id={fieldId}
          type={reveal ? (shown ? "text" : "password") : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? noteId : undefined}
          className={`h-11 w-full min-w-0 border-2 bg-black/40 px-3 text-sm text-parchment shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)] outline-none placeholder:text-parchment-dim/50 focus:border-accent disabled:opacity-60 ${
            error ? "border-danger" : "border-black/60"
          } ${reveal ? "pr-12" : ""}`}
        />

        {reveal && (
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            aria-pressed={shown}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute right-0 flex h-11 w-11 cursor-pointer items-center justify-center text-parchment-dim hover:text-accent"
          >
            {shown ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        )}

        {trailing}
      </div>

      {(error || hint) && (
        <p
          id={noteId}
          role={error ? "alert" : undefined}
          className={`mt-1.5 text-xs leading-relaxed ${error ? "text-danger" : "text-parchment-dim/75"}`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
