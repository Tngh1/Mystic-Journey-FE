"use client";

import { User, Settings, ShieldCheck, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/transactions", label: "Transactions", icon: CreditCard },
  { href: "/account/setting", label: "Settings", icon: Settings },
  { href: "/account/security", label: "Password & Security", icon: ShieldCheck },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 h-fit shrink-0 rounded-2xl bg-[#0F0F0F] border border-white/10 overflow-hidden">
      <div className="px-2 py-4">
        <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">Account</h3>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "h-10 px-3 rounded-[10px] flex items-center gap-3 transition-colors duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#3A3A3A] text-white"
                      : "bg-transparent text-white hover:bg-[#272727]",
                  ].join(" ")}
                >
                  <Icon className="w-6 h-6 shrink-0 text-white" />
                  <span className={["text-sm truncate", isActive ? "font-semibold" : "font-normal"].join(" ")}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
