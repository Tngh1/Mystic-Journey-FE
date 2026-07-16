"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface FormField {
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
  fields: FormField[];
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === "text" && (
                  <input
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={getInputValue(field.name)}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required={field.required}
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={getInputValue(field.name)}
                    onChange={(e) => handleChange(field.name, Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required={field.required}
                  />
                )}

                {field.type === "select" && (
                  <select
                    name={field.name}
                    value={getInputValue(field.name)}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required={field.required}
                  >
                    <option value="" className="bg-[#111111]">
                      Select {field.label}
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#111111]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "textarea" && (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    value={getInputValue(field.name)}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors resize-none"
                    required={field.required}
                  />
                )}

                {field.type === "checkbox" && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={getCheckedValue(field.name)}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ffc032] focus:ring-[#ffc032] focus:ring-offset-0"
                    />
                    <span className="text-sm text-white/70">
                      {field.placeholder || "Enable this option"}
                    </span>
                  </label>
                )}

                {field.type === "date" && (
                  <input
                    type="date"
                    name={field.name}
                    value={getInputValue(field.name)}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white/70 bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffc032]/90 rounded-lg transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
