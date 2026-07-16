"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, Sword, Shield, Heart, Sparkles, Box,
  Star, Layers, HeartPulse, Zap, Gauge, Activity,
} from "lucide-react";
import { getById, type ItemResponse } from "@/lib/api/items";
import PageLoader from "@/components/ui/PageLoader";

function hasStat(v: number | null | undefined): boolean {
  return typeof v === "number" && !Number.isNaN(v) && v !== 0;
}

type StatRowData = {
  label: string;
  value: number | null | undefined;
  suffix?: string;
};

type StatGroupData = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  rows: StatRowData[];
};

type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
const RARITY_KEYS: ItemRarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

const rarityMeta: Record<ItemRarity, {
  border: string; text: string; ring: string;
  badgeBg: string; badgeText: string;
  barColor: string; hex: string;
}> = {
  common:    { border: "border-gray-500/40",   text: "text-gray-300",   ring: "ring-gray-500/30",   badgeBg: "bg-gray-500/20",   badgeText: "text-gray-300",   barColor: "#9ca3af", hex: "#9ca3af" },
  uncommon:  { border: "border-green-500/40",  text: "text-green-300",  ring: "ring-green-500/30",  badgeBg: "bg-green-500/20",  badgeText: "text-green-300",  barColor: "#4ade80", hex: "#4ade80" },
  rare:      { border: "border-blue-500/40",   text: "text-blue-300",   ring: "ring-blue-500/30",   badgeBg: "bg-blue-500/20",   badgeText: "text-blue-300",   barColor: "#60a5fa", hex: "#60a5fa" },
  epic:      { border: "border-purple-500/40", text: "text-purple-300", ring: "ring-purple-500/30", badgeBg: "bg-purple-500/20", badgeText: "text-purple-300", barColor: "#c084fc", hex: "#c084fc" },
  legendary: { border: "border-amber-500/50",  text: "text-amber-300",  ring: "ring-amber-500/40",  badgeBg: "bg-amber-500/20",  badgeText: "text-amber-300",  barColor: "#fbbf24", hex: "#fbbf24" },
  mythic:    { border: "border-red-500/50",    text: "text-red-300",    ring: "ring-red-500/40",    badgeBg: "bg-red-500/20",    badgeText: "text-red-300",    barColor: "#f87171", hex: "#f87171" },
};

const rarityLabels: Record<ItemRarity, string> = {
  common: "Common", uncommon: "Uncommon", rare: "Rare",
  epic: "Epic", legendary: "Legendary", mythic: "Mythic",
};

function normalizeRarity(r?: string | null): ItemRarity {
  const n = r?.trim().toLowerCase();
  return RARITY_KEYS.includes(n as ItemRarity) ? (n as ItemRarity) : "common";
}

function formatNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  if (Number.isInteger(n)) return n.toLocaleString("en-US");
  return n.toFixed(1).replace(/\.0$/, "");
}

