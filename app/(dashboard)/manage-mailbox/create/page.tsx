"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  Globe,
  User,
  Users,
  Crown,
  Star,
  Gift,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Search,
  ChevronDown,
  Package,
  Check,
  Plus,
} from "lucide-react";
import { sendByList, sendBroadcast } from "@/lib/api/mail";
import type { SendMailByListIdRequest, SendMailToAllRequest } from "@/lib/api/mail";
import { getAllSimple } from "@/lib/api/item";
import type { ItemResponse } from "@/lib/types";

const MAIL_TYPES = [
  { value: "System", label: "System", icon: Star, color: "text-gray-400", bg: "bg-gray-500/15", border: "border-gray-500/30" },
  { value: "Gift", label: "Gift", icon: Gift, color: "text-green-400", bg: "bg-green-500/15", border: "border-green-500/30" },
  { value: "Event", label: "Event", icon: Crown, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/30" },
  { value: "Compensation", label: "Compensation", icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/30" },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "text-gray-400",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400",
  Legendary: "text-orange-400",
  Mythic: "text-red-400",
};

export default function SendMailPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendToAll, setSendToAll] = useState(false);
  const [playerSelection, setPlayerSelection] = useState<"single" | "multiple">("single");

  // Item picker state
  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ItemResponse[]>([]);
  const itemDropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "System",
    attachedGold: "",
    attachedGems: "",
    attachedItemQuantity: "",
    expiredAt: "",
  });

  const [singleId, setSingleId] = useState("");
  const [multipleIds, setMultipleIds] = useState("");

  // Load items on mount
  useEffect(() => {
    setLoadingItems(true);
    getAllSimple()
      .then(setAllItems)
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(e.target as Node)) {
        setShowItemDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredItems = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      String(item.itemId).includes(itemSearch)
  );

  const handleSelectItem = (item: ItemResponse) => {
    if (selectedItems.some((s) => s.itemId === item.itemId)) {
      setSelectedItems((prev) => prev.filter((s) => s.itemId !== item.itemId));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
    setItemSearch("");
    setShowItemDropdown(false);
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((s) => s.itemId !== itemId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildPayload = (): SendMailByListIdRequest | SendMailToAllRequest => {
    const base = {
      title: form.title,
      content: form.content,
      type: form.type,
      attachedGold: form.attachedGold ? Number(form.attachedGold) : 0,
      attachedGems: form.attachedGems ? Number(form.attachedGems) : 0,
      attachedItemId: selectedItems[0]?.itemId || undefined,
      attachedItemQuantity: selectedItems.length > 0
        ? (form.attachedItemQuantity ? Number(form.attachedItemQuantity) : 1)
        : 0,
      expiredAt: form.expiredAt || undefined,
    };

    if (sendToAll) {
      return base as SendMailToAllRequest;
    }

    let ids: number[] = [];
    if (playerSelection === "single" && singleId) {
      const id = Number(singleId);
      if (!isNaN(id)) ids = [id];
    } else {
      ids = multipleIds
        .split(/[\s,]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);
    }

    return { ...base, playerProfileIds: ids } as SendMailByListIdRequest;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.content.trim()) { setError("Content is required."); return; }
    if (!sendToAll) {
      const payload = buildPayload() as SendMailByListIdRequest;
      if (!payload.playerProfileIds || payload.playerProfileIds.length === 0) {
        setError("Please enter at least one player ID.");
        return;
      }
    }

    try {
      setSubmitting(true);
      if (sendToAll) {
        await sendBroadcast(buildPayload() as SendMailToAllRequest);
      } else {
        await sendByList(buildPayload() as SendMailByListIdRequest);
      }
      setSuccess(true);
      setTimeout(() => router.push("/manage-mailbox"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send mail. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Back to mailbox"
          onClick={() => router.push("/manage-mailbox")}
          className="p-2 rounded-xl bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Send Mail</h1>
          <p className="text-sm text-gray-500">Compose and send mail to players</p>
        </div>
      </div>

      {/* Feedback banners */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)} aria-label="Dismiss error" className="text-red-400/60 hover:text-red-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-green-400 text-sm">Mail sent successfully! Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Destination Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Destination</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Send to All Toggle */}
            <div
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none ${
                sendToAll
                  ? "bg-purple-500/10 border-purple-500/40"
                  : "bg-[#111] border-gray-700 hover:border-gray-600"
              }`}
              onClick={() => setSendToAll(!sendToAll)}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sendToAll ? "bg-purple-500/20" : "bg-gray-800"}`}>
                <Globe className={`w-5 h-5 ${sendToAll ? "text-purple-400" : "text-gray-500"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Broadcast to All Players</p>
                <p className="text-xs text-gray-500 mt-0.5">Mail will be delivered to every active player</p>
              </div>
              <div className={`w-12 h-7 rounded-full transition-all relative ${sendToAll ? "bg-purple-500" : "bg-gray-700"}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${sendToAll ? "left-6" : "left-1"}`} />
              </div>
            </div>

            {/* Player ID inputs */}
            {!sendToAll && (
              <>
                <div className="flex rounded-xl bg-[#111] p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setPlayerSelection("single")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      playerSelection === "single" ? "bg-[#ffc032] text-[#111]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Single Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerSelection("multiple")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      playerSelection === "multiple" ? "bg-[#ffc032] text-[#111]" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Multiple Players
                  </button>
                </div>

                {playerSelection === "single" ? (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      Player Profile ID
                    </label>
                    <input
                      type="number"
                      value={singleId}
                      onChange={(e) => setSingleId(e.target.value)}
                      placeholder="e.g. 1"
                      min="1"
                      className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      Player Profile IDs
                    </label>
                    <textarea
                      value={multipleIds}
                      onChange={(e) => setMultipleIds(e.target.value)}
                      placeholder="Enter IDs separated by commas or new lines&#10;e.g. 1, 2, 3, 4, 5"
                      rows={3}
                      className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Message Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Message</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Enter mail title"
                className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none"
              />
            </div>

            {/* Mail Type */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                Mail Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MAIL_TYPES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        form.type === t.value ? `${t.bg} ${t.border}` : "bg-[#111] border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${form.type === t.value ? t.color : "text-gray-500"}`} />
                      <span className={`text-xs font-medium ${form.type === t.value ? t.color : "text-gray-500"}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Attached Rewards</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  <span className="text-yellow-400 mr-1">Gold</span>
                </label>
                <input
                  type="number"
                  name="attachedGold"
                  value={form.attachedGold}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  <span className="text-blue-400 mr-1">Gems</span>
                </label>
                <input
                  type="number"
                  name="attachedGems"
                  value={form.attachedGems}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                />
              </div>
            </div>

            {/* Item Picker */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Item
              </label>

              {/* Selected Items Tags */}
              {selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.itemId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-lg"
                    >
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt={item.name} className="w-5 h-5 rounded object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-purple-400" />
                      )}
                      <span className={`text-xs font-medium ${RARITY_COLORS[item.rarity] || "text-white"}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500">#{item.itemId}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.itemId)}
                        aria-label={`Remove ${item.name}`}
                        className="ml-1 text-purple-400/60 hover:text-purple-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Item Search Dropdown */}
              <div className="relative" ref={itemDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => { setItemSearch(e.target.value); setShowItemDropdown(true); }}
                    onFocus={() => setShowItemDropdown(true)}
                    placeholder={loadingItems ? "Loading items..." : "Search items by name or ID..."}
                    disabled={loadingItems}
                    className="w-full pl-10 pr-10 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowItemDropdown(!showItemDropdown)}
                    aria-label={showItemDropdown ? "Close item list" : "Open item list"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showItemDropdown ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {/* Dropdown Panel */}
                {showItemDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl shadow-black/60 max-h-72 overflow-y-auto">
                    {loadingItems ? (
                      <div className="flex items-center justify-center py-8 gap-2">
                        <Loader2 className="w-4 h-4 text-[#ffc032] animate-spin" />
                        <span className="text-sm text-gray-400">Loading items...</span>
                      </div>
                    ) : filteredItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Package className="w-8 h-8 mb-2 opacity-40" />
                        <span className="text-sm">No items found</span>
                      </div>
                    ) : (
                      <div className="py-1">
                        {filteredItems.slice(0, 50).map((item) => {
                          const isSelected = selectedItems.some((s) => s.itemId === item.itemId);
                          return (
                            <button
                              key={item.itemId}
                              type="button"
                              onClick={() => handleSelectItem(item)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#252525] transition-colors text-left ${
                                isSelected ? "bg-purple-500/10" : ""
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                {item.iconUrl ? (
                                  <img src={item.iconUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Package className="w-4 h-4 text-white/20" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${RARITY_COLORS[item.rarity] || "text-white"}`}>
                                  {item.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">#{item.itemId}</span>
                                  <span className="text-xs text-gray-600">•</span>
                                  <span className="text-xs text-gray-500">{item.type}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                            </button>
                          );
                        })}
                        {filteredItems.length > 50 && (
                          <div className="px-4 py-2 text-xs text-gray-500 text-center">
                            Showing first 50 of {filteredItems.length} items
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Item Quantity */}
            {selectedItems.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  Item Quantity
                </label>
                <input
                  type="number"
                  name="attachedItemQuantity"
                  value={form.attachedItemQuantity}
                  onChange={handleChange}
                  min="1"
                  max={selectedItems[0]?.maxStack || 9999}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                name="expiredAt"
                aria-label="Expiry date"
                value={form.expiredAt}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || success}
            className="flex items-center gap-2 px-8 py-3 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Sent!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                {sendToAll ? "Broadcast to All Players" : "Send Mail"}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/manage-mailbox")}
            className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-xl font-medium transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
