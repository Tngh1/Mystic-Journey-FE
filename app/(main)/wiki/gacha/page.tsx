"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Gem, Star, Lock, Unlock, Zap, Crown } from "lucide-react";
import { getAll, getById } from "@/lib/api/gacha-banners";
import type { GachaBannerResponse, GachaBannerDetailResponse } from "@/lib/types";
import PageLoader from "@/components/ui/PageLoader";

const rarityColors = {
  common:    { bg: "bg-gray-500/20",   border: "border-gray-500/30",   text: "text-gray-400" },
  uncommon:  { bg: "bg-green-500/20",  border: "border-green-500/30",  text: "text-green-400" },
  rare:      { bg: "bg-blue-500/20",   border: "border-blue-500/30",   text: "text-blue-400" },
  epic:      { bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400" },
  legendary: { bg: "bg-amber-500/20",  border: "border-amber-500/30",  text: "text-amber-400" },
};

const typeColors: Record<string, { bg: string; text: string; label: string }> = {
  Standard:  { bg: "bg-blue-500/20",    text: "text-blue-400",   label: "Standard" },
  Weapon:    { bg: "bg-red-500/20",     text: "text-red-400",    label: "Weapon" },
  Character: { bg: "bg-purple-500/20",  text: "text-purple-400", label: "Character" },
  Limited:   { bg: "bg-orange-500/20",  text: "text-orange-400", label: "Limited" },
};

export default function WikiGachaPage() {
  const [banners, setBanners] = useState<GachaBannerResponse[]>([]);
  const [detail, setDetail] = useState<GachaBannerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAll(1, 50, { isActive: true });
      const active = res.items.filter((b) => {
        const now = new Date();
        const start = new Date(b.startAt);
        const end = new Date(b.endAt);
        return start <= now && now <= end;
      });
      setBanners(active);
      if (active.length > 0) {
        const d = await getById(active[0].gachaBannerId);
        setDetail(d);
      }
    } catch {
      setError("Failed to load gacha banners. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDetail = useCallback(async (bannerId: number) => {
    setDetailLoading(true);
    try {
      const d = await getById(bannerId);
      setDetail(d);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const formatDate = (s: string) => {
    try { return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return s; }
  };

  if (loading) return <PageLoader />;

  const featured = banners[0];
  const others = banners.slice(1);

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#ffc032]/10 to-transparent py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ffc032]/20 rounded-full mb-3">
            <Gem className="w-4 h-4 text-[#ffc032]" />
            <span className="text-[#ffc032] font-medium text-sm">Gacha Guide</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Gacha</h1>
          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">
            {banners.length > 0 ? `${banners.length} active banner${banners.length !== 1 ? "s" : ""}` : "No active banners right now"}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 pb-8 md:pb-12">

        {error ? (
          <div className="text-center py-20">
            <Gem className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-3">{error}</p>
            <button onClick={fetchBanners} className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm hover:bg-white/20 transition-colors cursor-pointer">
              Retry
            </button>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <Gem className="w-20 h-20 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg mb-2">No active banners</p>
            <p className="text-white/30 text-sm">Check back later for new banners</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ══ FEATURED BANNER ═══════════════════════════════════════ */}
            {featured && <FeaturedBanner banner={featured} detail={detail} detailLoading={detailLoading} onSelect={fetchDetail} others={others} />}

            {/* ══ OTHER ACTIVE BANNERS ═══════════════════════════════ */}
            {others.length > 0 && (
              <>
                <div className="flex items-center gap-3 mt-8 mb-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Other Active Banners</p>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {others.map((banner) => (
                    <OtherBannerCard
                      key={banner.gachaBannerId}
                      banner={banner}
                      detailLoading={detailLoading}
                      isSelected={detail?.gachaBannerId === banner.gachaBannerId}
                      onSelect={() => fetchDetail(banner.gachaBannerId)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedBanner({
  banner,
  detail,
  detailLoading,
  onSelect,
  others,
}: {
  banner: GachaBannerResponse;
  detail: GachaBannerDetailResponse | null;
  detailLoading: boolean;
  onSelect: (id: number) => void;
  others: GachaBannerResponse[];
}) {
  const tc = typeColors[banner.type] ?? typeColors.Standard;

  const rarities = ["common", "uncommon", "rare", "epic", "legendary"] as const;

  return (
    <div className="bg-white/5 border border-[#ffc032]/30 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#ffc032]/15 via-transparent to-transparent p-8">
        {/* Featured badge */}
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-[#ffc032] text-black rounded-full text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" /> Featured
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl ${tc.bg} flex items-center justify-center shrink-0`}>
            <Gem className={`w-12 h-12 ${tc.text}`} />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-3xl md:text-4xl font-black text-white">{banner.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tc.bg} ${tc.text}`}>
                {tc.label}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/55">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-[#ffc032]" />
                <span className="font-bold text-white text-lg">{banner.pullCost}</span>
                <span>Gems / pull</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Pity: {banner.pityLimit} pulls</span>
              </div>
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-green-400" />
                <span>{banner.startAt ? formatDate(banner.startAt) : "Permanent"}</span>
                <span className="text-white/25">—</span>
                <span>{banner.endAt ? formatDate(banner.endAt) : "Permanent"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {detailLoading && !detail ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#ffc032]/30 border-t-[#ffc032] rounded-full animate-spin" />
          </div>
        ) : detail ? (
          <>
            {/* Rates summary */}
            <div className="grid grid-cols-5 gap-3 mb-8">
              {rarities.map((rarity) => {
                const items = detail.bannerItems.filter(
                  (i) => (i.itemRarity ?? "").toLowerCase() === rarity
                );
                const rate = items.reduce((s, i) => s + i.dropRate, 0);
                const colors = rarityColors[rarity];
                if (rate === 0) return null;
                return (
                  <div
                    key={rarity}
                    className={`rounded-xl p-4 border text-center ${colors.border} ${colors.bg}`}
                  >
                    <p className={`text-2xl font-black ${colors.text}`}>{rate}%</p>
                    <p className={`text-xs font-semibold ${colors.text} capitalize mt-0.5`}>{rarity}</p>
                    <p className="text-white/25 text-[10px] mt-0.5">{items.length} items</p>
                  </div>
                );
              })}
            </div>

            {/* Items grid */}
            {detail.bannerItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {detail.bannerItems.map((item) => {
                  const rKey = (item.itemRarity ?? "common").toLowerCase() as keyof typeof rarityColors;
                  const colors = rarityColors[rKey] ?? rarityColors.common;
                  return (
                    <div
                      key={item.gachaBannerItemId}
                      className={`relative bg-white/5 border ${colors.border} rounded-xl p-3 text-center hover:bg-white/10 transition-colors`}
                    >
                      {item.isFeatured && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#ffc032] text-black rounded text-[10px] font-bold whitespace-nowrap">
                          FEATURED
                        </span>
                      )}
                      <div className="w-full aspect-square mb-2 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                        {item.itemIconUrl ? (
                          <Image
                            src={item.itemIconUrl}
                            alt={item.itemName ?? "Item"}
                            width={56}
                            height={56}
                            className="object-contain"
                          />
                        ) : (
                          <Gem className={`w-8 h-8 ${colors.text} opacity-40`} />
                        )}
                      </div>
                      <p className={`text-xs font-semibold ${colors.text} line-clamp-1 leading-tight`}>
                        {item.itemName ?? "Unknown"}
                      </p>
                      <p className="text-[10px] text-white/35 capitalize mt-0.5">{item.itemRarity ?? ""}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{item.dropRate}%</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-8">No items in this banner yet.</p>
            )}
          </>
        ) : (
          <p className="text-white/30 text-sm text-center py-8">Loading items...</p>
        )}
      </div>
    </div>
  );
}

function OtherBannerCard({
  banner,
  detailLoading,
  isSelected,
  onSelect,
}: {
  banner: GachaBannerResponse;
  detailLoading: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const tc = typeColors[banner.type] ?? typeColors.Standard;

  return (
    <button
      onClick={onSelect}
      disabled={detailLoading}
      className={`w-full text-left rounded-xl border p-5 transition-all cursor-pointer ${
        isSelected
          ? "bg-[#ffc032]/10 border-[#ffc032]/40"
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${tc.bg} flex items-center justify-center shrink-0`}>
          <Gem className={`w-6 h-6 ${tc.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white truncate">{banner.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tc.bg} ${tc.text}`}>
              {tc.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/45">
            <span className="flex items-center gap-1">
              <Gem className="w-3 h-3 text-[#ffc032]" />
              {banner.pullCost}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" />
              Pity {banner.pityLimit}
            </span>
            {banner.endAt && (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                {formatDate(banner.endAt)}
              </span>
            )}
          </div>
        </div>
        {isSelected && <Star className="w-5 h-5 text-[#ffc032] shrink-0" />}
      </div>
    </button>
  );
}

function formatDate(s: string) {
  try { return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
  catch { return s; }
}
