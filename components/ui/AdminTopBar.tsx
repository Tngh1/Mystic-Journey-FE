"use client";

import { Search, Menu, LogOut, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSidebar } from "@/lib/contexts/SidebarContext";
import LogoutButton from "./LogoutButton";

export default function AdminTopBar() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="p-2 text-white/70 hover:text-white cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search or type command..."
            className="w-72 lg:w-80 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:flex gap-1">
            <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘</span>
            <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden md:flex items-center gap-3 pr-4 border-r border-white/10">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{user?.userName || "Admin User"}</p>
            <p className="text-xs text-white/50">{user?.role || "Admin"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffc032] to-[#ca831f] flex items-center justify-center text-white font-bold overflow-hidden relative border-2 border-[#ffc032]">
            {user ? user.userName.charAt(0).toUpperCase() : "A"}
          </div>
        </div>

        <LogoutButton onClick={() => setShowLogoutConfirm(true)} />
      </div>

      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => !loggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-[#111111] border border-white/10 rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="text-white/50 hover:text-white disabled:opacity-40 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-white/70 mb-6">
              Are you sure you want to log out? You will need to sign in again to access the dashboard.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="px-4 h-10 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-4 h-10 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}