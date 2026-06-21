'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Shield, User, Heart, Sword, ShieldCheck, Zap, Skull } from 'lucide-react';
import { getPlayerProfileAdmin, updatePlayerProfileAdmin, PlayerProfileWithStats } from '@/lib/api/player-profile';
import type { PlayerStatsResponse } from '@/lib/types';

const classColors: Record<string, string> = {
  Knight: 'bg-red-500/20 text-red-400 border-red-500/30',
  Mage: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Archer: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function EditPlayerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    displayName: string;
    avatarUrl: string;
    playerClass: string;
    level: number;
    experiencePoints: number;
    gold: number;
    gems: number;
    energy: number;
    isBanned: boolean;
  }>({
    displayName: '',
    avatarUrl: '',
    playerClass: 'Knight',
    level: 1,
    experiencePoints: 0,
    gold: 0,
    gems: 0,
    energy: 100,
    isBanned: false,
  });

  const [stats, setStats] = useState<PlayerStatsResponse | null>(null);

  useEffect(() => {
    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  const fetchPlayer = async () => {
    if (!playerId) return;

    try {
      setLoading(true);
      setError(null);
      const data: PlayerProfileWithStats = await getPlayerProfileAdmin(Number(playerId));

      setFormData({
        displayName: data.displayName,
        avatarUrl: data.avatarUrl || '',
        playerClass: data.playerClass,
        level: data.level,
        experiencePoints: data.experiencePoints,
        gold: data.gold,
        gems: data.gems,
        energy: data.energy,
        isBanned: data.isBanned,
      });

      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load player profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await updatePlayerProfileAdmin(Number(playerId), formData);
      setSuccess(true);

      setTimeout(() => {
        router.push('/manage-players');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update player profile');
    } finally {
      setSaving(false);
    }
  };

  if (!playerId) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">No player ID provided</p>
            <Link href="/manage-players" className="text-[#ffc032] hover:underline mt-2 inline-block">
              Back to Players List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/manage-players"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ffc032] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
              <User className="w-8 h-8 text-[#111]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#ffc032]">Update Player</h1>
              <p className="text-gray-400">Update player profile information</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-400">Player profile updated successfully! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Edit Form */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ffc032]" />
                Profile Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Player Class</label>
                  <select
                    name="playerClass"
                    value={formData.playerClass}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                  >
                    <option value="Knight">Knight</option>
                    <option value="Mage">Mage</option>
                    <option value="Archer">Archer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
                  <input
                    type="number"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Gold</label>
                  <input
                    type="number"
                    name="gold"
                    value={formData.gold}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Gems</label>
                  <input
                    type="number"
                    name="gems"
                    value={formData.gems}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Energy</label>
                  <input
                    type="number"
                    name="energy"
                    value={formData.energy}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isBanned"
                    id="isBanned"
                    checked={formData.isBanned}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-700 bg-[#0d0d0d] text-red-500 focus:ring-[#ffc032] focus:ring-offset-0"
                  />
                  <label htmlFor="isBanned" className="text-sm font-medium text-gray-300">
                    Banned
                  </label>
                </div>
              </div>
            </div>

            {/* Stats Display */}
            {stats && (
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#ffc032]" />
                  Player Stats (Read-Only)
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Max HP</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.maxHp}</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-orange-400 mb-2">
                      <Sword className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Attack</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.atk}</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Defense</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.def}</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Crit Rate</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.critRate}%</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-pink-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Crit Damage</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.critDamage}%</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Wins</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{stats.totalWins}</p>
                  </div>

                  <div className="bg-[#0d0d0d] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <Skull className="w-4 h-4" />
                      <span className="text-sm text-gray-400">Losses</span>
                    </div>
                    <p className="text-2xl font-bold text-red-400">{stats.totalLosses}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/manage-players"
                className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "Updating..." : "Update Player"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
