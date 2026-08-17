"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/api/dashboard";
import PageLoader from "@/components/ui/PageLoader";
import {
  Users, UserCircle, Package, Ghost, Activity,
  LayoutDashboard, Wifi, WifiOff, AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import OnlinePlayersChart, { type OnlineSample } from "@/components/ui/OnlinePlayersChart";
import Panel from "@/components/ui/Panel";
import PageHeader from "@/components/ui/PageHeader";
import type { DashboardStatsResponse } from "@/lib/types";


interface StatTileData {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "default" | "gold" | "success";
}

const TONE_PLATE: Record<StatTileData["tone"], string> = {
  default: "bg-iron text-parchment",
  gold: "bg-accent text-on-accent",
  success: "bg-heraldry-pine text-parchment",
};

const TONE_VALUE: Record<StatTileData["tone"], string> = {
  default: "text-fg",
  gold: "text-accent",
  success: "text-success",
};

// Renders the stat tile view component.
// Returns the JSX element hierarchy for the page view.
function StatTile({ label, value, icon: Icon, tone }: StatTileData) {
  return (
    <Panel material="plate" className="flex items-start justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-parchment-dim">
          {label}
        </p>
        <p className={`mt-1 truncate text-2xl font-black tabular-nums ${TONE_VALUE[tone]}`}>
          {value}
        </p>
      </div>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black/60 shadow-sm ${TONE_PLATE[tone]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
    </Panel>
  );
}

// Renders the section head view component.
// Returns the JSX element hierarchy for the page view.
function SectionHead({
  title,
  icon: Icon,
  note,
}: {
  title: string;
  icon?: LucideIcon;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-accent">
        {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
        {title}
      </h2>
      <span className="h-0.5 flex-1 bg-line" aria-hidden="true" />
      {note && (
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
          {note}
        </span>
      )}
    </div>
  );
}

// Renders the dashboard page view component.
// Key functionality: manages local UI state, pagination, and filter values; fetches asynchronous page data on initial load and parameter changes.
// Returns the JSX element hierarchy for the page view.
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);  // Initialize loading flag as active on first render
  const [error, setError] = useState<string | null>(null);
  const [samples, setSamples] = useState<OnlineSample[]>([]);

  // Load stats when the dependencies change, update stats, error, samples, loading, and interval, and ignore stale callbacks after unmount.
  useEffect(() => {
    let cancelled = false;

    // Renders the load view component.
    // Returns the JSX element hierarchy for the page view.
    const load = () =>
      getStats()
        .then((data) => {
          if (cancelled) return;
          setStats(data);
          setError(null);
          setSamples((prev) =>
            [...prev, { t: Date.now(), online: data.onlinePlayers }].slice(-120),
          );
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

    load();
    const interval = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of the Mystic Journey game system."
          icon={LayoutDashboard}
        />
        <Panel material="plate" className="flex items-start gap-3 p-4" role="alert">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <p className="text-sm text-fg">{error || "No data available"}</p>
        </Panel>
      </div>
    );
  }

  const liveStats: StatTileData[] = [
    { label: "Players Online", value: stats.onlinePlayers.toLocaleString(), icon: Wifi, tone: "success" },
    { label: "Players Offline", value: stats.offlinePlayers.toLocaleString(), icon: WifiOff, tone: "default" },
  ];

  const entityStats: StatTileData[] = [
    { label: "Total Players", value: stats.totalPlayers.toLocaleString(), icon: Users, tone: "default" },
    { label: "Total Accounts", value: stats.totalAccounts.toLocaleString(), icon: UserCircle, tone: "default" },
    { label: "Total Items", value: stats.totalItems.toLocaleString(), icon: Package, tone: "default" },
    { label: "Total Monsters", value: stats.totalMonsters.toLocaleString(), icon: Ghost, tone: "default" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of the Mystic Journey game system."
        icon={LayoutDashboard}
      />

      <section className="space-y-3">
        <SectionHead title="Live" icon={Wifi} note="Auto-refreshes every 30s" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {liveStats.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHead title="Game Entities" icon={Package} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {entityStats.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      </section>

      <Panel material="plate" as="section" className="overflow-hidden">
        <div className="flex items-center gap-2.5 border-b-2 border-black/60 bg-iron-dark px-5 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-black/60 bg-iron text-parchment shadow-sm">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="text-xs font-black uppercase tracking-[0.15em] text-accent">
            Players Online
          </h2>
        </div>
        <div className="p-5">
          <OnlinePlayersChart samples={samples} />
        </div>
      </Panel>
    </div>
  );
}
