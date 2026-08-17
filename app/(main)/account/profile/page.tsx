"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User, Coins, Gem, Zap, Heart, Swords, Shield, Gauge,
  Target, Sparkles, Trophy, Skull, AlertCircle, Activity, ScrollText,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import Panel from "@/components/ui/Panel";
import Banner from "@/components/ui/Banner";
import Tapestry, { type TapestryDye } from "@/components/ui/Tapestry";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getPlayerProfileById } from "@/lib/api/player-profiles";
import { CLASSES } from "@/lib/data/classes";
import type { PlayerProfileWithStats } from "@/lib/types";

// Renders the meter view component.
// Returns the JSX element hierarchy for the page view.
function Meter({ value, max, tint }: { value: number; max: number; tint: string }) {
  const filled = max > 0 ? Math.round((Math.min(Math.max(value, 0), max) / max) * 10) : 0;
  return (
    <span className="flex w-20 shrink-0 gap-0.5" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="h-2 flex-1 border border-black/50"
          style={{ backgroundColor: i < filled ? tint : "rgb(0 0 0 / 0.35)" }}
        />
      ))}
    </span>
  );
}

// Renders the gauged view component.
// Returns the JSX element hierarchy for the page view.
function Gauged({ value, max, tint }: { value: number; max: number; tint: string }) {
  return (
    <span className="flex items-center justify-end gap-2">
      <Meter value={value} max={max} tint={tint} />
      <span className="tabular-nums">{value}/{max}</span>
    </span>
  );
}

