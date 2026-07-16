"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AccountSettingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // Middleware đã bảo vệ route này, nhưng giữ fallback phòng edge case
  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4">
        <div className="text-center bg-[#111111] border border-white/10 rounded-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-white/60 mb-8">Please log in to view your account.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] rounded-xl transition-colors font-semibold w-full cursor-pointer">
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
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <Settings className="w-3.5 h-3.5" /> Settings
            </span>
            <span className="h-px w-12 bg-linear-to-r from-[#ffc032]/60 to-transparent" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Settings</h1>
          <p className="text-white/60 text-sm mb-12">Your account information.</p>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4">
              {[
                { label: "Account ID", value: user.accountId, mono: true },
                { label: "Username", value: `@${user.userName}` },
                { label: "Email", value: user.email },
                { label: "Role", value: user.role },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">{label}</span>
                  <span className={`text-white text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Current Position</h2>
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4">
              {[
                { label: "Map", value: user.lastMapName },
                { label: "Position X", value: user.positionX, mono: true },
                { label: "Position Y", value: user.positionY, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">{label}</span>
                  <span className={`text-white text-sm ${mono ? "font-mono" : ""}`}>{value}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
