"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Shield, Swords, Heart, ArrowRight } from "lucide-react";
import { CLASSES, STAT_MAX } from "@/lib/data/classes";

function StatBar({ label, value, barColor }: { label: string; value: number; barColor: string }) {
  const Icon = label === "HP" ? Heart : label === "ATK" ? Swords : Shield;
  const max = label === "HP" ? STAT_MAX.hp : label === "ATK" ? STAT_MAX.atk : STAT_MAX.def;
  const pct = Math.max(6, Math.round((value / max) * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-white/60">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <span className="text-white/70 font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

export default function WikiClassesPage() {
  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/10 py-10 md:py-14">
        {/* Ambient gold glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(85%,680px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[130px]" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <Users className="w-3.5 h-3.5" />
              Class Guide
            </span>
            <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Choose Your Class</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            Three distinct playstyles await. Compare their roles and strengths, then open a
            class for its full stats and skills.
          </p>
        </div>
      </div>

      {/* Class comparison cards */}
      <div className="max-w-[1200px] mx-auto w-full px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {CLASSES.map((cls) => (
            <Link
              key={cls.id}
              href={`/wiki/classes/${cls.id}`}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-[#111111] transition-all duration-300 hover:-translate-y-1 ${cls.accentBorder} hover:border-[#ffc032]/40 cursor-pointer`}
            >
              {/* Portrait */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d0d]">
                <Image
                  src={cls.image}
                  alt={cls.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#111111] via-transparent to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-1">
                  <h2 className="text-xl font-black text-white leading-tight">{cls.name}</h2>
                  <p className={`text-xs font-semibold uppercase tracking-wide ${cls.accentText}`}>
                    {cls.role}
                  </p>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mt-3 mb-4 line-clamp-3">
                  {cls.description}
                </p>

                {/* Comparison stat bars */}
                <div className="space-y-3 mt-auto">
                  <StatBar label="HP" value={cls.stats.hp} barColor={cls.barColor} />
                  <StatBar label="ATK" value={cls.stats.atk} barColor={cls.barColor} />
                  <StatBar label="DEF" value={cls.stats.def} barColor={cls.barColor} />
                </div>

                {/* View detail cue */}
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-white/50 group-hover:text-[#ffc032] transition-colors">
                  View class details
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
