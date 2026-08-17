"use client";

import React from "react";

const BASE_INPUT =
  "w-full min-h-11 border-2 border-black/60 bg-surface-2 px-3 py-2.5 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:border-accent disabled:cursor-not-allowed disabled:bg-iron/40 disabled:text-fg-subtle";

interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputClassName?: string;
}

// Renders the text input reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export function TextInput({ inputClassName = "", ...rest }: TextInputProps) {
  return <input {...rest} className={`${BASE_INPUT} ${inputClassName}`} />;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  inputClassName?: string;
}

// Renders the text area reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
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

// Renders the select input reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
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

// Renders the checkbox reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export function Checkbox({ label, className = "", ...rest }: CheckboxProps) {
  return (
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
