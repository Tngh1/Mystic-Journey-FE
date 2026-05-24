"use client";

import { useState, useEffect } from "react";
import { Info, Pencil } from "lucide-react";
import Link from "next/link";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import PageLoader from "@/components/ui/PageLoader";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import { updateProfile } from "@/lib/api/account";

interface UserInfo {
  accountId: string;
  fullName: string;
  userName: string;
  emailAddress: string;
  gender: string;
  phoneNumber?: string;
  birthday?: string;
  roleId: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthday: "",
    gender: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        setFormData({
          fullName: parsedUser.fullName || "",
          phoneNumber: parsedUser.phoneNumber || "",
          birthday: parsedUser.birthday ? new Date(parsedUser.birthday).toISOString().split("T")[0] : "",
          gender: parsedUser.gender || ""
        });
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      await showErrorAlert("Error", "You must be logged in to update your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        fullName: formData.fullName.trim(),
        gender: formData.gender,
        phoneNumber: formData.phoneNumber || undefined,
        birthday: formData.birthday || undefined
      };

      const res = await updateProfile(accessToken, payload);

      if (res.success && res.account) {
        const updatedUser = { ...user, ...res.account };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        await showSuccessAlert("Success!", "Your profile has been updated.");
      } else {
        await showErrorAlert("Oops...", res.message || "Failed to update profile.");
      }
    } catch (error) {
      await showErrorAlert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4 font-['BeVietnamPro']">
        <div className="text-center bg-white/10 border border-white/10 rounded-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-gray-400 mb-8">Please log in to view your profile.</p>
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

        {/* Main Content */}
        <main className="flex-1 md:pl-8">
          
          <h1 className="text-4xl font-extrabold text-white mb-2">Settings</h1>
          <p className="text-gray-400 text-sm mb-12">Manage your account details.</p>

          {/* Account Information */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
            <div className="mb-2">
              <span className="font-bold text-white">ID:</span> <span className="text-gray-300">{user.accountId || "ba7c5def2f0546bdb3e2f5d69a04b114"}</span>
            </div>
            <div className="mb-6">
              <span className="font-bold text-white">Username:</span> <span className="text-gray-300">@{user.userName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ffc032] transition-colors"
                      placeholder="Enter your full name..."
                    />
                  </div>
                </div>
                
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      defaultValue={user.emailAddress} 
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white outline-none focus:border-[#ffc032]"
                    />
                    <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section className="pt-10 border-t border-white/10 mb-12">
            <h2 className="text-xl font-bold text-white mb-3">Personal Information</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-3xl">
              Manage your name and contact info. These personal details are private and will not be displayed to other users. View our <a href="#" className="text-[#ffc032] hover:underline">Privacy Policy</a>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ffc032] transition-colors"
                  placeholder="Enter your phone number..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Birthday</label>
                <input 
                  type="date" 
                  value={formData.birthday}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ffc032] transition-colors [color-scheme:dark]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full md:w-[calc(50%-0.75rem)] bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#ffc032] transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-8 py-3 bg-[#ffc032] hover:bg-[#ca831f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-bold tracking-wide cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
