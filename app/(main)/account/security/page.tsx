"use client";

import { useState, useEffect } from "react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import PageLoader from "@/components/ui/PageLoader";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { changePassword } from "@/lib/api/account";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SecurityPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAccessToken(token);
    }
    setIsLoading(false);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (formData.newPassword !== formData.confirmPassword) {
      await showErrorAlert("Validation Error", "New Password and Confirm Password do not match.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await changePassword(accessToken, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });

      if (res.success) {
        await showSuccessAlert("Success!", "Your password has been changed successfully.");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        await showErrorAlert("Oops...", res.message || "Failed to change password.");
      }
    } catch (error) {
      await showErrorAlert("Error", "An unexpected error occurred. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4 font-['BeVietnamPro']">
        <div className="text-center bg-white/10 border border-white/10 rounded-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-gray-400 mb-8">Please log in to view your security settings.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#ffc032] hover:bg-[#ca831f] text-white rounded-lg transition-colors font-semibold w-full">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-['BeVietnamPro'] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <ProfileSidebar />

        <main className="flex-1 md:pl-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">Password & Security</h1>
          <p className="text-gray-400 text-sm mb-12">Manage your password and security preferences.</p>

          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
            
            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white outline-none focus:border-[#ffc032] transition-colors"
                    placeholder="Enter current password..."
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white outline-none focus:border-[#ffc032] transition-colors"
                    placeholder="Enter new password..."
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white outline-none focus:border-[#ffc032] transition-colors"
                    placeholder="Confirm new password..."
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#ffc032] hover:bg-[#ca831f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-bold tracking-wide cursor-pointer"
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