function TypeIcon({ type, size = 14 }: { type: string; size?: number }) {
  const t = type.toLowerCase();
  if (t.includes("weapon")) return <Sword style={{ width: size, height: size }} />;
  if (t.includes("armor")) return <Shield style={{ width: size, height: size }} />;
  if (t.includes("consumable")) return <Heart style={{ width: size, height: size }} />;
  if (t.includes("quest")) return <Sparkles style={{ width: size, height: size }} />;
  if (t.includes("material")) return <Box style={{ width: size, height: size }} />;
  return <Package style={{ width: size, height: size }} />;
}

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    getById(Number(id))
      .then((res) => { if (mounted) setItem(res); })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load item."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const meta = useMemo(() => item ? rarityMeta[normalizeRarity(item.rarity)] : null, [item]);

  if (loading) return <PageLoader />;

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 pt-[88px] md:pt-[112px] px-4">
        <Package className="w-16 h-16 text-white/20" />
        <h2 className="text-xl font-bold text-white">
          {error ? "Unable to load item" : "Item not found"}
        </h2>
        {error && <p className="text-white/50 text-sm max-w-md text-center">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/wiki/items")}
            className="px-4 py-2 bg-[#ffc032]/10 hover:bg-[#ffc032]/20 text-[#ffc032] border border-[#ffc032]/30 rounded-xl cursor-pointer transition-colors"
          >
            Back to items
          </button>
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#ffc032] text-black font-semibold rounded-xl cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const r = normalizeRarity(item.rarity);

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px] pb-16">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Breadcrumb / Back */}
        <div className="mb-5 flex items-center gap-3">
          <Link
            href="/wiki/items"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-[#ffc032] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Items
          </Link>
          <span className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
        </div>

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className={`relative rounded-3xl border ${meta?.border} overflow-hidden bg-linear-to-b from-white/[0.04] to-transparent p-5 md:p-6`}>
          {/* Rarity top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: meta?.barColor }}
          />
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${meta?.barColor} 0%, transparent 50%)`,
            }}
          />

          <div className="relative flex items-start gap-4 md:gap-5">
            {/* Icon */}
            <div className={`relative shrink-0 w-[96px] h-[96px] md:w-[120px] md:h-[120px] rounded-2xl ring-2 ${meta?.ring} bg-black/40 flex items-center justify-center overflow-hidden`}>
              {item.iconUrl ? (
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <TypeIcon type={item.type} size={64} />
              )}
            </div>

            {/* Name + chips + description */}
            <div className="flex-1 min-w-0">
              <h1 className={`text-2xl md:text-3xl font-black ${meta?.text} truncate`}>
                {item.name}
              </h1>

              {/* 3 chips: Type / Rarity / Stack */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70 font-semibold">
                  <TypeIcon type={item.type} size={12} />
                  {item.type}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${meta?.border} ${meta?.badgeBg} ${meta?.badgeText}`}>
                  <Star className="w-3 h-3" />
                  {rarityLabels[r]}
                </span>
                {item.maxStack > 1 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70 font-semibold">
                    <Layers className="w-3 h-3" />
                    Stack {item.maxStack}
                  </span>
                )}
              </div>

              {/* Description inline (truncated) */}
              {item.description && (
                <p className="text-white/55 text-sm mt-2.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Item ID watermark */}
            <span className="hidden md:block absolute top-2 right-3 text-[10px] text-white/25 font-mono">
              #{item.itemId}
            </span>
          </div>
        </div>

        {/* ── Body: Stats (grouped Base / Bonus / Ratio) ─────────── */}
        <div className="mt-5 space-y-4">
          {(() => {
            const totalHp  = (item.baseHp  ?? 0) + (item.bonusHp  ?? 0);
            const totalAtk = (item.baseAtk ?? 0) + (item.bonusAtk ?? 0);
            const totalDef = (item.baseDef ?? 0) + (item.bonusDef ?? 0);
            const showTotals = totalHp !== 0 || totalAtk !== 0 || totalDef !== 0;

            const baseRows: StatRowData[] = [
              { label: "HP",  value: item.baseHp  },
              { label: "ATK", value: item.baseAtk },
              { label: "DEF", value: item.baseDef },
            ].filter((r) => hasStat(r.value));

            const bonusRows: StatRowData[] = [
              { label: "HP",                  value: item.bonusHp,             suffix: " HP" },
              { label: "ATK",                 value: item.bonusAtk,            suffix: " ATK" },
              { label: "DEF",                 value: item.bonusDef,            suffix: " DEF" },
            ].filter((r) => hasStat(r.value));

            const ratioRows: StatRowData[] = [
              { label: "Crit Rate",     value: item.bonusCritRate,   suffix: "%" },
              { label: "Crit Damage",   value: item.bonusCritDamage, suffix: "%" },
            ].filter((r) => hasStat(r.value));

            const groups: StatGroupData[] = [
              {
                key: "base",
                title: "Base",
                subtitle: "Core stats of the equipment",
                icon: <Activity className="w-4 h-4" />,
                rows: baseRows,
              },
              {
                key: "bonus",
                title: "Bonus",
                subtitle: "Additional stats granted",
                icon: <Zap className="w-4 h-4" />,
                rows: bonusRows,
              },
              {
                key: "ratio",
                title: "Ratio",
                subtitle: "Percentage-based stats",
                icon: <Gauge className="w-4 h-4" />,
                rows: ratioRows,
              },
            ].filter((g) => g.rows.length > 0);

            const hasAnyStats = showTotals || groups.length > 0;
            if (!hasAnyStats) return null;

            return (
              <>
                {showTotals && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">
                      Total
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {totalHp !== 0 && (
                        <TotalStat
                          label="HP"
                          icon={<HeartPulse className="w-3.5 h-3.5" />}
                          value={totalHp}
                        />
                      )}
                      {totalAtk !== 0 && (
                        <TotalStat
                          label="ATK"
                          icon={<Sword className="w-3.5 h-3.5" />}
                          value={totalAtk}
                        />
                      )}
                      {totalDef !== 0 && (
                        <TotalStat
                          label="DEF"
                          icon={<Shield className="w-3.5 h-3.5" />}
                          value={totalDef}
                        />
                      )}
                    </div>
                  </div>
                )}

                {groups.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {groups.map((g) => (
                      <StatGroup key={g.key} title={g.title} subtitle={g.subtitle} icon={g.icon}>
                        {g.rows.map((r) => (
                          <StatRow key={r.label} label={r.label} value={r.value} suffix={r.suffix} />
                        ))}
                      </StatGroup>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, suffix }: { label: string; value: number | null | undefined; suffix?: string }) {
  if (!hasStat(value)) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-black/25 border border-white/5">
      <span className="text-sm text-white/65">{label}</span>
      <span className="text-sm font-bold tabular-nums text-white">
        {formatNumber(value)}{suffix ?? ""}
      </span>
    </div>
  );
}

function StatGroup({
  title, subtitle, icon, children,
}: {
  title: string; subtitle?: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[#ffc032]">{icon}</span>
        <p className="text-[11px] uppercase tracking-widest text-white/70 font-bold">{title}</p>
      </div>
      {subtitle && (
        <p className="text-[10px] text-white/30 mb-3 pl-6">{subtitle}</p>
      )}
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function TotalStat({
  label, icon, value,
}: {
  label: string; icon: React.ReactNode; value: number;
}) {
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2.5 text-center">
      <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45 font-semibold">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-black tabular-nums text-[#ffc032]">
        {formatNumber(value)}
      </div>
    </div>
  );
}