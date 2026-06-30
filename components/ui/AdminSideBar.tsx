"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  Settings,
  FolderOpen
} from "lucide-react";

const menuGroups = [
  {
    title: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    ]
  },
  {
    title: "USER MANAGEMENT",
    items: [
      { icon: Users, label: "Manage Accounts", href: "/manage-accounts" },
      { icon: ShieldCheck, label: "Manage Admins", href: "/manage-admins" },
    ]
  },
  {
    title: "GAME ENTITIES",
    items: [
      { icon: Package, label: "Manage Items", href: "/manage-items" },
      { icon: Ghost, label: "Manage Monsters", href: "/manage-monsters" },
      { icon: Swords, label: "Manage Dungeon", href: "/manage-dungeons" },
    ]
  },
  {
    title: "ECONOMY & SHOP",
    items: [
      { icon: ShoppingCart, label: "Manage Shop", href: "/manage-shop" },
      { icon: Gift, label: "Manage Gacha Pools", href: "/manage-gacha-pools" },
      { icon: CreditCard, label: "Manage Transaction", href: "/manage-transactions" },
    ]
  },
  {
    title: "GAME SYSTEMS",
    items: [
      { icon: Scroll, label: "Manage Quest", href: "/manage-quests" },
      { icon: Trophy, label: "Manage Achievement", href: "/manage-achievements" },
      { icon: Settings, label: "Manage Game Config", href: "/manage-game-config" },
    ]
  },
  {
    title: "COMMUNICATIONS",
    items: [
      { icon: FileText, label: "Manage Content", href: "/manage-content" },
      { icon: FolderOpen, label: "Manage Category", href: "/manage-category-content" },
      { icon: Mail, label: "Manage Mailbox", href: "/manage-mailbox" },
    ]
  }
];

export default function AdminSideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1a1a1a] border-r border-white/10 flex flex-col fixed left-0 top-0 h-full overflow-y-auto">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center border-b border-white/10">
        <Link href="/" className="relative w-32 h-12">
          <Image
            src="/images/logo/logo.png"
            alt="Mystic Journey Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-3">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={itemIdx}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
                        isActive 
                          ? "bg-[#ffc032]/10 text-[#ffc032]" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? "text-[#ffc032]" : "text-white/50 group-hover:text-white"}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
