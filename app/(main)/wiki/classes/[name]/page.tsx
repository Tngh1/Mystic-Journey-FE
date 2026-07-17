"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Users, Shield, Swords, Heart, Zap, Star, Ghost,
  Sparkles, Clock, Lock, Gauge,
} from "lucide-react";
import { getSkills, type SkillResponse } from "@/lib/api/skills";
import { getClassBySlug, SHARED_STATS, STAT_MAX } from "@/lib/data/classes";
import PageLoader from "@/components/ui/PageLoader";

const skillTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Active:  { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  Passive: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  Buff:    { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  Debuff:  { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
};

function SkillTypeIcon({ type, className }: { type: string; className?: string }) {
  const t = type.toLowerCase();
  if (t === "active") return <Zap className={className} />;
  if (t === "passive") return <Star className={className} />;
  if (t === "buff") return <Shield className={className} />;
  if (t === "debuff") return <Ghost className={className} />;
  return <Sparkles className={className} />;
}

function BigStat({ label, value, max, barColor }: { label: string; value: number; max: number; barColor: string }) {
  const Icon = label === "HP" ? Heart : label === "ATK" ? Swords : Shield;
  const pct = Math.max(6, Math.round((value / max) * 100));
  return (
    <div className="rounded-xl bg-[#0d0d0d] border border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/50 font-semibold">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <span className="text-lg font-black text-white tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const slug = params?.name ?? "";
  const gameClass = getClassBySlug(slug);

  const [skills, setSkills] = useState<SkillResponse[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingSkills(true);
    getSkills(1, 1000)
      .then((res) => { if (mounted) setSkills(res.items); })
      .catch(() => { if (mounted) setSkills([]); })
      .finally(() => { if (mounted) setLoadingSkills(false); });
    return () => { mounted = false; };
  }, []);

  const classSkills = useMemo(() => {
    if (!gameClass) return [];
    return skills
      .filter((s) => s.isActive && s.classRequirement === gameClass.name)
      .sort((a, b) => a.unlockLevel - b.unlockLevel);
  }, [skills, gameClass]);

  if (!gameClass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-[88px] md:pt-[112px] px-4">
        <Users className="w-16 h-16 text-white/20" />
        <h2 className="text-xl font-bold text-white">Class not found</h2>
        <button
          onClick={() => router.push("/wiki/classes")}
          className="px-4 py-2 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-xl cursor-pointer transition-colors"
        >
          Back to classes
        </button>
      </div>
    );
  }

  const cls = gameClass;

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px] pb-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/wiki/classes"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#ffc032] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </Link>
          <span className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
        </div>

        {/* Header */}
        <div className={`relative rounded-3xl border ${cls.accentBorder} overflow-hidden bg-linear-to-b from-white/[0.04] to-transparent`}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cls.barColor }} />
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-5 md:p-6">
            {/* Portrait */}
            <div className="relative aspect-[3/4] w-full max-w-[240px] mx-auto md:mx-0 rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10">
              <Image src={cls.image} alt={cls.name} fill sizes="240px" className="object-cover object-top" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className={`text-3xl md:text-4xl font-black ${cls.accentText}`}>{cls.name}</h1>
              </div>
              <p className={`text-sm font-semibold uppercase tracking-wide mt-1 ${cls.accentText}`}>{cls.role}</p>
              <p className="text-white/65 text-sm leading-relaxed mt-3">{cls.description}</p>

              <div className="rounded-xl bg-[#0d0d0d] border border-white/10 p-3 mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1">Playstyle</p>
                <p className="text-xs text-white/70 leading-relaxed">{cls.playstyle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Base stats */}
        <section className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Gauge className="w-4 h-4 text-[#ffc032]" />
            <h2 className="text-lg font-bold text-white">Base Stats</h2>
            <span className="text-xs text-white/30">· Level 1</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <BigStat label="HP" value={cls.stats.hp} max={STAT_MAX.hp} barColor={cls.barColor} />
            <BigStat label="ATK" value={cls.stats.atk} max={STAT_MAX.atk} barColor={cls.barColor} />
            <BigStat label="DEF" value={cls.stats.def} max={STAT_MAX.def} barColor={cls.barColor} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {SHARED_STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-[#111111] border border-white/10 px-4 py-3 text-center">
                <p className="text-base font-bold text-white tabular-nums">{s.value}</p>
                <p className="text-[11px] text-white/45 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#ffc032]" />
            <h2 className="text-lg font-bold text-white">Class Skills</h2>
            {!loadingSkills && (
              <span className="text-xs text-white/30">· {classSkills.length}</span>
            )}
          </div>

          {loadingSkills ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-[#111111] border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : classSkills.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-[#111111] border border-white/10">
              <Sparkles className="w-12 h-12 text-white/15 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No skills found for {cls.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {classSkills.map((skill) => {
                const tc = skillTypeColors[skill.type] ?? { bg: "bg-white/10", text: "text-white/60", border: "border-white/10" };
                return (
                  <div
                    key={skill.skillId}
                    className="group rounded-2xl bg-[#111111] border border-white/10 p-5 hover:border-[#ffc032]/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${tc.bg} ${tc.text} ${tc.border}`}>
                        <SkillTypeIcon type={skill.type} className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white group-hover:text-[#ffc032] transition-colors">{skill.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tc.bg} ${tc.text} ${tc.border}`}>
                            {skill.type}
                          </span>
                        </div>
                        <p className="text-white/55 text-xs leading-relaxed mt-1 line-clamp-2">
                          {skill.description ?? "No description available."}
                        </p>
                      </div>
                    </div>

                    {/* Skill meta */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-white/50">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Lv. {skill.unlockLevel}
                      </span>
                      {skill.cooldownSeconds > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {skill.cooldownSeconds}s
                        </span>
                      )}
                      {skill.baseDamage > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Swords className="w-3.5 h-3.5 text-orange-400" />
                          {skill.baseDamage} dmg
                        </span>
                      )}
                      {skill.corruptionCost > 0 && (
                        <span className="inline-flex items-center gap-1 text-purple-400">
                          <Sparkles className="w-3.5 h-3.5" />
                          {skill.corruptionCost}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
