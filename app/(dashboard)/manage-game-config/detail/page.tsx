"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Edit, Calendar, User, Tag, CheckCircle, XCircle } from "lucide-react";
import { getSettingByKey, GameSettingResponse } from "@/lib/api/game";

const getTypeFromKey = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("enable") || lowerKey.includes("active") || lowerKey.includes("is")) {
    return "boolean";
  }
  if (lowerKey.includes("count") || lowerKey.includes("amount") || lowerKey.includes("level") || lowerKey.includes("rate") || lowerKey.includes("time")) {
    return "number";
  }
  if (lowerKey.includes("json") || lowerKey.includes("data") || lowerKey.includes("config")) {
    return "json";
  }
  return "string";
};

const getCategoryFromKey = (key: string): string => {
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("player") || lowerKey.includes("xp") || lowerKey.includes("exp") || lowerKey.includes("level")) {
    return "Player";
  }
  if (lowerKey.includes("energy") || lowerKey.includes("stamina") || lowerKey.includes("mana")) {
    return "Energy";
  }
  if (lowerKey.includes("shop") || lowerKey.includes("price") || lowerKey.includes("cost") || lowerKey.includes("gem") || lowerKey.includes("gold")) {
    return "Shop";
  }
  if (lowerKey.includes("event") || lowerKey.includes("campaign")) {
    return "Events";
  }
  if (lowerKey.includes("battle") || lowerKey.includes("combat") || lowerKey.includes("pvp") || lowerKey.includes("dungeon")) {
    return "Battle";
  }
  if (lowerKey.includes("gacha") || lowerKey.includes("summon") || lowerKey.includes("draw")) {
    return "Gacha";
  }
  if (lowerKey.includes("social") || lowerKey.includes("friend") || lowerKey.includes("guild") || lowerKey.includes("chat")) {
    return "Social";
  }
  return "System";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function GameConfigDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [setting, setSetting] = useState<GameSettingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No ID provided");
      setLoading(false);
      return;
    }
    fetchSetting();
  }, [id]);

  const fetchSetting = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSettingByKey(id as string);
      setSetting(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch game setting");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ffc032] animate-spin" />
      </div>
    );
  }

  if (!setting) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Configuration not found"}</p>
          <Link
            href="/manage-game-config"
            className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  const type = getTypeFromKey(setting.key);
  const category = getCategoryFromKey(setting.key);

  return (
    <div className="min-h-screen bg-[#111] p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/manage-game-config"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#ffc032]" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Configuration Details</h1>
            </div>
            <Link
              href={`/manage-game-config/edit?id=${setting.key}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Detail Card */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
          {/* Key Header */}
          <div className="p-6 border-b border-[#333]">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono text-[#ffc032]">{setting.key}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  setting.isActive
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                }`}
              >
                {setting.isActive ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Inactive
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400">ID</p>
                <p className="text-white font-medium">{setting.gameSettingId}</p>
              </div>

              {/* Type */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Type</p>
                <span className="inline-block px-2 py-1 bg-[#252525] text-[#ffc032] rounded text-sm">
                  {type}
                </span>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Category</p>
                <span className="inline-block px-2 py-1 bg-[#252525] text-white rounded text-sm">
                  {category}
                </span>
              </div>

              {/* Value */}
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-400">Value</p>
                <div className="p-3 bg-[#111] border border-[#333] rounded-lg">
                  <code className="text-white font-mono text-sm break-all">{setting.value}</code>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-gray-400">Description</p>
                <p className="text-white">
                  {setting.description ?? <span className="text-gray-500 italic">No description</span>}
                </p>
              </div>

              {/* Created At */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created At
                </p>
                <p className="text-white">{formatDate(setting.createdAt)}</p>
              </div>

              {/* Updated At */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Updated At
                </p>
                <p className="text-white">{setting.updatedAt ? formatDate(setting.updatedAt) : <span className="text-gray-500 italic">Never</span>}</p>
              </div>

              {/* Updated By */}
              <div className="space-y-1">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Updated By
                </p>
                <p className="text-white">
                  {setting.updatedBy || <span className="text-gray-500 italic">Unknown</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[#333] bg-[#151515]">
            <div className="flex items-center gap-4">
              <Link
                href="/manage-game-config"
                className="flex items-center gap-2 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </Link>
              <Link
                href={`/manage-game-config/edit?id=${setting.key}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg font-semibold hover:bg-[#e6a82a] transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Configuration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