// Renders the thread row view component.
// Returns the JSX element hierarchy for the page view.
function ThreadRow({
  label,
  value,
  icon,
  last,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-3 py-2 ${last ? "" : "border-b border-black/35"}`}
    >
      <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-parchment-dim">
        {icon}
        {label}
      </span>
      <span className="text-sm font-bold text-parchment">{value}</span>
    </div>
  );
}

// Renders the sheet hanging view component.
// Returns the JSX element hierarchy for the page view.
function SheetHanging({
  title,
  icon: Icon,
  rows,
  dye,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  rows: { label: string; value: ReactNode; icon?: ReactNode }[];
  dye: TapestryDye;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  className?: string;
}) {
  return (
    <Tapestry
      as="section"
      dye={dye}
      title={title}
      titleAs="h3"
      icon={<Icon className="h-4 w-4 text-accent" aria-hidden="true" />}
      bodyClassName="p-2"
      className={className}
    >
      <div className="border-2 border-black/50 bg-black/25 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.4)]">
        {rows.map((r, i) => (
          <ThreadRow key={r.label} {...r} last={i === rows.length - 1} />
        ))}
      </div>
    </Tapestry>
  );
}

const thread = "h-3.5 w-3.5 text-parchment-dim";

// Renders the profile page view component.
// Returns the JSX element hierarchy for the page view.
export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<PlayerProfileWithStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const profileId = user?.playerProfileId;

  // Load player profile by id when the dependencies change, update data and error, and ignore stale callbacks after unmount.
  useEffect(() => {
    if (isLoading || !profileId) return;
    let mounted = true;
    getPlayerProfileById(profileId)
      .then((res) => { if (mounted) { setData(res); setError(null); } })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load profile."); });
    return () => { mounted = false; };
  }, [isLoading, profileId]);

  const loading = Boolean(profileId) && !data && !error;

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 pb-16 pt-[88px] md:pt-[112px]">
        <Panel material="iron" rivets className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-fg">Not Authenticated</h1>
          <p className="mt-3 text-sm text-fg-muted">
            Sign in to see your hanging.
          </p>
          <Link
            href="/login"
            className="pixel-press mt-6 flex h-11 w-full items-center justify-center bg-accent text-sm font-black uppercase tracking-widest text-on-accent shadow-md transition-colors hover:bg-accent-hover"
          >
            Login
          </Link>
        </Panel>
      </div>
    );
  }

  const stats = data?.stats;
  // Renders the cls view component.
  // Returns the JSX element hierarchy for the page view.
  const cls = CLASSES.find((c) => c.name === data?.playerClass);
  const dye: TapestryDye =
    cls && (["royal", "crimson", "pine", "arcane", "ember"] as const).includes(
      cls.bannerTone as TapestryDye,
    )
      ? (cls.bannerTone as TapestryDye)
      : "royal";

  return (
    <div className="min-h-dvh pb-16 pt-[88px] md:pt-[112px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 md:flex-row md:gap-8 lg:px-6">
        <ProfileSidebar />

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-accent">
              <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
              Character
            </span>
            <span className="h-0.5 flex-1 bg-line" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-fg md:text-4xl">Character Sheet</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Your hero, woven as the heralds have them.
          </p>

          {loading ? (
            <div className="mt-8 space-y-6" aria-busy="true">
              <p role="status" className="sr-only">Loading your character sheet…</p>
              <Tapestry dye="royal" bodyClassName="p-4">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5" aria-hidden="true">
                  <span className="h-20 w-20 shrink-0 border-2 border-accent-deep/40 bg-black/40" />
                  <span className="w-full space-y-2">
                    <span className="block h-7 w-48 bg-parchment/10" />
                    <span className="block h-5 w-32 bg-parchment/8" />
                  </span>
                </div>
              </Tapestry>
              <div className="grid gap-6 md:grid-cols-2">
                {[9, 4, 4].map((rows, g) => (
                  <Tapestry
                    key={g}
                    dye="royal"
                    bodyClassName="p-2"
                    className={g === 0 ? "md:row-span-2" : ""}
                  >
                    <div className="border-2 border-black/50 bg-black/25" aria-hidden="true">
                      {Array.from({ length: rows }, (_, r) => (
                        <div
                          key={r}
                          className={`flex items-center justify-between px-3 py-2 ${r > 0 ? "border-t border-black/35" : ""}`}
                        >
                          <span className="h-3 w-20 bg-parchment/10" />
                          <span className="h-3 w-10 bg-parchment/10" />
                        </div>
                      ))}
                    </div>
                  </Tapestry>
                ))}
              </div>
            </div>
          ) : error ? (
            <Panel material="iron" rivets className="mt-8 p-10 text-center" role="alert">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-fg">Hanging Unreadable</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="pixel-press mx-auto mt-6 flex h-11 items-center justify-center bg-accent px-5 text-sm font-black uppercase tracking-widest text-on-accent shadow-md transition-colors hover:bg-accent-hover"
              >
                Try Again
              </button>
            </Panel>
          ) : !data ? (
            <Panel material="iron" rivets className="mt-8 p-10 text-center">
              <Swords className="mx-auto mb-4 h-12 w-12 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-fg">No Character Yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-fg-muted">
                This account hasn&apos;t created a hero. Install the game and the
                weavers will start your hanging on your first step into the forest.
              </p>
              <Link
                href="/download"
                className="pixel-press mx-auto mt-6 flex h-11 w-fit items-center justify-center bg-accent px-5 text-sm font-black uppercase tracking-widest text-on-accent shadow-md transition-colors hover:bg-accent-hover"
              >
                Get the Game
              </Link>
            </Panel>
          ) : (
            <div className="mt-8 space-y-6">

              <Tapestry dye={dye} bodyClassName="p-4 md:p-5">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-5 sm:text-left">
                  <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border-2 border-accent-deep/60 bg-black/50 shadow-[inset_2px_2px_0_rgb(0_0_0_/_0.45)]">
                    {data.avatarUrl ? (
                      <Image
                        src={data.avatarUrl}
                        alt=""
                        width={80}
                        height={80}
                        className="pixelated h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-9 w-9 text-parchment-dim" aria-hidden="true" />
                    )}
                  </span>

                  <div className="min-w-0">
                    <h2 className="truncate text-2xl font-black text-parchment md:text-3xl">
                      {data.displayName}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <Banner tone="iron" pennant={false}>{data.playerClass}</Banner>
                      <Banner tone="gilt" pennant={false}>Level {data.level}</Banner>
                      <span className="text-xs tabular-nums text-parchment-dim">
                        {data.experiencePoints.toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                </div>
              </Tapestry>


              <div className="grid gap-6 md:grid-cols-2">
                {stats && (
                  <SheetHanging
                    title="Combat"
                    icon={Swords}
                    dye={dye}
                    className="md:row-span-2"
                    rows={[
                      {
                        label: "HP",
                        icon: <Heart className={thread} aria-hidden="true" />,
                        value: <Gauged value={stats.currentHp} max={stats.maxHp} tint="#b9503c" />,
                      },
                      { label: "ATK", icon: <Swords className={thread} aria-hidden="true" />, value: stats.atk },
                      { label: "DEF", icon: <Shield className={thread} aria-hidden="true" />, value: stats.def },
                      { label: "Move Speed", icon: <Gauge className={thread} aria-hidden="true" />, value: stats.moveSpeed },
                      { label: "Atk Speed", icon: <Gauge className={thread} aria-hidden="true" />, value: stats.attackSpeed },
                      { label: "Crit Rate", icon: <Target className={thread} aria-hidden="true" />, value: `${stats.critRate}%` },
                      { label: "Crit DMG", icon: <Zap className={thread} aria-hidden="true" />, value: `${stats.critDamage}%` },
                      { label: "DMG Bonus", icon: <Activity className={thread} aria-hidden="true" />, value: `${stats.damageBonus}%` },
                      { label: "Skill Points", icon: <Sparkles className={thread} aria-hidden="true" />, value: stats.skillPoints },
                    ]}
                  />
                )}

                <SheetHanging
                  title="Resources"
                  icon={Coins}
                  dye={dye}
                  rows={[
                    { label: "Gold", icon: <Coins className={thread} aria-hidden="true" />, value: Number(data.gold).toLocaleString() },
                    { label: "Gems", icon: <Gem className={thread} aria-hidden="true" />, value: Number(data.gems).toLocaleString() },
                    {
                      label: "Energy",
                      icon: <Zap className={thread} aria-hidden="true" />,
                      value: <Gauged value={data.energy} max={data.maxEnergy} tint="#5a806a" />,
                    },
                    { label: "Corruption", icon: <Sparkles className={thread} aria-hidden="true" />, value: data.corruptionLevel },
                  ]}
                />

                {stats && (
                  <SheetHanging
                    title="Battle Record"
                    icon={Trophy}
                    dye={dye}
                    rows={[
                      { label: "Wins", icon: <Trophy className={thread} aria-hidden="true" />, value: stats.totalWins },
                      { label: "Losses", icon: <Shield className={thread} aria-hidden="true" />, value: stats.totalLosses },
                      { label: "Kills", icon: <Swords className={thread} aria-hidden="true" />, value: stats.totalKills },
                      { label: "Deaths", icon: <Skull className={thread} aria-hidden="true" />, value: stats.totalDeaths },
                    ]}
                  />
                )}
              </div>

              <p className="text-center text-[10px] tracking-wider text-fg-subtle">
                Hanging № {data.playerProfileId}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
