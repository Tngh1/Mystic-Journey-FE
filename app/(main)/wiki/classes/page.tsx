"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Shield, Swords, Heart, ChevronRight, AlertCircle, Fingerprint } from "lucide-react";
import { CLASSES } from "@/lib/data/classes";
import { useClassConfigs, statCeilings, findConfig } from "@/lib/hooks/useClassConfigs";
import type { ClassConfigResponse } from "@/lib/api/characters";

const STAT_COLUMNS = [
  { key: "hp", label: "HP", Icon: Heart, read: (c: ClassConfigResponse) => c.maxHp },
  { key: "atk", label: "ATK", Icon: Swords, read: (c: ClassConfigResponse) => c.atk },
  { key: "def", label: "DEF", Icon: Shield, read: (c: ClassConfigResponse) => c.def },
] as const;

const PIPS = 8;

// Renders the stat column view component.
// Returns the JSX element hierarchy for the page view.
function StatColumn({
  label,
  Icon,
  value,
  max,
  barColor,
}: {
  label: string;
  Icon: typeof Heart;
  value: number;
  max: number;
  barColor: string;
}) {
  const filled = Math.max(1, Math.round((value / max) * PIPS));

  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      <span className="text-sm font-black tabular-nums text-parchment">{value}</span>

      <span
        role="img"
        aria-label={`${label} ${value} of ${max}`}
        className="flex h-16 w-full flex-col-reverse gap-0.5 border-2 border-black/60 bg-black/50 p-0.5 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.45)]"
      >
        {Array.from({ length: PIPS }, (_, i) => (
          <span
            key={i}
            className="block h-full w-full"
            style={i < filled ? { backgroundColor: barColor } : undefined}
          />
        ))}
      </span>

      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-parchment-dim">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

// Renders the stat columns skeleton view component.
// Returns the JSX element hierarchy for the page view.
function StatColumnsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3" aria-hidden="true">
      {STAT_COLUMNS.map((s) => (
        <div key={s.key} className="flex flex-col items-center gap-1.5">
          <span className="h-5 w-8 bg-black/40" />
          <span className="h-16 w-full border-2 border-black/60 bg-black/40" />
          <span className="h-3 w-9 bg-black/40" />
        </div>
      ))}
    </div>
  );
}

// Renders the wiki classes page view component.
// Returns the JSX element hierarchy for the page view.
export default function WikiClassesPage() {
  const { configs, error, loading } = useClassConfigs();
  const ceilings = configs ? statCeilings(configs) : null;

  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 md:px-6 md:py-16">
        <header className="mb-10 md:mb-12">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-accent">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Muster Roll
          </p>

          <div className="mt-3 flex items-center gap-4">
            <h1 className="shrink-0 text-3xl font-bold text-fg md:text-4xl lg:text-5xl">
              Choose Your Class
            </h1>
            <span className="h-0.5 flex-1 bg-line-strong" aria-hidden="true" />
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-fg-muted md:text-base">
            Three recruits stand for inspection. Their gauges are read straight from the
            game&apos;s own class table, so what you see here is what you will play.
          </p>
        </header>

        <p role="status" className="sr-only">
          {loading ? "Loading class stats" : ""}
        </p>

        {error && (
          <div
            role="alert"
            className="mb-8 flex flex-wrap items-center gap-3 border-2 border-black/70 bg-iron-dark px-4 py-3 shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-sm text-parchment">
              The class table could not be read. {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="pixel-press flex min-h-11 items-center border-2 border-accent bg-accent px-4 text-xs font-black uppercase tracking-widest text-on-accent hover:bg-accent-hover"
            >
              Try again
            </button>
          </div>
        )}

        <ol
          className="grid items-stretch gap-6 md:grid-cols-3 lg:gap-8"
          aria-busy={loading || undefined}
        >
          {CLASSES.map((cls, i) => {
            const cfg = findConfig(configs, cls.name);

            return (
              <li key={cls.id} className="flex">
                <Link
                  href={`/wiki/classes/${cls.id}`}
                  className="group flex w-full flex-col border-2 border-black/70 bg-slate shadow-[6px_6px_0_rgb(0_0_0_/_0.55)] transition-colors hover:border-accent"
                >
                  <div
                    className={`flex items-center justify-between gap-2 border-b-2 border-black/60 ${cls.accent} px-3 py-2`}
                  >
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-parchment-dim">
                      <Fingerprint className="h-3 w-3" aria-hidden="true" />
                      No. {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-parchment">
                      {cls.role}
                    </span>
                  </div>

                  <div className="relative aspect-3/4 w-full overflow-hidden border-b-2 border-black/60 bg-stone">
                    <Image
                      src={cls.image}
                      alt={cls.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      loading={i === 0 ? "eager" : "lazy"}
                      className="pixelated object-cover object-top"
                    />
                    <div
                      className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="pixel-scanlines absolute inset-0 opacity-20" aria-hidden="true" />

                    <h2 className="absolute inset-x-0 bottom-0 px-3 pb-3 text-2xl font-bold leading-none text-parchment">
                      {cls.name}
                    </h2>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 bg-iron-dark p-3">
                    {cfg && ceilings ? (
                      <div className="grid grid-cols-3 gap-3">
                        <StatColumn
                          label="HP"
                          Icon={Heart}
                          value={cfg.maxHp}
                          max={ceilings.hp}
                          barColor={cls.barColor}
                        />
                        <StatColumn
                          label="ATK"
                          Icon={Swords}
                          value={cfg.atk}
                          max={ceilings.atk}
                          barColor={cls.barColor}
                        />
                        <StatColumn
                          label="DEF"
                          Icon={Shield}
                          value={cfg.def}
                          max={ceilings.def}
                          barColor={cls.barColor}
                        />
                      </div>
                    ) : loading ? (
                      <StatColumnsSkeleton />
                    ) : (
                      <p className="py-4 text-center text-xs text-parchment-dim">
                        Gauges unavailable.
                      </p>
                    )}

                    <p className="border-t-2 border-black/40 pt-3 text-[13px] leading-relaxed text-parchment-dim">
                      {cls.description}
                    </p>

                    <p className="mt-auto flex items-center justify-between gap-2 border-t-2 border-black/40 pt-3 text-[11px] font-black uppercase tracking-widest text-parchment-dim">
                      {cls.playstyle}
                      <span className="flex shrink-0 items-center gap-1 text-accent">
                        File
                        <ChevronRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
