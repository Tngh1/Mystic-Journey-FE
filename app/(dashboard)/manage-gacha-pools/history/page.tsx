"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GachaPullHistoryResponse, getPlayerGachaStats } from "@/lib/api/gacha-banners";
import { banPlayer } from "@/lib/api/admin-accounts";
import { showSuccessAlert, showErrorAlert, showBanReasonPrompt } from "@/lib/utils/swal";
import type { PlayerGachaStatsResponse } from "@/lib/types";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import { History, Star, ShieldAlert } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const RARITY_CHIP: Record<string, string> = {
  Legendary: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  Epic: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  Rare: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  Uncommon: "bg-green-500/15 text-green-400 border border-green-500/30",
  Common: "bg-white/10 text-white/60 border border-white/20",
};

function RarityChip({ rarity }: { rarity: string | null }) {
  const cls = rarity ? (RARITY_CHIP[rarity] ?? RARITY_CHIP.Common) : RARITY_CHIP.Common;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      <Star className="w-3 h-3" />
      {rarity ?? "Unknown"}
    </span>
  );
}

const RARITIES = [
  { value: "Legendary", label: "Legendary" },
  { value: "Epic", label: "Epic" },
  { value: "Rare", label: "Rare" },
  { value: "Uncommon", label: "Uncommon" },
  { value: "Common", label: "Common" },
];

export default function GachaHistoryPage() {
  const router = useRouter();
  const [filterRarity, setFilterRarity] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const buildParams = () => ({
    ...(filterRarity ? { rarity: filterRarity } : {}),
  });

  const { data, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<GachaPullHistoryResponse>({
      endpoint: "/api/gachabanners/history/admin",
      pageSize: 20,
      params: buildParams(),
    });

  const handleFilterChange = (value: string) => {
    setFilterRarity(value);
    setPage(1);
    setParams(buildParams());
  };

  const columns = [
    { key: "gachaPullHistoryId", label: "ID", sortable: false },
    { 
      key: "playerProfileId", 
      label: "Player ID", 
      sortable: false,
      render: (val: number) => (
        <button 
          onClick={() => setSelectedPlayerId(val)}
          className="text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
        >
          {val}
        </button>
      )
    },
    { key: "bannerName", label: "Banner", sortable: false },
    {
      key: "rewardItemName",
      label: "Item Received",
      sortable: false,
      render: (val: string, row: GachaPullHistoryResponse) => (
        <div className="flex items-center gap-2">
          {row.rewardItemIconUrl && (
            <img src={row.rewardItemIconUrl} alt={val} className="w-8 h-8 rounded object-cover" />
          )}
          <div>
            <p className="text-sm font-medium text-white">{val ?? "Unknown"}</p>
            <RarityChip rarity={row.rewardItemRarity} />
          </div>
        </div>
      ),
    },
    { key: "pullCount", label: "Pulls", sortable: false },
    {
      key: "costSpent",
      label: "Cost",
      sortable: false,
      render: (val: number) => <span className="text-[#ffc032] font-semibold">{val} 💎</span>,
    },
    {
      key: "pulledAt",
      label: "Date",
      sortable: false,
      render: (val: string) => new Date(val).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center shrink-0">
            <History className="w-7 h-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Gacha Pull History</h1>
            <p className="text-sm text-gray-500">View all player pull records across all banners</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/manage-gacha-pools")}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#ffc032]/30 text-[#ffc032] bg-[#ffc032]/10 hover:bg-[#ffc032]/20 transition-colors cursor-pointer"
        >
          ← Back to Banners
        </button>
      </div>

      <FilterSortBar
        search={{ placeholder: "Search by player ID...", value: search, onChange: setSearch }}
        filters={[
          {
            key: "rarity",
            label: "All Rarities",
            value: filterRarity,
            onChange: handleFilterChange,
            options: RARITIES,
          },
        ]}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">Retry</button>
        </div>
      )}

      <AdminTable
        title="All Pull Records"
        columns={columns}
        data={data}
        loading={loading}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        idField="gachaPullHistoryId"
      />

      {selectedPlayerId !== null && (
        <PlayerStatsModal 
          playerProfileId={selectedPlayerId} 
          onClose={() => setSelectedPlayerId(null)} 
        />
      )}
    </div>
  );
}

function PlayerStatsModal({ playerProfileId, onClose }: { playerProfileId: number, onClose: () => void }) {
  const [stats, setStats] = useState<PlayerGachaStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [banning, setBanning] = useState(false);

  useEffect(() => {
    getPlayerGachaStats(playerProfileId)
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, [playerProfileId]);

  const handleBan = async () => {
    if (!stats) return;
    const banReason = await showBanReasonPrompt(stats.playerName);
    if (banReason === null) return;

    setBanning(true);
    try {
      await banPlayer(stats.accountId, banReason || undefined);
      await showSuccessAlert("Banned!", `${stats.playerName} has been banned.`);
      onClose();
    } catch (err) {
      await showErrorAlert("Error", err instanceof Error ? err.message : "Failed to ban account.");
    } finally {
      setBanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-[#ffc032]" />
          Player Gacha Statistics
        </h2>
        
        {loading ? (
          <p className="text-gray-400 py-8 text-center">Loading stats...</p>
        ) : error ? (
          <p className="text-red-400 py-8 text-center">{error}</p>
        ) : stats ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#222] rounded-xl border border-[#333]">
              <p className="text-sm text-gray-400 mb-1">Player</p>
              <p className="text-lg font-bold text-white">{stats.playerName} <span className="text-xs text-gray-500 font-normal">({stats.playerProfileId})</span></p>
            </div>
            
            <p className="text-gray-300 leading-relaxed text-sm p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/20">
              Người này đã quay tổng cộng <strong className="text-white">{stats.totalPulls}</strong> lần 
              (Tốn <strong className="text-[#ffc032]">{stats.totalCost}</strong> vàng) - 
              Trúng <strong className="text-yellow-400">{stats.legendaryPulls}</strong> Legendary.
              <br/><br/>
              Tỉ lệ thực tế: <strong className={stats.actualLegendaryRate > stats.systemLegendaryRate * 3 ? "text-red-400" : "text-green-400"}>{stats.actualLegendaryRate}%</strong> 
              {" "} vs Tỉ lệ hệ thống: <strong>{stats.systemLegendaryRate}%</strong>
            </p>
            
            {stats.actualLegendaryRate > stats.systemLegendaryRate * 3 && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>Cảnh báo: Tỉ lệ Legendary của người chơi này cao bất thường so với hệ thống!</p>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-[#333]">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBan}
                disabled={banning}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                {banning ? "Banning..." : "Ban Account"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
