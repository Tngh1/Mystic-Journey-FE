"use client";

import { Search, Bell, Moon, Menu } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AdminTopBar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="p-2 text-white/70 hover:text-white lg:hidden cursor-pointer">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search or type command..."
            className="w-80 bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#ffc032]/50 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘</span>
            <span className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <Moon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors relative cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1a1a1a]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10 ml-2 cursor-pointer">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-white">{user?.userName || "Admin User"}</p>
            <p className="text-xs text-white/50">{user?.role || "Admin"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffc032] to-[#ca831f] flex items-center justify-center text-white font-bold overflow-hidden relative border-2 border-[#ffc032]">
            {user ? user.userName.charAt(0).toUpperCase() : "A"}
          </div>
          <svg className="w-4 h-4 text-white/50 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </header>
  );
}
