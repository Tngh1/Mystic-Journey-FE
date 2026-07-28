"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import FormField from "@/components/form/FormField";
import { TextInput, TextArea, SelectInput, Checkbox } from "@/components/form/FormInput";

/* The field-driven modal, on a steel plate instead of a `rounded-xl` #111 card.

   Every one of the six field types used to carry its own copy of the same
   `bg-white/5 border-white/10 rounded-lg … focus:border-[#ffc032]/50` string —
   six places to change an input. They now render the shared form primitives, so
   this file describes *which* fields exist and nothing about how they look. The
   labels also gained the `htmlFor` they never had, and the card's
   `animate-in zoom-in-95` is gone: smooth scaling is the one motion the pixel
   system rules out. `backdrop-blur` stays — background dismissal is the single
   sanctioned use for blur. */

/* Renamed from `FormField` — that name now belongs to the imported component. */
interface ModalField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "checkbox" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
}

type FormValue = string | number | boolean;

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: ModalField[];
  initialValues?: Record<string, FormValue>;
  onSubmit: (values: Record<string, FormValue>) => void;
}

export default function FormModal({
  isOpen,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
}: FormModalProps) {
  const [formData, setFormData] = React.useState<Record<string, FormValue>>(initialValues);

  useEffect(() => {
    if (isOpen) {
      void Promise.resolve().then(() => setFormData(initialValues));
    }
  }, [isOpen, initialValues]);

  /* Escape closes, matching the app's other dialogs and giving keyboard users
     the escape route the X alone did not. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleChange = (name: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getInputValue = (name: string): string | number => {
    const value = formData[name];
    return typeof value === "string" || typeof value === "number" ? value : "";
  };

  const getCheckedValue = (name: string): boolean => {
    return formData[name] === true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderControl = (field: ModalField) => {
    const id = `fm-${field.name}`;
    switch (field.type) {
      case "select":
        return (
          <SelectInput
            id={id}
            name={field.name}
            value={getInputValue(field.name)}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            placeholder={`Select ${field.label}`}
            options={field.options ?? []}
          />
        );
      case "textarea":
        return (
          <TextArea
            id={id}
            name={field.name}
            rows={3}
            placeholder={field.placeholder}
            value={getInputValue(field.name)}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            id={id}
            checked={getCheckedValue(field.name)}
            onChange={(e) => handleChange(field.name, e.target.checked)}
            label={field.placeholder || "Enable this option"}
          />
        );
      default:
        return (
          <TextInput
            id={id}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={getInputValue(field.name)}
            onChange={(e) =>
              handleChange(
                field.name,
                field.type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            required={field.required}
          />
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="pixel-bevel-plate flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border-2 border-black/60 shadow-xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-black/60 bg-iron-dark px-4 py-3">
          <h2 className="truncate text-xs font-black uppercase tracking-[0.2em] text-accent">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="pixel-press flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment transition-colors hover:text-accent"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.type === "checkbox" ? undefined : field.label}
                htmlFor={`fm-${field.name}`}
                required={field.required}
              >
                {renderControl(field)}
              </FormField>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t-2 border-black/60 bg-iron-dark px-4 py-3">
            <button
              type="button"
              onClick={onClose}
              className="pixel-press h-11 cursor-pointer border-2 border-black/60 bg-iron px-4 text-xs font-black uppercase tracking-[0.1em] text-parchment shadow-sm transition-colors hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pixel-press h-11 cursor-pointer border-2 border-accent bg-accent px-4 text-xs font-black uppercase tracking-[0.1em] text-on-accent shadow-sm transition-colors hover:bg-accent-hover"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
