"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Shield, Swords, Heart, ArrowRight, AlertCircle } from "lucide-react";
import { CLASSES } from "@/lib/data/classes";
import { useClassConfigs, statCeilings, findConfig } from "@/lib/hooks/useClassConfigs";
import type { ClassConfigResponse } from "@/lib/api/characters";
import Panel from "@/components/ui/Panel";
import MoonHeader from "@/components/ui/MoonHeader";

/* The three stats every plate compares. `read` pulls the value off the live
   ClassConfig row, so the row component never has to know which field of the API
   shape a label maps to. */
const STAT_ROWS = [
  { key: "hp", label: "HP", Icon: Heart, read: (c: ClassConfigResponse) => c.maxHp },
  { key: "atk", label: "ATK", Icon: Swords, read: (c: ClassConfigResponse) => c.atk },
  { key: "def", label: "DEF", Icon: Shield, read: (c: ClassConfigResponse) => c.def },
] as const;

/* Ten discrete blocks rather than a percentage fill — a smooth bar is the wrong
   idiom here. The value is always printed alongside, so meaning never rests on
   colour. */
function StatRow({
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
  const filled = Math.max(1, Math.round((value / max) * 10));
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-12 shrink-0 items-center gap-1 text-[11px] font-bold uppercase text-parchment-dim">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </span>
      <span className="flex flex-1 gap-0.5" role="img" aria-label={`${label} ${value} of ${max}`}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="h-2 flex-1 border border-black/40"
            style={{ backgroundColor: i < filled ? barColor : "rgb(0 0 0 / 0.4)" }}
          />
        ))}
      </span>
      <span className="w-9 shrink-0 text-right text-[11px] font-bold tabular-nums text-parchment">
        {value}
      </span>
    </div>
  );
}

/* The stat block while the table is in flight: the same three rows at the same
   heights, so the card does not resize when the numbers land. */
function StatRowsSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {STAT_ROWS.map((s) => (
        <div key={s.key} className="flex items-center gap-2">
          <span className="flex w-12 shrink-0 items-center gap-1 text-[11px] font-bold uppercase text-parchment-dim/50">
            <s.Icon className="h-3 w-3" />
            {s.label}
          </span>
          <span className="flex flex-1 gap-0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="h-2 flex-1 border border-black/40 bg-black/40" />
            ))}
          </span>
          <span className="h-3 w-9 shrink-0 bg-parchment/10" />
        </div>
      ))}
    </div>
  );
}

export default function WikiClassesPage() {
  const { configs, error, loading } = useClassConfigs();
  const ceilings = configs ? statCeilings(configs) : null;

  return (
    <div className="min-h-dvh pt-[88px] md:pt-[112px]">
      <MoonHeader eyebrow="Class Guide" icon={Users} title="Choose Your Class">
        Three distinct playstyles await. Compare their roles and strengths, then open a
        class for its full stats and skills.
      </MoonHeader>

      {/* The classes are not codex entries to be read in a tome — they are a
          roster to be picked from, so this is the game's own character-select
          idiom: three tall banner plaques hung side by side on the hall wall. */}
      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-16">
        {loading && <p role="status" className="sr-only">Loading class stats…</p>}

        {/* The art and lore are local, so only the numbers wait on the network:
            a failed fetch degrades one block per plaque, not the roster. */}
        {error && (
          <Panel material="iron" role="alert" className="mb-8 flex items-start gap-3 px-4 py-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-parchment-dim">
              Base stats could not be read from the archive ({error}). The orders below are still
              described in full.{" "}
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="cursor-pointer font-bold text-accent underline decoration-accent/50 underline-offset-2 hover:decoration-accent"
              >
                Try again
              </button>
            </p>
          </Panel>
        )}

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8" aria-busy={loading || undefined}>
          {CLASSES.map((cls) => {
            const cfg = findConfig(configs, cls.name);
            return (
              <Panel
                key={cls.id}
                as="article"
                material="wood"
                className="group flex flex-col transition-colors hover:border-accent"
              >
                {/* Name plate — the order's heraldic cloth hung across the top of
                    the frame. Ink is parchment on all three (≥7:1). */}
                <div className={`flex items-center justify-between gap-2 border-b-2 border-black/60 ${cls.accent} px-4 py-2.5`}>
                  <h2 className={`text-sm font-black uppercase tracking-widest ${cls.accentText}`}>
                    {cls.name}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                    {cls.role}
                  </span>
                </div>

                {/* Portrait, sunk into the frame like a painted panel. No
                    scale-on-hover — a smooth zoom is the modern-web tell the
                    pixel system rules out. */}
                <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-black/50 bg-stone">
                  <Image
                    src={cls.image}
                    alt={cls.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="pixelated object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col gap-4 p-4">
                  {/* Stat slot, carved into the plank: reversed bevel so it reads
                      as recessed rather than raised. */}
                  <div className="space-y-2 border-2 border-black/60 bg-wood-dark p-3 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.5)]">
                    {cfg && ceilings ? (
                      STAT_ROWS.map((s) => (
                        <StatRow
                          key={s.key}
                          label={s.label}
                          Icon={s.Icon}
                          value={s.read(cfg)}
                          max={ceilings[s.key]}
                          barColor={cls.barColor}
                        />
                      ))
                    ) : loading ? (
                      <StatRowsSkeleton />
                    ) : (
                      <p className="py-1 text-xs italic text-parchment-dim/70">Stat line unavailable.</p>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-parchment-dim">{cls.description}</p>

                  <p className="flex items-start gap-2 border-t-2 border-black/40 pt-3 text-xs italic leading-relaxed text-parchment-dim/85">
                    {cls.playstyle}
                  </p>

                  <Link
                    href={`/wiki/classes/${cls.id}`}
                    className="pixel-press mt-auto flex min-h-11 w-full items-center justify-center gap-2 border-2 border-accent/50 px-4 text-sm font-black uppercase tracking-widest text-accent shadow-md transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                  >
                    View {cls.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
