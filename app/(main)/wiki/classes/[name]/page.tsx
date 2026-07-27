"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Users, Shield, Swords, Heart, Zap, Star, Ghost,
  Sparkles, Clock, Lock, Gauge, Target, Layers, Footprints, Crosshair,
  Percent, TrendingUp, AlertCircle,
} from "lucide-react";
import { getSkills, type SkillResponse } from "@/lib/api/skills";
import { getClassBySlug, CLASSES } from "@/lib/data/classes";
import { useClassConfigs, findConfig } from "@/lib/hooks/useClassConfigs";
import Banner, { type BannerTone } from "@/components/ui/Banner";
import Panel from "@/components/ui/Panel";

/* The order's memorial bay.

   The old dossier was four wood planks in a 2×2 grid — the same furniture the
   wiki, the account pages and the admin keep were all using, so a class read as
   another record card. A class is the one page on this site about a *person*, so
   it gets its own architecture instead: a chapel bay.

     • The portrait stands in a leadlight window (`.leadlight`) glazed in the
       order's own heraldry, full height, with the name cut into the stone lintel
       across the head of it. That is the character profile — one subject, framed,
       not a card in a grid.
     • The figures are struck into a brass tablet bolted under the window, read
       as two engraved columns.
     • The techniques hang on an iron rack down the side, and the open one is
       chiselled onto a stone slab.

   Nothing about the data changed: still two independent reads, ClassConfigs and
   Skills, neither blocking the other. */

const SKILL_TYPE_TONES: Record<string, BannerTone> = {
  Active: "crimson",
  Passive: "royal",
  Buff: "pine",
  Debuff: "arcane",
};

/* One glyph per order, for the roster rail at the top of the bay. The accessible
   name is the class name — the icon is decorative. */
const CLASS_ICONS: Record<string, typeof Shield> = {
  knight: Shield,
  mage: Sparkles,
  archer: Target,
};

function SkillTypeIcon({ type, className }: { type: string; className?: string }) {
  const t = type.toLowerCase();
  if (t === "active") return <Zap className={className} />;
  if (t === "passive") return <Star className={className} />;
  if (t === "buff") return <Shield className={className} />;
  if (t === "debuff") return <Ghost className={className} />;
  return <Sparkles className={className} />;
}

/* A figure struck into the tablet: label engraved left, value right, so the
   column of numbers reads straight down. Tabular figures keep it from shifting
   as it changes. */
function StatLine({
  label,
  value,
  icon,
  last,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2 ${last ? "" : "border-b border-black/40"}`}
    >
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-parchment-dim">
        {icon}
        {label}
      </span>
      <span className="text-sm font-black tabular-nums text-parchment">{value}</span>
    </div>
  );
}

/* Rows held open at the right height while the tablet is in flight, so the bay
   does not resize when the numbers land. */
function StatLinesSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-3 py-2 ${i < rows - 1 ? "border-b border-black/40" : ""}`}
        >
          <span className="h-3 w-24 bg-parchment/10" />
          <span className="h-3 w-10 bg-parchment/10" />
        </div>
      ))}
    </div>
  );
}

