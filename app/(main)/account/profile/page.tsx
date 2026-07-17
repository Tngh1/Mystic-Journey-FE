"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User, Coins, Gem, Zap, Heart, Swords, Shield, Gauge,
  Target, Sparkles, Trophy, Skull, Star, AlertCircle, Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ProfileSidebar from "@/components/ui/ProfileSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getPlayerProfileById } from "@/lib/api/player-profiles";
import type { PlayerProfileWithStats } from "@/lib/types";

const classColors: Record<string, string> = {
  Knight: "text-red-400",
  Mage: "text-purple-400",
  Archer: "text-green-400",
};

function StatRow({ icon: Icon, color, label, value }: { icon: LucideIcon; color: string; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#0d0d0d] border border-white/10">
      <Icon className={`w-4 h-4 shrink-0 ${color}`} />
      <span className="text-xs text-white/50">{label}</span>
      <span className="text-sm font-semibold text-white ml-auto tabular-nums">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [data, setData] = useState<PlayerProfileWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user?.playerProfileId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    getPlayerProfileById(user.playerProfileId)
      .then((res) => { if (mounted) setData(res); })
      .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : "Failed to load profile."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [isLoading, user?.playerProfileId]);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center px-4">
        <div className="text-center bg-[#111111] border border-white/10 rounded-xl p-10 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Authenticated</h2>
          <p className="text-white/60 mb-8">Please log in to view your profile.</p>
          <Link href="/login" className="inline-block px-6 py-3 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] rounded-xl transition-colors font-semibold w-full cursor-pointer">
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const xpClass = classColors[data?.playerClass ?? ""] ?? "text-[#ffc032]";

  return (
    <div className="min-h-screen bg-black text-gray-300 font-['BeVietnamPro'] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <ProfileSidebar />

        <main className="flex-1 md:pl-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
              <User className="w-3.5 h-3.5" /> Character
            </span>
            <span className="h-px w-12 bg-linear-to-r from-[#ffc032]/60 to-transparent" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">Character Profile</h1>
          <p className="text-white/60 text-sm mb-10">Your hero&apos;s stats and progression.</p>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
            </div>
          ) : !user.playerProfileId || !data ? (
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No Character Yet</h2>
              <p className="text-white/50 text-sm max-w-md mx-auto">
                {error ?? "This account hasn't created a character. Start the game to create your hero."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Hero header */}
              <div className="flex items-center gap-5 bg-[#111111] border border-white/10 rounded-2xl p-6">
                <div className="w-20 h-20 rounded-2xl bg-[#0d0d0d] border-2 border-[#ffc032]/40 flex items-center justify-center overflow-hidden shrink-0">
                  {data.avatarUrl ? (
                    <Image src={data.avatarUrl} alt={data.displayName} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <User className="w-9 h-9 text-[#ffc032]" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-white truncate">{data.displayName}</h2>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className={`text-sm font-semibold ${xpClass}`}>{data.playerClass}</span>
                    <span className="inline-flex items-center gap-1 text-[#ffc032] font-bold text-sm">
                      <Star className="w-3.5 h-3.5" /> Level {data.level}
                    </span>
                    <span className="text-white/40 text-xs">{data.experiencePoints.toLocaleString()} XP</span>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-3">Resources</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatRow icon={Coins} color="text-yellow-400" label="Gold" value={Number(data.gold).toLocaleString()} />
                  <StatRow icon={Gem} color="text-blue-400" label="Gems" value={Number(data.gems).toLocaleString()} />
                  <StatRow icon={Zap} color="text-green-400" label="Energy" value={`${data.energy}/${data.maxEnergy}`} />
                  <StatRow icon={Sparkles} color="text-purple-400" label="Corruption" value={data.corruptionLevel} />
                </div>
              </section>

              {/* Combat stats */}
              {stats && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-3">Combat Stats</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatRow icon={Heart} color="text-red-400" label="HP" value={`${stats.currentHp}/${stats.maxHp}`} />
                    <StatRow icon={Swords} color="text-orange-400" label="ATK" value={stats.atk} />
                    <StatRow icon={Shield} color="text-blue-400" label="DEF" value={stats.def} />
                    <StatRow icon={Gauge} color="text-cyan-400" label="Move Speed" value={stats.moveSpeed} />
                    <StatRow icon={Gauge} color="text-teal-400" label="Atk Speed" value={stats.attackSpeed} />
                    <StatRow icon={Target} color="text-pink-400" label="Crit Rate" value={`${stats.critRate}%`} />
                    <StatRow icon={Zap} color="text-yellow-400" label="Crit DMG" value={`${stats.critDamage}%`} />
                    <StatRow icon={Swords} color="text-red-300" label="DMG Bonus" value={`${stats.damageBonus}%`} />
                    <StatRow icon={Sparkles} color="text-[#ffc032]" label="Skill Points" value={stats.skillPoints} />
                  </div>
                </section>
              )}

              {/* Record */}
              {stats && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/40 mb-3">Battle Record</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatRow icon={Trophy} color="text-green-400" label="Wins" value={stats.totalWins} />
                    <StatRow icon={Shield} color="text-red-400" label="Losses" value={stats.totalLosses} />
                    <StatRow icon={Swords} color="text-orange-400" label="Kills" value={stats.totalKills} />
                    <StatRow icon={Skull} color="text-white/60" label="Deaths" value={stats.totalDeaths} />
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
