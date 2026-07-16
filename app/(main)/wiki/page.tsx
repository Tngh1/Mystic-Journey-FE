"use client";

import Link from "next/link";
import {
  Sparkles, Leaf, Flame, Snowflake, Zap,
  Package, Users, Ghost, Castle, Scroll, Trophy, Gem, Map, ArrowRight, Wand2,
} from "lucide-react";

const WIKI_SHORTCUTS = [
  { name: "Items",        href: "/wiki/items",        icon: <Package className="w-6 h-6" />, accent: "#60a5fa", description: "Weapons, armor and consumables." },
  { name: "Classes",      href: "/wiki/classes",      icon: <Users   className="w-6 h-6" />, accent: "#f97316", description: "Playable classes and roles." },
  { name: "Skills",       href: "/wiki/skills",       icon: <Wand2   className="w-6 h-6" />, accent: "#818cf8", description: "Active and passive abilities." },
  { name: "Monsters",     href: "/wiki/monsters",     icon: <Ghost   className="w-6 h-6" />, accent: "#f87171", description: "Enemies and bosses." },
  { name: "Dungeons",     href: "/wiki/dungeons",     icon: <Castle  className="w-6 h-6" />, accent: "#c084fc", description: "Challenging dungeons." },
  { name: "Quests",       href: "/wiki/quests",       icon: <Scroll  className="w-6 h-6" />, accent: "#4ade80", description: "Story and side quests." },
  { name: "Achievements", href: "/wiki/achievements", icon: <Trophy  className="w-6 h-6" />, accent: "#fbbf24", description: "Trophies and milestones." },
  { name: "Gacha",        href: "/wiki/gacha",        icon: <Gem     className="w-6 h-6" />, accent: "#ffc032", description: "Banners and drop rates." },
  { name: "Maps",         href: "/wiki/maps",         icon: <Map     className="w-6 h-6" />, accent: "#2dd4bf", description: "Regions and secrets." },
];

const CHAPTERS = [
  { title: "Elf Forest",       sub: "Chapter I — Prologue of the Green Realm",   icon: <Leaf className="w-5 h-5" />,      tone: "text-green-400" },
  { title: "Autumn Pumpkin",   sub: "Chapter II — Harvest of the Burning Fields", icon: <Flame className="w-5 h-5" />,     tone: "text-orange-400" },
  { title: "Frozen Mountains", sub: "Chapter III — The Eternal Blizzard",         icon: <Snowflake className="w-5 h-5" />, tone: "text-sky-400" },
  { title: "Vestige of an Era", sub: "Chapter IV — Echoes of the Fallen Kingdom", icon: <Zap className="w-5 h-5" />,       tone: "text-purple-400" },
];

export default function WikiPage() {
  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      <main className="flex-1 min-w-0">
        {/* Featured banner */}
        <div className="relative overflow-hidden py-10 md:py-16 border-b border-white/10 bg-black">
          {/* Ambient gold glow */}
          <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-[min(80%,640px)] rounded-full bg-[#ffc032]/10 blur-[130px]" />

          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="relative z-10 max-w-[1200px]">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="w-3.5 h-3.5 text-[#ffc032]" />
                <span className="text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">Mystic Journey</span>
                <span className="h-px w-12 bg-linear-to-r from-[#ffc032]/60 to-transparent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Mystic Journey Wiki
              </h1>
              <p className="text-white/60 text-base mb-6 max-w-xl leading-relaxed">
                Your comprehensive guide to the world of Mystic Journey. Discover weapons, monsters, dungeons, quests, achievements, maps and the gacha system across every chapter of the adventure.
              </p>

              {/* Chapter badges */}
              <div className="flex gap-3 overflow-x-auto pb-1 nice-scrollbar">
                {CHAPTERS.map((ch) => (
                  <Link
                    key={ch.title}
                    href="/wiki/maps"
                    className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-xl hover:border-[#ffc032]/40 transition-all cursor-pointer group shrink-0"
                  >
                    <span className={ch.tone}>{ch.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white group-hover:text-[#ffc032] transition-colors leading-none mb-0.5">{ch.title}</p>
                      <p className="text-[10px] text-white/45 leading-none">{ch.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Shortcuts */}
        <section className="border-b border-white/10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 md:py-12">
            <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Quick Shortcuts</h2>
                <p className="text-white/50 text-sm mt-1">Jump straight to any section of the wiki.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {WIKI_SHORTCUTS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative bg-[#111111] border border-white/10 rounded-2xl p-4 hover:border-[#ffc032]/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 cursor-pointer"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${item.accent}20`, color: item.accent }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#ffc032] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{item.description}</p>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#ffc032] group-hover:translate-x-1 transition-all absolute top-4 right-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
