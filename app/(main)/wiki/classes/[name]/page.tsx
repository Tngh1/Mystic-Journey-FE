"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Users, Shield, Swords, Heart, Zap, Star, Ghost,
  Sparkles, Clock, Lock, Gauge, Target, Layers, Footprints, Crosshair,
  Percent, TrendingUp, AlertCircle, Fingerprint, ChevronRight,
} from "lucide-react";
import { getWikiSkills, type SkillResponse } from "@/lib/api/wiki";
import { getClassBySlug, CLASSES } from "@/lib/data/classes";
import { useClassConfigs, findConfig } from "@/lib/hooks/useClassConfigs";


const SKILL_TYPE_CLOTH: Record<string, string> = {
  Active: "bg-heraldry-crimson",
  Passive: "bg-heraldry-royal",
  Buff: "bg-heraldry-pine",
  Debuff: "bg-heraldry-arcane",
};

const CLASS_ICONS: Record<string, typeof Shield> = {
  knight: Shield,
  mage: Sparkles,
  archer: Target,
};

// Renders the skill type icon view component.
// Returns the JSX element hierarchy for the page view.
function SkillTypeIcon({ type, className }: { type: string; className?: string }) {
  const t = type.toLowerCase();
  if (t === "active") return <Zap className={className} />;
  if (t === "passive") return <Star className={className} />;
  if (t === "buff") return <Shield className={className} />;
  if (t === "debuff") return <Ghost className={className} />;
  return <Sparkles className={className} />;
}

// Renders the attribute cell view component.
// Returns the JSX element hierarchy for the page view.
function AttributeCell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="border-2 border-black/60 bg-black/30 px-3 py-2.5 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.45)]">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-parchment-dim">
        {icon}
        <span className="truncate">{label}</span>
      </p>
      <p className="mt-1 text-xl font-black tabular-nums text-parchment">{value}</p>
    </div>
  );
}

// Renders the attribute board skeleton view component.
// Returns the JSX element hierarchy for the page view.
function AttributeBoardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="border-2 border-black/60 bg-black/30 px-3 py-2.5">
          <span className="block h-3 w-16 bg-parchment/10" />
          <span className="mt-1.5 block h-6 w-12 bg-parchment/10" />
        </div>
      ))}
    </div>
  );
}

