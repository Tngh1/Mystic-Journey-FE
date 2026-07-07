'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Save, User, Heart, Sword, ShieldCheck, Zap, Skull,
  Package, RefreshCw, CheckCircle, ChevronRight,
} from 'lucide-react';
import { getPlayerProfileAdmin, updatePlayerProfileAdmin, PlayerProfileWithStats } from '@/lib/api/player-profiles';
import { getInventoryByProfileId } from '@/lib/api/inventory';
import type { PlayerStatsResponse, InventoryItemResponse, InventorySummaryResponse, PlayerSkinSummaryResponse } from '@/lib/types';

const classColors: Record<string, string> = {
  Knight: 'bg-red-500/20 text-red-400 border-red-500/30',
  Mage: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Archer: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const rarityColors: Record<string, string> = {
  Common: 'text-gray-400 border-gray-600',
  Uncommon: 'text-green-400 border-green-600',
  Rare: 'text-blue-400 border-blue-600',
  Epic: 'text-purple-400 border-purple-600',
  Legendary: 'text-orange-400 border-orange-600',
  Mythic: 'text-red-400 border-red-600',
};

const rarityBg: Record<string, string> = {
  Common: 'bg-gray-500/10',
  Uncommon: 'bg-green-500/10',
  Rare: 'bg-blue-500/10',
  Epic: 'bg-purple-500/10',
  Legendary: 'bg-orange-500/10',
  Mythic: 'bg-red-500/10',
};

// ─────────────────────────────────────────────────────────────
// Item Detail Side Panel (UC 20.2 – View Item Detail)
// ─────────────────────────────────────────────────────────────
function ItemDetailPanel({
  item,
  onClose,
}: {
  item: InventoryItemResponse;
  onClose: () => void;
}) {
  const isEquipment =
    item.itemType === 'Weapon' ||
    item.itemType === 'Armor' ||
    item.itemType === 'Accessory' ||
    item.itemType === 'Helmet' ||
    item.itemType === 'Gloves' ||
    item.itemType === 'Boots' ||
    item.itemType === 'Ring' ||
    item.itemType === 'Necklace';

  const colorClass = rarityColors[item.itemRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[item.itemRarity]    ?? 'bg-gray-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm h-full bg-[#1a1a1a] border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Icon placeholder */}
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${colorClass} ${bgClass} flex-shrink-0`}>
              📦
            </div>
            <div>
              <h2 className={`font-bold text-lg leading-tight ${colorClass.split(' ')[0]}`}>
                {item.itemName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass} ${bgClass}`}>
                  {item.itemRarity}
                </span>
                <span className="text-xs text-white/40 bg-white/5 rounded-full px-2 py-0.5">
                  {item.itemType}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer flex-shrink-0"
            aria-label="Close detail panel"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Quantity</p>
              <p className="font-semibold text-white">×{item.quantity}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Enhancement</p>
              <p className="font-semibold text-[#ffc032]">+{item.enhancementLevel}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Status</p>
              {item.isEquipped ? (
                <span className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Equipped
                </span>
              ) : (
                <span className="text-white/50 font-semibold text-sm">In Bag</span>
              )}
            </div>
            {item.equippedSlot && (
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xs text-white/40 mb-1">Slot</p>
                <p className="font-semibold text-white">{item.equippedSlot}</p>
              </div>
            )}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Type</p>
              <p className="font-semibold text-white">{item.isSkin ? '🎭 Skin' : '⚔️ Item'}</p>
            </div>
          </div>

          {/* Description */}
          {item.itemDescription && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Description</p>
              <p className="text-white/80 text-sm leading-relaxed">{item.itemDescription}</p>
            </div>
          )}

          {/* Stats (Equipment only) */}
          {isEquipment && (
            <div className="space-y-3">
              <p className="text-xs text-white/40 uppercase tracking-wider">Stats</p>

              {/* Base Stats */}
              {(item.baseHp > 0 || item.baseAtk > 0 || item.baseDef > 0) && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <p className="text-xs text-white/40 mb-2">Base Stats</p>
                  {item.baseHp > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" /> HP
                      </span>
                      <span className="text-sm font-semibold text-white">+{item.baseHp}</span>
                    </div>
                  )}
                  {item.baseAtk > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-400 flex items-center gap-1.5">
                        <Sword className="w-3.5 h-3.5" /> ATK
                      </span>
                      <span className="text-sm font-semibold text-white">+{item.baseAtk}</span>
                    </div>
                  )}
                  {item.baseDef > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> DEF
                      </span>
                      <span className="text-sm font-semibold text-white">+{item.baseDef}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bonus Stats */}
              {(item.bonusHp > 0 || item.bonusAtk > 0 || item.bonusDef > 0 ||
                item.bonusCritRate > 0 || item.bonusCritDamage > 0) && (
                <div className="bg-[#ffc032]/5 rounded-xl p-4 border border-[#ffc032]/20 space-y-2">
                  <p className="text-xs text-[#ffc032]/60 mb-2">Bonus Stats</p>
                  {item.bonusHp > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-red-400">❤ HP</span>
                      <span className="text-sm font-semibold text-[#ffc032]">+{item.bonusHp}</span>
                    </div>
                  )}
                  {item.bonusAtk > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-400">⚔ ATK</span>
                      <span className="text-sm font-semibold text-[#ffc032]">+{item.bonusAtk}</span>
                    </div>
                  )}
                  {item.bonusDef > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-400">🛡 DEF</span>
                      <span className="text-sm font-semibold text-[#ffc032]">+{item.bonusDef}</span>
                    </div>
                  )}
                  {item.bonusCritRate > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-yellow-400">⚡ Crit Rate</span>
                      <span className="text-sm font-semibold text-[#ffc032]">+{item.bonusCritRate.toFixed(1)}%</span>
                    </div>
                  )}
                  {item.bonusCritDamage > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-pink-400">💥 Crit DMG</span>
                      <span className="text-sm font-semibold text-[#ffc032]">+{item.bonusCritDamage.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Skin info */}
          {item.isSkin && (
            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
              <p className="text-purple-400 text-sm font-medium">🎭 Skin Item</p>
              <p className="text-white/50 text-xs mt-1">
                {item.isEquipped ? 'Currently equipped on player.' : 'Not equipped.'}
              </p>
            </div>
          )}
        </div>

        {/* Admin note */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">
            Admin view only — cannot modify player inventory
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inventory Tab (UC 20.1 View Inventory)
// ─────────────────────────────────────────────────────────────
function InventoryTab({ playerProfileId }: { playerProfileId: number }) {
  const [summary, setSummary] = useState<InventorySummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'skins'>('items');
  const [selectedItem, setSelectedItem] = useState<InventoryItemResponse | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<PlayerSkinSummaryResponse | null>(null);

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInventoryByProfileId(playerProfileId);
      setSummary(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadInventory);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerProfileId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading inventory...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-6 text-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={loadInventory}
          className="text-sm text-white/60 hover:text-white flex items-center gap-1.5 mx-auto cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  if (!summary) return null;

  const equippedItems = summary.equippedItems ?? [];
  const bagItems       = summary.bagItems ?? [];
  // Items thông thường (không phải skin flag)
  const allItems = [...equippedItems, ...bagItems].filter((it) => !it.isSkin);
  // Skins từ summary.playerSkins (bảng PlayerSkins, có PlayerSkinId đúng)
  const allSkins: PlayerSkinSummaryResponse[] = summary.playerSkins ?? [];

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <p className="text-xs text-white/40 mb-1">Total Items</p>
          <p className="text-lg font-bold text-[#ffc032]">{summary.totalItems}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <p className="text-xs text-white/40 mb-1">Skins</p>
          <p className="text-lg font-bold text-purple-400">{summary.totalSkins}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <p className="text-xs text-white/40 mb-1">Bag Usage</p>
          <p className="text-lg font-bold text-white">
            {bagItems.length}
            <span className="text-white/30 text-sm font-normal">/{summary.bagCapacity}</span>
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        <button
          onClick={() => setActiveSubTab('items')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'items'
              ? 'bg-[#ffc032] text-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          ⚔️ Items ({allItems.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('skins'); setSelectedItem(null); setSelectedSkin(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeSubTab === 'skins'
              ? 'bg-[#ffc032] text-black'
              : 'text-white/50 hover:text-white'
          }`}
        >
          🎭 Skins ({allSkins.length})
        </button>
      </div>

      {/* Equipped section (Items tab only) */}
      {activeSubTab === 'items' && equippedItems.filter((it) => !it.isSkin).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Equipped
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {equippedItems
              .filter((it) => !it.isSkin)
              .map((item) => (
                <InventoryItemCard
                  key={item.inventoryItemId}
                  item={item}
                  onClick={() => { setSelectedSkin(null); setSelectedItem(item); }}
                />
              ))}
          </div>
        </div>
      )}

      {/* Equipped skin badge (Skins tab) */}
      {activeSubTab === 'skins' && allSkins.some((s) => s.isEquipped) && (
        <div className="space-y-2">
          <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Equipped Skin
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allSkins
              .filter((s) => s.isEquipped)
              .map((skin) => (
                <SkinCard
                  key={skin.playerSkinId}
                  skin={skin}
                  onClick={() => { setSelectedItem(null); setSelectedSkin(skin); }}
                />
              ))}
          </div>
        </div>
      )}

      {/* All items/skins list */}
      {activeSubTab === 'items' ? (
        allItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No items in inventory</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">All Items</p>
            <div className="grid grid-cols-1 gap-1">
              {allItems.map((item) => (
                <InventoryListRow
                  key={item.inventoryItemId}
                  item={item}
                  onClick={() => { setSelectedSkin(null); setSelectedItem(item); }}
                />
              ))}
            </div>
          </div>
        )
      ) : (
        allSkins.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No skins unlocked</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">All Skins</p>
            <div className="grid grid-cols-1 gap-1">
              {allSkins.map((skin) => (
                <SkinListRow
                  key={skin.playerSkinId}
                  skin={skin}
                  onClick={() => { setSelectedItem(null); setSelectedSkin(skin); }}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Item Detail Panel */}
      {selectedItem && (
        <ItemDetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Skin Detail Panel */}
      {selectedSkin && (
        <SkinDetailPanel
          skin={selectedSkin}
          onClose={() => setSelectedSkin(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Skin Detail Panel (UC 20.2 – View Skin Detail)
// ─────────────────────────────────────────────────────────────
function SkinDetailPanel({
  skin,
  onClose,
}: {
  skin: PlayerSkinSummaryResponse;
  onClose: () => void;
}) {
  const colorClass = rarityColors[skin.skinRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[skin.skinRarity]    ?? 'bg-gray-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      <div
        className="absolute inset-0 bg-black/40 pointer-events-auto"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm h-full bg-[#1a1a1a] border-l border-white/10 shadow-2xl pointer-events-auto flex flex-col overflow-y-auto">
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl border ${colorClass} ${bgClass} flex-shrink-0`}>
              🎭
            </div>
            <div>
              <h2 className={`font-bold text-lg leading-tight ${colorClass.split(' ')[0]}`}>
                {skin.skinName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass} ${bgClass}`}>
                  {skin.skinRarity}
                </span>
                <span className="text-xs text-white/40 bg-white/5 rounded-full px-2 py-0.5">
                  {skin.skinType}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 cursor-pointer flex-shrink-0"
            aria-label="Close skin detail panel"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Status</p>
              {skin.isEquipped ? (
                <span className="text-purple-400 font-semibold text-sm flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Equipped
                </span>
              ) : (
                <span className="text-white/50 font-semibold text-sm">In Collection</span>
              )}
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-white/40 mb-1">Type</p>
              <p className="font-semibold text-white">{skin.skinType}</p>
            </div>
          </div>

          {skin.skinDescription && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">Description</p>
              <p className="text-white/80 text-sm leading-relaxed">{skin.skinDescription}</p>
            </div>
          )}

          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-400 text-sm font-medium">🎭 Cosmetic Skin</p>
            <p className="text-white/50 text-xs mt-1">Changes character appearance only.</p>
            <p className="text-white/30 text-xs mt-1">PlayerSkinId: {skin.playerSkinId}</p>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">
            Admin view only — cannot modify player skins
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Inventory Item Card (grid view for equipped)
// ─────────────────────────────────────────────────────────────
function InventoryItemCard({
  item,
  onClick,
}: {
  item: InventoryItemResponse;
  onClick: () => void;
}) {
  const colorClass = rarityColors[item.itemRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[item.itemRarity]    ?? 'bg-gray-500/10';

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl p-3 border ${colorClass} ${bgClass} text-left hover:scale-105 transition-transform cursor-pointer group`}
    >
      {item.isEquipped && (
        <span className="absolute top-1.5 right-1.5 bg-emerald-500 rounded-full w-2 h-2" />
      )}
      <div className="text-2xl mb-2">📦</div>
      <p className="text-xs font-semibold text-white truncate">{item.itemName}</p>
      <p className={`text-xs ${colorClass.split(' ')[0]}`}>{item.itemRarity}</p>
      {item.quantity > 1 && (
        <p className="text-xs text-white/40">×{item.quantity}</p>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Inventory List Row (for all items list)
// ─────────────────────────────────────────────────────────────
function InventoryListRow({
  item,
  onClick,
}: {
  item: InventoryItemResponse;
  onClick: () => void;
}) {
  const colorClass = rarityColors[item.itemRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[item.itemRarity]    ?? 'bg-gray-500/10';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 text-left transition-colors cursor-pointer group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${bgClass} border ${colorClass} flex-shrink-0`}>
        {item.isSkin ? '🎭' : '📦'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-white text-sm truncate">{item.itemName}</p>
          {item.isEquipped && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">
              ✓ Equipped
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${colorClass.split(' ')[0]}`}>{item.itemRarity}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs text-white/40">{item.itemType}</span>
          {item.enhancementLevel > 0 && (
            <>
              <span className="text-white/20 text-xs">·</span>
              <span className="text-xs text-[#ffc032]">+{item.enhancementLevel}</span>
            </>
          )}
        </div>
      </div>

      {/* Quantity + arrow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.quantity > 1 && (
          <span className="text-xs text-white/40">×{item.quantity}</span>
        )}
        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Skin Card (grid card for equipped skin)
// ─────────────────────────────────────────────────────────────
function SkinCard({
  skin,
  onClick,
}: {
  skin: PlayerSkinSummaryResponse;
  onClick: () => void;
}) {
  const colorClass = rarityColors[skin.skinRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[skin.skinRarity]    ?? 'bg-gray-500/10';

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl p-3 border ${colorClass} ${bgClass} text-left hover:scale-105 transition-transform cursor-pointer group`}
    >
      {skin.isEquipped && (
        <span className="absolute top-1.5 right-1.5 bg-purple-500 rounded-full w-2 h-2" />
      )}
      <div className="text-2xl mb-2">🎭</div>
      <p className="text-xs font-semibold text-white truncate">{skin.skinName}</p>
      <p className={`text-xs ${colorClass.split(' ')[0]}`}>{skin.skinRarity}</p>
      <p className="text-xs text-white/30">{skin.skinType}</p>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Skin List Row (for all skins list)
// ─────────────────────────────────────────────────────────────
function SkinListRow({
  skin,
  onClick,
}: {
  skin: PlayerSkinSummaryResponse;
  onClick: () => void;
}) {
  const colorClass = rarityColors[skin.skinRarity] ?? 'text-gray-400 border-gray-600';
  const bgClass    = rarityBg[skin.skinRarity]    ?? 'bg-gray-500/10';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 text-left transition-colors cursor-pointer group"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${bgClass} border ${colorClass} flex-shrink-0`}>
        🎭
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-white text-sm truncate">{skin.skinName}</p>
          {skin.isEquipped && (
            <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/30 flex-shrink-0">
              ✓ Equipped
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs ${colorClass.split(' ')[0]}`}>{skin.skinRarity}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-xs text-white/40">{skin.skinType}</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
export default function EditPlayerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'inventory'>('profile');

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

  useEffect(() => {
    if (playerId) {
      void Promise.resolve().then(fetchPlayer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

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

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#ffc032] text-black'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-[#ffc032] text-black'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Inventory
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#ffc032] animate-spin" />
          </div>
        ) : activeTab === 'inventory' ? (
          /* ────────── INVENTORY TAB ────────── */
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#ffc032]" />
              Player Inventory
              <span className="text-sm font-normal text-white/40 ml-1">(read-only)</span>
            </h2>
            <InventoryTab playerProfileId={Number(playerId)} />
          </div>
        ) : (
          /* ────────── PROFILE TAB ────────── */
          <form onSubmit={handleSubmit}>
            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <p className="text-green-400">✓ Player profile updated successfully! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Profile Form */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#ffc032]" />
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">Experience Points</label>
                  <input
                    type="number"
                    name="experiencePoints"
                    value={formData.experiencePoints}
                    onChange={handleChange}
                    min="0"
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

            {/* Stats Display (read-only) */}
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

            {/* Submit */}
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
                className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
