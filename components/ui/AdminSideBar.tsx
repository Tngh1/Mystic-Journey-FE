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
  ShoppingCart,
  CreditCard,
  Swords,
  Scroll,
  Trophy,
  Mail,
  FolderOpen,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { useSidebar } from "@/lib/contexts/SidebarContext";


const menuGroups = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "User Management",
    items: [
      { icon: Users, label: "Manage Accounts", href: "/manage-accounts" },
    ],
  },
  {
    title: "Game Entities",
    items: [
      { icon: Package, label: "Manage Items", href: "/manage-items" },
      { icon: Sparkles, label: "Manage Skills", href: "/manage-skills" },
      { icon: Ghost, label: "Manage Monsters", href: "/manage-monsters" },
      { icon: Swords, label: "Manage Dungeon", href: "/manage-dungeons" },
    ],
  },
  {
    title: "Economy & Shop",
    items: [
      { icon: ShoppingCart, label: "Manage Shop", href: "/manage-shop" },
      { icon: Gift, label: "Manage Gacha Pools", href: "/manage-gacha-pools" },
      { icon: CreditCard, label: "Manage Transaction", href: "/manage-transactions" },
    ],
  },
  {
    title: "Game Systems",
    items: [
      { icon: Scroll, label: "Manage Quest", href: "/manage-quests" },
      { icon: Trophy, label: "Manage Achievement", href: "/manage-achievements" },
      { icon: CalendarDays, label: "Daily Login Rewards", href: "/manage-daily-login" },
    ],
  },
  {
    title: "Communications",
    items: [
      { icon: FileText, label: "Manage Content", href: "/manage-content" },
      { icon: FolderOpen, label: "Manage Category", href: "/manage-category-content" },
      { icon: Mail, label: "Manage Mailbox", href: "/manage-mailbox" },
    ],
  },
];

// Renders the sidebar content reusable UI component.
// Returns the styled JSX element.
function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b-2 border-black/60 bg-iron-dark px-4">
        <Link href="/" className="relative h-9 w-28" onClick={onNavigate} aria-label="Mystic Journey home">
          <Image
            src="/images/logo/logo.webp"
            alt="Mystic Journey"
            fill
            className="pixelated object-contain"
            priority
          />
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="pixel-press flex h-11 w-11 cursor-pointer items-center justify-center border-2 border-black/60 bg-iron text-parchment transition-colors hover:text-accent lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {menuGroups.map((group) => {
          return (
            <div key={group.title} className="mb-4">
              <h3 className="mb-1.5 flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent-deep">
                {group.title}
                <span className="h-0.5 flex-1 bg-iron-light/40" aria-hidden="true" />
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={isActive ? "page" : undefined}
                        className={[
                          "flex h-11 items-center gap-3 border-2 px-2.5 transition-colors",
                          isActive
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-transparent text-parchment hover:border-iron-light hover:bg-iron-light/12 hover:text-accent",
                        ].join(" ")}
                      >
                        <span
                          className={`h-6 w-0.5 shrink-0 ${isActive ? "bg-accent" : "bg-transparent"}`}
                          aria-hidden="true"
                        />
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span className={`truncate text-sm ${isActive ? "font-bold" : "font-normal"}`}>
                          {item.label}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}

// Renders the admin side bar reusable UI component.
// Returns the styled JSX element.
export default function AdminSideBar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      <aside className="pixel-bevel-plate fixed left-0 top-0 hidden h-full min-h-screen w-64 flex-col border-r-2 border-black/60 lg:flex">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            onClick={close}
            aria-hidden="true"
          />
          <aside className="pixel-bevel absolute left-0 top-0 flex h-full w-64 max-w-[85vw] flex-col border-r-2 border-black/60">
            <SidebarContent onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  );
}
