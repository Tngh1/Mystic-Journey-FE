"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { changePassword } from "@/lib/api/auth";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

const FIELDS: { key: PasswordField; label: string; placeholder: string }[] = [
  { key: "currentPassword",  label: "Current Password",     placeholder: "Enter current password..."  },
  { key: "newPassword",      label: "New Password",         placeholder: "Enter new password..."      },
  { key: "confirmPassword",  label: "Confirm New Password", placeholder: "Confirm new password..."    },
];

const EMPTY_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function SecurityPage() {
  const { isLoading } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [showField, setShowField] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return null;

  const toggle = (key: PasswordField) =>
    setShowField((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      await showErrorAlert("Validation Error", "New Password and Confirm Password do not match.");
      return;
    }
    setIsSaving(true);
    try {
      await changePassword(formData);
      await showSuccessAlert("Success!", "Your password has been changed successfully.");
      setFormData(EMPTY_FORM);
    } catch (error) {
      await showErrorAlert("Error", error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-['BeVietnamPro'] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <ProfileSidebar />

        <main className="flex-1 md:pl-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <Lock className="w-3.5 h-3.5" /> Security
            </span>
            <span className="h-px w-12 bg-linear-to-r from-[#ffc032]/60 to-transparent" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Password &amp; Security</h1>
          <p className="text-white/60 text-sm mb-12">Manage your password and security preferences.</p>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
              {FIELDS.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-xs text-white/60 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      id={key}
                      type={showField[key] ? "text" : "password"}
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      required
                      placeholder={placeholder}
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-white/40 outline-none focus:border-[#ffc032] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      {showField[key] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#ffc032] hover:bg-[#ffd04c] disabled:opacity-50 disabled:cursor-not-allowed text-[#111] rounded-xl transition-colors font-bold tracking-wide cursor-pointer"
                >
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