export default function ClassDetailPage() {
  const params = useParams<{ name: string }>();
  const slug = params?.name ?? "";
  const gameClass = getClassBySlug(slug);

  /* Two independent reads: the stat line from ClassConfigs and the skill list
     from Skills. Neither blocks the other, so one archive being down only
     empties its own panel. */
  const { configs, error: statsError, loading: loadingStats } = useClassConfigs();

  const [skills, setSkills] = useState<SkillResponse[] | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    getSkills(1, 1000)
      .then((res) => { if (mounted) { setSkills(res.items); setSkillsError(null); } })
      .catch((e) => {
        if (mounted) setSkillsError(e instanceof Error ? e.message : "Failed to load skills.");
      });
    return () => { mounted = false; };
  }, []);

  const loadingSkills = !skills && !skillsError;

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
          className="pixel-press mt-2 flex h-11 items-center border-2 border-accent/50 px-4 text-sm font-black uppercase tracking-widest text-accent shadow-md transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
        >
          Back to classes
        </Link>
      </div>
    );
  }

  const cls = gameClass;
  const cfg = findConfig(configs, cls.name);
  const index = CLASSES.findIndex((c) => c.id === cls.id);
  const prevClass = CLASSES[(index - 1 + CLASSES.length) % CLASSES.length];
  const nextClass = CLASSES[(index + 1) % CLASSES.length];

  /* Every field of the live ClassConfig row, not just the three the roster page
     compares. Percentages carry their unit in the value so the label stays a
     plain noun. */
  const statRows = cfg
    ? [
        { label: "Max HP", value: cfg.maxHp, icon: <Heart className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Attack", value: cfg.atk, icon: <Swords className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Defence", value: cfg.def, icon: <Shield className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Move Speed", value: cfg.moveSpeed, icon: <Footprints className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Attack Speed", value: cfg.attackSpeed, icon: <Gauge className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Crit Rate", value: `${cfg.critRate}%`, icon: <Crosshair className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Crit Damage", value: `${cfg.critDamage}%`, icon: <Percent className="h-3.5 w-3.5" aria-hidden="true" /> },
        { label: "Damage Bonus", value: `${cfg.damageBonus}%`, icon: <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> },
      ]
    : [];

  return (
    <div className="min-h-dvh pb-16 pt-[88px] md:pt-[112px]">
      {/* Back link plus the roster rail. Not a hero band — the class name is the
          h1 on the window lintel below, so nothing competes with it here. */}
      <div className="relative border-b-2 border-black/60 py-8 md:py-10">
        <div className="relative z-10 mx-auto max-w-[1200px] px-4">
          <Link
            href="/wiki/classes"
            className="inline-flex h-11 items-center gap-1.5 text-sm font-bold text-parchment-dim transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Classes
          </Link>

          {/* Roster rail — the character-select strip carried through from the
              index page, so switching order stays one tap and the open one is
              marked by both its plate colour and a gold frame. */}
          <nav aria-label="Classes" className="mt-4 flex flex-wrap gap-2">
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
                      : "border-black/60 bg-iron text-parchment-dim hover:border-accent hover:text-parchment",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {c.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1200px] space-y-10 px-4 py-10 md:py-14">
        {/* ── The bay: the glazed window, and the brass tablet under it ────── */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-8">
          {/* The window. Masonry surround, stone lintel with the name cut into
              it, then the portrait behind leaded glass in the order's colours. */}
          <div className="stone-wall border-2 border-black/70 p-3 shadow-[6px_6px_0_rgb(0_0_0_/_0.55)]">
            {/* Lintel */}
            <div className="border-2 border-black/60 bg-stone-light px-3 py-2.5 shadow-[inset_0_2px_0_rgb(255_255_255_/_0.06)]">
              <h1 className="text-lg font-black uppercase tracking-[0.2em] text-parchment">
                {cls.name}
              </h1>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.28em] text-accent">
                {cls.role}
              </p>
            </div>

            {/* Glazing. The arch is stepped, not curved — four inset rows of
                masonry across the head, which is how a pixel arch is drawn. */}
            <div className={`relative mt-3 aspect-3/4 w-full overflow-hidden border-2 border-black/70 ${cls.accent}`}>
              <Image
                src={cls.image}
                alt={cls.name}
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="pixelated object-cover object-top"
                priority
              />
              {/* Leaded cames over the glass */}
              <div className="leadlight pointer-events-none absolute inset-0 opacity-45" aria-hidden="true" />
              {/* The stepped arch head, cut in masonry */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col" aria-hidden="true">
                {[10, 7, 4.5, 2.5].map((inset, i) => (
                  <span
                    key={i}
                    className="h-2 border-b border-black/50 bg-stone"
                    style={{ marginInline: `${inset}%` }}
                  />
                ))}
              </div>
              {/* Sill shadow, so the figure is not floating on the glass */}
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-transparent to-black/35"
                aria-hidden="true"
              />
              {/* Order device on the sill */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
                <Banner tone={cls.bannerTone} pennant={false} className="text-[10px]">
                  {cls.role}
                </Banner>
              </div>
            </div>

            {/* Dedication plate under the window */}
            <div className="mt-3 border-2 border-black/60 bg-black/35 p-3">
              <p className="text-sm leading-relaxed text-parchment-dim">{cls.description}</p>
              <p className="mt-3 flex items-start gap-2 border-t-2 border-black/40 pt-3 text-xs italic leading-relaxed text-parchment-dim/85">
                <Gauge className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {cls.playstyle}
              </p>
            </div>
          </div>

          {/* The brass tablet. Iron, not wood — the figures are struck, and it
              keeps the bay clear of the furniture idiom the wiki uses. */}
          <Panel material="iron" as="div" className="flex flex-col" aria-busy={loadingStats || undefined}>
            <div className="flex items-center justify-between gap-2 border-b-2 border-black/60 bg-black/35 px-4 py-2.5">
              <h2 className="text-sm font-black uppercase tracking-widest text-accent">
                Starting Line
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                Level 1
              </span>
            </div>

            <div className="p-4">
              {loadingStats && <p role="status" className="sr-only">Loading base stats…</p>}

              {cfg ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[statRows.slice(0, 4), statRows.slice(4)].map((group, gi) => (
                      <div
                        key={gi}
                        className="border-2 border-black/60 bg-black/30 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)]"
                      >
                        {group.map((r, i) => (
                          <StatLine
                            key={r.label}
                            label={r.label}
                            value={r.value}
                            icon={r.icon}
                            last={i === group.length - 1}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 border-t-2 border-black/40 pt-3 text-xs italic leading-relaxed text-parchment-dim/75">
                    The figures every new hero of this order is struck with, read live from the
                    archive.
                  </p>
                </>
              ) : loadingStats ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="border-2 border-black/60 bg-black/30 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)]"
                    >
                      <StatLinesSkeleton rows={4} />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  role="alert"
                  className="border-2 border-black/60 bg-black/30 px-3 py-3 text-xs leading-relaxed text-parchment-dim"
                >
                  <p className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
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
                      className="pixel-press mt-3 flex h-11 items-center border-2 border-accent/50 px-4 text-xs font-black uppercase tracking-widest text-accent shadow-md transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>
          </Panel>
        </section>

        {/* ── The technique rack, and the slab the open one is chiselled on ── */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-8">
          <Panel material="iron" as="div" className="flex flex-col" aria-busy={loadingSkills || undefined}>
            <div className="flex items-center justify-between gap-2 border-b-2 border-black/60 bg-black/35 px-4 py-2.5">
              <h2 className="text-sm font-black uppercase tracking-widest text-accent">Techniques</h2>
              {classSkills.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                  {classSkills.length}
                </span>
              )}
            </div>

            <div className="p-3">
              {loadingSkills ? (
                <>
                  <p role="status" className="sr-only">Loading skills…</p>
                  <ol className="space-y-1" aria-hidden="true">
                    {Array.from({ length: 6 }, (_, i) => (
                      <li key={i} className="flex min-h-11 items-center gap-3 border-2 border-transparent px-2">
                        <span className="h-7 w-7 shrink-0 border-2 border-black/50 bg-black/30" />
                        <span className="flex-1 space-y-1.5">
                          <span className="block h-3 w-28 bg-parchment/10" />
                          <span className="block h-2.5 w-16 bg-parchment/8" />
                        </span>
                      </li>
                    ))}
                  </ol>
                </>
              ) : skillsError ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 border-2 border-black/60 bg-black/30 px-3 py-2 text-xs leading-relaxed text-parchment-dim"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>The technique roll could not be read ({skillsError}).</span>
                </p>
              ) : classSkills.length === 0 ? (
                <div className="border-2 border-black/60 bg-black/30 px-3 py-4 text-center">
                  <Ghost className="mx-auto mb-2 h-8 w-8 text-parchment-dim/40" aria-hidden="true" />
                  <p className="text-xs italic text-parchment-dim/80">
                    No technique is recorded for this order yet.
                  </p>
                  <Link
                    href="/wiki/skills"
                    className="pixel-press mx-auto mt-3 flex h-11 w-fit items-center gap-1.5 border-2 border-accent/50 px-4 text-xs font-black uppercase tracking-widest text-accent shadow-md transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    Browse all skills
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <ol className="space-y-1">
                  {classSkills.map((skill) => {
                    const isOpen = selectedSkill?.skillId === skill.skillId;
                    return (
                      <li key={skill.skillId}>
                        <button
                          type="button"
                          onClick={() => setSelectedSkillId(skill.skillId)}
                          aria-pressed={isOpen}
                          className={[
                            "flex min-h-11 w-full cursor-pointer items-center gap-3 border-2 px-2 text-left transition-colors",
                            isOpen
                              ? "border-accent bg-black/35 text-parchment"
                              : "border-transparent text-parchment-dim hover:border-black/50 hover:text-parchment",
                          ].join(" ")}
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-black/50 bg-black/30 text-parchment">
                            <SkillTypeIcon type={skill.type} className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold">{skill.name}</span>
                            <span className="block truncate text-[11px] text-parchment-dim/80">
                              {skill.type} · Level {skill.unlockLevel}
                            </span>
                          </span>
                          {/* Open entry marked with a glyph as well as the gold
                              frame, so the state is not colour alone. */}
                          <ArrowRight
                            className={`h-3.5 w-3.5 shrink-0 ${isOpen ? "text-accent" : "text-parchment-dim/40"}`}
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </Panel>

          {/* Detail slab. Stone, not parchment: the figures are chiselled, which
              keeps the whole page off the book idiom. */}
          <Panel material="stone" as="div" className="flex flex-col">
            {selectedSkill ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/60 bg-black/25 px-4 py-2.5">
                  <h2 className="text-sm font-black uppercase tracking-widest text-parchment">
                    {selectedSkill.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <Banner
                      tone={SKILL_TYPE_TONES[selectedSkill.type] ?? "iron"}
                      pennant={false}
                      className="text-[10px]"
                    >
                      {selectedSkill.type}
                    </Banner>
                    <span className="flex items-center gap-1.5 border-2 border-black/50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-parchment-dim">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      Level {selectedSkill.unlockLevel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-4">
                  <p className="text-sm italic leading-relaxed text-parchment-dim">
                    {selectedSkill.description ??
                      "An ancient technique whose description has been lost to time."}
                  </p>

                  <div className="grid gap-x-4 sm:grid-cols-2">
                    {[
                      [
                        {
                          label: "Base Damage",
                          value: selectedSkill.baseDamage > 0 ? selectedSkill.baseDamage : "—",
                          icon: <Swords className="h-3.5 w-3.5" aria-hidden="true" />,
                        },
                        {
                          label: "Damage Type",
                          value: selectedSkill.damageType,
                          icon: <Target className="h-3.5 w-3.5" aria-hidden="true" />,
                        },
                      ],
                      [
                        {
                          label: "Cooldown",
                          value:
                            selectedSkill.cooldownSeconds > 0
                              ? `${selectedSkill.cooldownSeconds}s`
                              : "Instant",
                          icon: <Clock className="h-3.5 w-3.5" aria-hidden="true" />,
                        },
                        {
                          label: "Corruption Cost",
                          value: selectedSkill.corruptionCost > 0 ? selectedSkill.corruptionCost : "—",
                          icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
                        },
                      ],
                    ].map((group, gi) => (
                      <div
                        key={gi}
                        className="border-2 border-black/60 bg-black/25 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)] [&:not(:first-child)]:mt-4 sm:[&:not(:first-child)]:mt-0"
                      >
                        {group.map((r, i) => (
                          <StatLine
                            key={r.label}
                            label={r.label}
                            value={r.value}
                            icon={r.icon}
                            last={i === group.length - 1}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-56 flex-1 flex-col items-center justify-center p-6 text-center">
                <Layers className="mb-3 h-10 w-10 text-parchment-dim/40" aria-hidden="true" />
                <p className="text-sm font-bold uppercase tracking-widest text-parchment-dim">
                  {loadingSkills ? "Reading the roll…" : "Pick a technique"}
                </p>
                <p className="mt-1 text-xs italic text-parchment-dim/70">
                  Its figures are chiselled onto this slab.
                </p>
              </div>
            )}
          </Panel>
        </section>

        {/* Order-to-order navigation under the bay. */}
        <nav aria-label="Other classes" className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/wiki/classes/${prevClass.id}`}
            className="pixel-press flex min-h-11 items-center gap-2 border-2 border-black/60 bg-iron px-4 text-xs font-black uppercase tracking-widest text-parchment shadow-md transition-colors hover:border-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {prevClass.name}
          </Link>
          <Link
            href={`/wiki/classes/${nextClass.id}`}
            className="pixel-press flex min-h-11 items-center gap-2 border-2 border-black/60 bg-iron px-4 text-xs font-black uppercase tracking-widest text-parchment shadow-md transition-colors hover:border-accent"
          >
            {nextClass.name}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
