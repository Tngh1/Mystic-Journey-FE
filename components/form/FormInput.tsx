"use client";

import React from "react";

const BASE_INPUT =
  "w-full bg-[#0d0d0d] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#ffc032] focus:ring-1 focus:ring-[#ffc032]/30 transition-colors";

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
        <option value="" className="bg-[#111111]">
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-[#111111]"
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
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        {...rest}
        className={`w-5 h-5 rounded border-white/10 bg-[#0d0d0d] text-accent focus:ring-accent focus:ring-offset-0 cursor-pointer ${className}`}
      />
      {label && <span className="text-sm text-white/80">{label}</span>}
    </label>
  );
}