// Renders the class detail page view component.
// Returns the JSX element hierarchy for the page view.
export default function ClassDetailPage() {
  // Renders the params view component.
  // Returns the JSX element hierarchy for the page view.
  const params = useParams<{ name: string }>();
  const slug = params?.name ?? "";
  const gameClass = getClassBySlug(slug);

  const { configs, error: statsError, loading: loadingStats } = useClassConfigs();

  const [skills, setSkills] = useState<SkillResponse[] | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  // Load wiki skills when the dependencies change, update skills and skills error, and ignore stale callbacks after unmount.
  useEffect(() => {
    let mounted = true;
    getWikiSkills({ page: 1, pageSize: 1000 })
      .then((res) => { if (mounted) { setSkills(res.items); setSkillsError(null); } })
      .catch((e) => {
        if (mounted) setSkillsError(e instanceof Error ? e.message : "Failed to load skills.");
      });
    return () => { mounted = false; };
  }, []);

  const loadingSkills = !skills && !skillsError;

  // Renders the class skills view component.
  // Returns the JSX element hierarchy for the page view.
  const classSkills = useMemo(() => {
    if (!gameClass || !skills) return [];
    return skills
      .filter((s) => s.isActive && s.classRequirement === gameClass.name)
      .sort((a, b) => a.unlockLevel - b.unlockLevel);
  }, [skills, gameClass]);

  const selectedSkill =
    classSkills.find((s) => s.skillId === selectedSkillId) ?? classSkills[0] ?? null;

  if (!gameClass) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 pt-[88px] md:pt-[112px]">
        <Users className="h-16 w-16 text-fg-subtle" aria-hidden="true" />
        <h1 className="text-xl font-bold text-fg">Class not found</h1>
        <p className="text-sm text-fg-muted">No order is recorded under that name.</p>
        <Link
          href="/wiki/classes"
          className="pixel-press mt-2 flex h-11 items-center border-2 border-accent bg-accent px-4 text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
        >
          Back to classes
        </Link>
      </div>
    );
  }

  const cls = gameClass;
  const cfg = findConfig(configs, cls.name);
  // Renders the index view component.
  // Returns the JSX element hierarchy for the page view.
  const index = CLASSES.findIndex((c) => c.id === cls.id);
  const prevClass = CLASSES[(index - 1 + CLASSES.length) % CLASSES.length];
  const nextClass = CLASSES[(index + 1) % CLASSES.length];

  const attributes = cfg
    ? [
        { label: "Max HP", value: cfg.maxHp, icon: <Heart className="h-3 w-3" aria-hidden="true" /> },
        { label: "Attack", value: cfg.atk, icon: <Swords className="h-3 w-3" aria-hidden="true" /> },
        { label: "Defence", value: cfg.def, icon: <Shield className="h-3 w-3" aria-hidden="true" /> },
        { label: "Move Speed", value: cfg.moveSpeed, icon: <Footprints className="h-3 w-3" aria-hidden="true" /> },
        { label: "Atk Speed", value: cfg.attackSpeed, icon: <Gauge className="h-3 w-3" aria-hidden="true" /> },
        { label: "Crit Rate", value: `${cfg.critRate}%`, icon: <Crosshair className="h-3 w-3" aria-hidden="true" /> },
        { label: "Crit Damage", value: `${cfg.critDamage}%`, icon: <Percent className="h-3 w-3" aria-hidden="true" /> },
        { label: "Damage Bonus", value: `${cfg.damageBonus}%`, icon: <TrendingUp className="h-3 w-3" aria-hidden="true" /> },
      ]
    : [];

  const skillDetails = selectedSkill
    ? [
        {
          label: "Base Damage",
          value: selectedSkill.baseDamage > 0 ? selectedSkill.baseDamage : "—",
          icon: <Swords className="h-3 w-3" aria-hidden="true" />,
        },
        {
          label: "Damage Type",
          value: selectedSkill.damageType,
          icon: <Target className="h-3 w-3" aria-hidden="true" />,
        },
        {
          label: "Cooldown",
          value: selectedSkill.cooldownSeconds > 0 ? `${selectedSkill.cooldownSeconds}s` : "Instant",
          icon: <Clock className="h-3 w-3" aria-hidden="true" />,
        },
        {
          label: "Corruption Cost",
          value: selectedSkill.corruptionCost > 0 ? selectedSkill.corruptionCost : "—",
          icon: <Sparkles className="h-3 w-3" aria-hidden="true" />,
        },
      ]
    : [];

  return (
    <div className="min-h-dvh pb-16 pt-[88px] md:pt-[112px]">
      <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 py-10 md:px-6 md:py-14">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link
            href="/wiki/classes"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-bold text-fg-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Muster Roll
          </Link>

          <span className="h-0.5 flex-1 bg-line" aria-hidden="true" />

          <nav aria-label="Classes" className="flex flex-wrap gap-2">
            {CLASSES.map((c) => {
              const Icon = CLASS_ICONS[c.id] ?? Users;
              const active = c.id === cls.id;
              return (
                <Link
                  key={c.id}
                  href={`/wiki/classes/${c.id}`}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "pixel-press flex min-h-11 items-center gap-2 border-2 px-4 text-xs font-black uppercase tracking-widest shadow-md transition-colors",
                    active
                      ? `border-accent ${c.accent} ${c.accentText}`
                      : "border-black/60 bg-iron-dark text-parchment-dim hover:border-accent hover:text-parchment",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {c.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <article
          aria-labelledby="class-name"
          className="border-2 border-black/70 bg-slate shadow-[8px_8px_0_rgb(0_0_0_/_0.55)]"
        >
          <div
            className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-2 border-black/60 ${cls.accent} px-4 py-2`}
          >
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-parchment-dim">
              <Fingerprint className="h-3 w-3" aria-hidden="true" />
              Service Record · No. {String(index + 1).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-parchment">
              {cls.role}
            </p>
          </div>

          <div className="grid md:grid-cols-[minmax(0,17rem)_1fr]">
            <div className="relative aspect-3/4 w-full overflow-hidden border-b-2 border-black/60 bg-stone md:border-b-0 md:border-r-2">
              <Image
                src={cls.image}
                alt={cls.name}
                fill
                sizes="(min-width: 768px) 272px, 100vw"
                className="pixelated object-cover object-top"
                priority
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/25"
                aria-hidden="true"
              />
              <div className="pixel-scanlines absolute inset-0 opacity-20" aria-hidden="true" />
            </div>

            <div className="flex flex-col gap-4 p-4 md:p-6">
              <div>
                <h1
                  id="class-name"
                  className="text-4xl font-bold leading-none text-fg md:text-5xl"
                >
                  {cls.name}
                </h1>
                <p className="mt-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-accent">
                  {cls.role}
                  <span className="h-0.5 w-8 bg-accent/60" aria-hidden="true" />
                </p>
              </div>

              <p className="max-w-[60ch] text-sm leading-relaxed text-parchment-dim md:text-[15px]">
                {cls.description}
              </p>

              <p className="flex items-start gap-2 border-t-2 border-black/40 pt-3 text-xs italic leading-relaxed text-parchment-dim/85">
                <Gauge className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {cls.playstyle}
              </p>

              <div className="mt-auto" aria-busy={loadingStats || undefined}>
                <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-parchment-dim">
                  <Layers className="h-3 w-3" aria-hidden="true" />
                  Starting Line · Level 1
                </p>

                {loadingStats && <p role="status" className="sr-only">Loading base stats…</p>}

                {cfg ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {attributes.map((a) => (
                      <AttributeCell key={a.label} {...a} />
                    ))}
                  </div>
                ) : loadingStats ? (
                  <AttributeBoardSkeleton />
                ) : (
                  <div
                    role="alert"
                    className="border-2 border-black/60 bg-black/30 px-3 py-3 text-xs leading-relaxed text-parchment-dim"
                  >
                    <p className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" aria-hidden="true" />
                      <span>
                        {statsError
                          ? `The stat line could not be read from the archive (${statsError}).`
                          : `No stat line is recorded for the ${cls.name} order.`}
                      </span>
                    </p>
                    {statsError && (
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="pixel-press mt-3 flex min-h-11 items-center border-2 border-accent bg-accent px-4 text-xs font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>

        <section
          aria-labelledby="techniques"
          className="border-2 border-black/70 bg-slate shadow-[8px_8px_0_rgb(0_0_0_/_0.55)]"
          aria-busy={loadingSkills || undefined}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/60 bg-iron-dark px-4 py-2">
            <h2
              id="techniques"
              className="text-xs font-black uppercase tracking-[0.2em] text-accent"
            >
              Techniques
            </h2>
            {classSkills.length > 0 && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim tabular-nums">
                {classSkills.length} on record
              </p>
            )}
          </div>

          {loadingSkills ? (
            <>
              <p role="status" className="sr-only">Loading skills…</p>
              <div className="flex flex-wrap gap-1 border-b-2 border-black/60 bg-black/25 p-2" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="h-11 w-32 border-2 border-black/50 bg-black/30" />
                ))}
              </div>
              <div className="space-y-2 p-4" aria-hidden="true">
                <span className="block h-3 w-2/3 bg-parchment/10" />
                <span className="block h-3 w-1/2 bg-parchment/10" />
              </div>
            </>
          ) : skillsError ? (
            <div role="alert" className="p-4">
              <p className="flex items-start gap-2 border-2 border-black/60 bg-black/30 px-3 py-3 text-xs leading-relaxed text-parchment-dim">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" aria-hidden="true" />
                <span>The technique roll could not be read ({skillsError}).</span>
              </p>
            </div>
          ) : classSkills.length === 0 ? (
            <div className="p-6 text-center">
              <Ghost className="mx-auto mb-2 h-8 w-8 text-parchment-dim/40" aria-hidden="true" />
              <p className="text-xs italic text-parchment-dim/80">
                No technique is recorded for this order yet.
              </p>
              <Link
                href="/wiki/skills"
                className="pixel-press mx-auto mt-3 flex min-h-11 w-fit items-center gap-1.5 border-2 border-accent bg-accent px-4 text-xs font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
              >
                Browse all skills
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-wrap gap-1 border-b-2 border-black/60 bg-black/25 p-2">
                {classSkills.map((skill) => {
                  const isOpen = selectedSkill?.skillId === skill.skillId;
                  return (
                    <li key={skill.skillId}>
                      <button
                        type="button"
                        onClick={() => setSelectedSkillId(skill.skillId)}
                        aria-pressed={isOpen}
                        className={[
                          "flex min-h-11 cursor-pointer items-center gap-2 border-2 px-3 text-left transition-colors",
                          isOpen
                            ? "border-accent bg-iron text-parchment shadow-md"
                            : "border-black/50 bg-iron-dark text-parchment-dim hover:border-accent/60 hover:text-parchment",
                        ].join(" ")}
                      >
                        <SkillTypeIcon type={skill.type} className="h-3.5 w-3.5 shrink-0" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold">{skill.name}</span>
                          <span className="block truncate text-[10px] font-bold uppercase tracking-widest text-parchment-dim/80 tabular-nums">
                            Lv {skill.unlockLevel}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {selectedSkill && (
                <div className="grid gap-5 p-4 md:grid-cols-[1fr_minmax(0,20rem)] md:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-fg">{selectedSkill.name}</h3>
                      <span
                        className={`flex items-center gap-1.5 border-2 border-black/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-parchment ${
                          SKILL_TYPE_CLOTH[selectedSkill.type] ?? "bg-iron"
                        }`}
                      >
                        <SkillTypeIcon type={selectedSkill.type} className="h-3 w-3" />
                        {selectedSkill.type}
                      </span>
                      <span className="flex items-center gap-1.5 border-2 border-black/60 bg-black/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-parchment-dim tabular-nums">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        Level {selectedSkill.unlockLevel}
                      </span>
                    </div>

                    <p className="mt-3 max-w-[62ch] text-sm italic leading-relaxed text-parchment-dim">
                      {selectedSkill.description ??
                        "An ancient technique whose description has been lost to time."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 self-start">
                    {skillDetails.map((d) => (
                      <AttributeCell key={d.label} {...d} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <nav aria-label="Other classes" className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/wiki/classes/${prevClass.id}`}
            className="pixel-press flex min-h-11 items-center gap-2 border-2 border-black/60 bg-iron-dark px-4 text-xs font-black uppercase tracking-widest text-parchment shadow-md transition-colors hover:border-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {prevClass.name}
          </Link>
          <Link
            href={`/wiki/classes/${nextClass.id}`}
            className="pixel-press flex min-h-11 items-center gap-2 border-2 border-black/60 bg-iron-dark px-4 text-xs font-black uppercase tracking-widest text-parchment shadow-md transition-colors hover:border-accent"
          >
            {nextClass.name}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
