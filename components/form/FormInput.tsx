"use client";

import React from "react";

/* Every admin input is a slot punched into the plate: 2px black edge, surface-2
   floor, gold edge once it holds focus. One constant, so the whole portal's
   inputs move together.

   Was `bg-[#0d0d0d] border-white/10 rounded-lg … focus:ring-1` with a raw
   #ffc032 — and a `focus:outline-none` that killed the global gold focus ring
   without replacing it for keyboard users. The ring now stays; the border swap
   is the extra signal on top of it. Height is 44px to clear the touch floor. */
const BASE_INPUT =
  "w-full min-h-11 border-2 border-black/60 bg-surface-2 px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:border-accent disabled:cursor-not-allowed disabled:bg-iron/40 disabled:text-fg-subtle";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputClassName?: string;
}

export function TextInput({ inputClassName = "", ...rest }: TextInputProps) {
  return <input {...rest} className={`${BASE_INPUT} ${inputClassName}`} />;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputClassName?: string;
}

export function TextArea({ inputClassName = "", ...rest }: TextAreaProps) {
  return (
    <textarea
      {...rest}
      className={`${BASE_INPUT} resize-none ${inputClassName}`}
    />
  );
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  inputClassName?: string;
}

export function SelectInput({
  options,
  placeholder,
  inputClassName = "",
  ...rest
}: SelectInputProps) {
  return (
    <select
      {...rest}
      className={`${BASE_INPUT} cursor-pointer ${inputClassName}`}
    >
      {placeholder && (
        <option value="" className="bg-surface">
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-surface"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Checkbox({ label, className = "", ...rest }: CheckboxProps) {
  return (
    /* 44px row so the whole label is the hit area, not just the 20px box */
    <label className="flex min-h-11 cursor-pointer select-none items-center gap-3">
      <input
        type="checkbox"
        {...rest}
        className={`h-5 w-5 cursor-pointer border-2 border-black/60 bg-surface-2 accent-accent ${className}`}
      />
      {label && <span className="text-sm text-fg">{label}</span>}
    </label>
  );
}
