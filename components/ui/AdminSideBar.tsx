"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Ghost,
  Gift,
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  Swords,
  Scroll,
  Trophy,
  Mail,
  FolderOpen,
  CalendarDays,
} from "lucide-react";
import { useSidebar } from "@/lib/contexts/SidebarContext";

const menuGroups = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", hasNotification: false },
    ],
  },
  {
    title: "User Management",
    items: [
      { icon: Users, label: "Manage Accounts", href: "/manage-accounts", hasNotification: true },
      { icon: ShieldCheck, label: "Manage Admins", href: "/manage-admins", hasNotification: false },
    ],
  },
  {
    title: "Game Entities",
    items: [
      { icon: Package, label: "Manage Items", href: "/manage-items", hasNotification: false },
      { icon: Ghost, label: "Manage Monsters", href: "/manage-monsters", hasNotification: false },
      { icon: Swords, label: "Manage Dungeon", href: "/manage-dungeons", hasNotification: false },
    ],
  },
  {
    title: "Economy & Shop",
    items: [
      { icon: ShoppingCart, label: "Manage Shop", href: "/manage-shop", hasNotification: false },
      { icon: Gift, label: "Manage Gacha Pools", href: "/manage-gacha-pools", hasNotification: true },
      { icon: CreditCard, label: "Manage Transaction", href: "/manage-transactions", hasNotification: false },
    ],
  },
  {
    title: "Game Systems",
    items: [
      { icon: Scroll, label: "Manage Quest", href: "/manage-quests", hasNotification: false },
      { icon: Trophy, label: "Manage Achievement", href: "/manage-achievements", hasNotification: false },
      { icon: CalendarDays, label: "Daily Login Rewards", href: "/manage-daily-login", hasNotification: false },
    ],
  },
  {
    title: "Communications",
    items: [
      { icon: FileText, label: "Manage Content", href: "/manage-content", hasNotification: false },
      { icon: FolderOpen, label: "Manage Category", href: "/manage-category-content", hasNotification: false },
      { icon: Mail, label: "Manage Mailbox", href: "/manage-mailbox", hasNotification: true },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between">
        <Link href="/" className="relative w-28 h-8" onClick={onNavigate}>
          <Image
            src="/images/logo/logo.png"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:bg-[#272727] rounded-[10px] transition-colors duration-200 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-2 flex-1 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="px-3 mb-1 text-xs font-medium text-[#AAAAAA]">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={[
                        "h-10 px-3 rounded-[10px] flex items-center gap-3 transition-colors duration-200 group cursor-pointer",
                        isActive
                          ? "bg-[#3A3A3A] text-white"
                          : "bg-transparent text-white hover:bg-[#272727]",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "w-6 h-6 shrink-0",
                          isActive ? "text-white" : "text-white",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "text-sm truncate",
                          isActive ? "font-semibold" : "font-normal",
                        ].join(" ")}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

export default function AdminSideBar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-[#0F0F0F] border-r border-white/10 flex-col fixed left-0 top-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={close}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-60 max-w-[85vw] bg-[#0F0F0F] border-r border-white/10 flex flex-col animate-in slide-in-from-left">
            <SidebarContent onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  );
}