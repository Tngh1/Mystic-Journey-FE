"use client";

import { useRouter } from "next/navigation";
import { ItemResponse } from "@/lib/api/item";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import apiClient from "@/lib/api/client";
import AdminTable from "@/components/ui/AdminTable";
import { Search, Package } from "lucide-react";

export default function ManageItemsPage() {
  const router = useRouter();

  const { data: items, totalCount, loading, error, page, pageSize, setPage, setPageSize, setParams, refresh } =
    usePagedQuery<ItemResponse>({
      endpoint: "/api/items",
      pageSize: 10,
    });

  const handleDelete = async (item: ItemResponse) => {
    if (!confirm(`Delete item "${item.name}"?`)) return;
    try {
      await apiClient.delete(`/api/items/${item.itemId}`);
      refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const rarityColors: Record<string, string> = {
    Common: "text-gray-400",
    Uncommon: "text-green-400",
    Rare: "text-blue-400",
    Epic: "text-purple-400",
    Legendary: "text-orange-400",
    Mythic: "text-red-400",
  };

  const columns = [
    {
      key: "iconUrl",
      label: "Image",
      render: (_: any, item: ItemResponse) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
          {item.iconUrl ? (
            <img
              src={item.iconUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <span className="text-white/20 text-lg">📦</span>
          )}
        </div>
      ),
    },
    { key: "itemId", label: "ID" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    {
      key: "rarity",
      label: "Rarity",
      render: (val: string) => (
        <span className={`font-semibold ${rarityColors[val] || "text-white"}`}>{val}</span>
      ),
    },
    { key: "slot", label: "Slot" },
    { key: "baseValue", label: "Base Value" },
    { key: "maxStack", label: "Max Stack" },
  ];

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00] flex items-center justify-center">
                <Package className="w-8 h-8 text-[#111]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#ffc032]">Manage Items</h1>
                <p className="text-gray-400">Create and modify game items, weapons, and consumables.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/manage-items/create")}
              className="px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-colors flex items-center gap-2"
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Filter by name..."
                onChange={(e) => setParams({ search: e.target.value || undefined })}
                className="w-full pl-12 pr-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
            <select
              aria-label="Filter items by type"
              onChange={(e) => setParams({ type: e.target.value || undefined })}
              className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
            >
              <option value="">All Types</option>
              <option value="Weapon">Weapon</option>
              <option value="Armor">Armor</option>
              <option value="Accessory">Accessory</option>
              <option value="Consumable">Consumable</option>
              <option value="Material">Material</option>
              <option value="QuestItem">Quest Item</option>
            </select>
            <select
              aria-label="Filter items by rarity"
              onChange={(e) => setParams({ rarity: e.target.value || undefined })}
              className="px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
            >
              <option value="">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
              <option value="Mythic">Mythic</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button onClick={refresh} className="mt-2 text-sm underline text-red-300 cursor-pointer">
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rarity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Slot</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Base Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Max Stack</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && items.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
                        <div className="w-8 h-8 border-2 border-[#ffc032] border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.itemId} className="border-b border-gray-800/50 hover:bg-[#222] transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                            {item.iconUrl ? (
                              <img src={item.iconUrl} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span className="text-white/20 text-lg">📦</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.itemId}</td>
                        <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-gray-300">{item.type}</td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${rarityColors[item.rarity] || "text-white"}`}>{item.rarity}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{item.slot || '-'}</td>
                        <td className="px-6 py-4">
                          <span className="text-yellow-400">💰 {item.baseValue}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{item.maxStack}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => router.push(`/manage-items/edit?id=${item.itemId}`)}
                            className="px-4 py-2 bg-[#ffc032] text-[#111] rounded-lg hover:bg-[#ffd04c] transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Total Items: <span className="text-[#ffc032] font-semibold">{totalCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  aria-label="Select page size"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-[#0d0d0d] border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none"
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 text-sm text-white">
                    Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(totalCount / pageSize)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
