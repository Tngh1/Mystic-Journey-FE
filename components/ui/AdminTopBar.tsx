"use client";

import { Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useSidebar } from "@/lib/contexts/SidebarContext";
import { showConfirmAlert } from "@/lib/utils/swal";

/* The gate rail above the ledger board. Was a bare bordered strip carrying a
   `rounded-full` gradient avatar and its own hand-built logout modal — a second
   confirm dialog with `rounded-2xl`, `backdrop-blur-sm` and five raw hexes,
   sitting alongside the app's real one.

   That modal is gone: `showConfirmAlert` already is this dialog, already wears
   the crimson destructive confirm, and already puts Cancel where the eye lands.
   The old bespoke copy was ~50 lines maintaining a second answer to the same
   question. */
export default function AdminTopBar() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    const confirm = await showConfirmAlert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      "Logout",
      "Cancel"
    );
    if (!confirm) return;
    try {
      setLoggingOut(true);
      await logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const initial = user ? user.userName.charAt(0).toUpperCase() : "A";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b-2 border-black/60 bg-iron-dark px-4 sm:px-6">
      <button
        onClick={toggle}
        className="pixel-press flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment transition-colors hover:text-accent lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      {/* Keeps the identity block right-aligned once the menu toggle is hidden */}
      <span className="hidden lg:block" aria-hidden="true" />

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 border-r-2 border-black/40 pr-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-parchment">{user?.userName || "Admin"}</p>
            <p className="text-[11px] uppercase tracking-[0.15em] text-accent-deep">
              {user?.role || "Admin"}
            </p>
          </div>
          {/* Signet: a square gold plate, not a soft circular gradient */}
          <span className="flex h-11 w-11 items-center justify-center border-2 border-accent bg-accent text-lg font-black text-on-accent shadow-sm">
            {initial}
          </span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="pixel-press flex h-11 cursor-pointer items-center gap-2 border-2 border-black/60 bg-iron px-3 text-xs font-black uppercase tracking-[0.1em] text-parchment shadow-sm transition-colors hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{loggingOut ? "Leaving…" : "Log Out"}</span>
        </button>
      </div>
    </header>
  );
}
