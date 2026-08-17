"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import Tapestry from "@/components/ui/Tapestry";
import { useAuth } from "@/lib/contexts/AuthContext";
import { changePassword } from "@/lib/api/auth";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const FIELDS: { key: PasswordField; label: string; placeholder: string; autoComplete: string }[] = [
  { key: "currentPassword", label: "Current Password",     placeholder: "Enter current password…", autoComplete: "current-password" },
  { key: "newPassword",     label: "New Password",         placeholder: "Enter new password…",     autoComplete: "new-password"     },
  { key: "confirmPassword", label: "Confirm New Password", placeholder: "Confirm new password…",   autoComplete: "new-password"     },
];

// Renders the empty_form view component.
// Key functionality: manages local UI state, pagination, and filter values; displays interactive alert dialogues for user actions.
// Returns the JSX element hierarchy for the page view.
const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Renders the security page view component.
// Returns the JSX element hierarchy for the page view.
export default function SecurityPage() {
  const { isLoading } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showField, setShowField] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isSaving, setIsSaving] = useState(false);  // Initialize boolean flag as inactive

  const mismatch =
    formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword;

  if (isLoading) return null;

  // Toggle show field for the supplied key by inverting its previous boolean value.
  const toggle = (key: PasswordField) =>
    setShowField((prev) => ({ ...prev, [key]: !prev[key] }));

  // Renders the handle save view component.
  // Key functionality: displays interactive alert dialogues for user actions.
  // Returns the JSX element hierarchy for the page view.
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent default HTML form submission and page reload
    if (formData.newPassword !== formData.confirmPassword) {
      await showErrorAlert("Validation Error", "New Password and Confirm Password do not match.");  // Display styled error alert dialog to the user
      return;
    }
    setIsSaving(true);
    try {
      await changePassword(formData);
      await showSuccessAlert("Success!", "Your password has been changed successfully.");  // Display styled success alert dialog to the user
      setFormData(EMPTY_FORM);
    } catch (error) {
      await showErrorAlert("Error", error instanceof Error ? error.message : "An unexpected error occurred.");  // Display styled error alert dialog to the user
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:flex-row md:gap-8 md:px-6">
        <ProfileSidebar />

        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-accent">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Security
            </span>
            <span className="h-0.5 w-12 bg-accent/60" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-fg md:text-4xl">Password &amp; Security</h1>
          <p className="mb-8 text-sm text-fg-muted">
            Change the ward on your account. You will stay signed in on this device.
          </p>


          <Tapestry
            as="section"
            aria-labelledby="change-pw"
            dye="royal"
            title="Change Password"
            titleId="change-pw"
            icon={<Lock className="h-4 w-4 text-accent" aria-hidden="true" />}
            bodyClassName=""
            className="max-w-2xl"
          >
            <form onSubmit={handleSave} className="space-y-5 p-4 md:p-6">
              {FIELDS.map(({ key, label, placeholder, autoComplete }) => {
                const invalid = key === "confirmPassword" && mismatch;
                return (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-parchment-dim"
                    >
                      {label} <span className="text-accent">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={key}
                        type={showField[key] ? "text" : "password"}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        required
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        aria-invalid={invalid || undefined}
                        aria-describedby={invalid ? "confirm-error" : undefined}
                        className={`h-11 w-full border-2 bg-black/45 pl-3 pr-11 text-sm text-parchment placeholder:text-parchment-dim/50 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.45)] outline-none focus:border-accent ${
                          invalid ? "border-danger" : "border-black/55"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-label={showField[key] ? `Hide ${label}` : `Show ${label}`}
                        aria-pressed={showField[key]}
                        className="absolute right-0 top-0 flex h-11 w-11 cursor-pointer items-center justify-center text-parchment-dim hover:text-accent"
                      >
                        {showField[key]
                          ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                          : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    </div>
                    {invalid && (
                      <p
                        id="confirm-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-danger"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        The two new passwords do not match.
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end border-t-2 border-black/35 pt-5">
                <button
                  type="submit"
                  disabled={isSaving || mismatch}
                  className="pixel-press flex min-h-11 cursor-pointer items-center border-2 border-accent bg-accent px-6 text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Updating…" : "Update Password"}
                </button>
              </div>
            </form>
          </Tapestry>
        </main>
      </div>
    </div>
  );
}
