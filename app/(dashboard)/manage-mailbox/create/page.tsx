"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
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
  Coins,
  Gem,
  Eye,
  Mail as MailIcon,
  Trash2,
} from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormAlert from "@/components/form/FormAlert";
import { sendByList, sendBroadcast } from "@/lib/api/mailboxes";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import type { SendMailboxByListIdRequest, SendMailboxToAllRequest } from "@/lib/api/mailboxes";
import { getAll as getAllSimple } from "@/lib/api/items";
import { getAll as getAllPlayers, getPlayerProfileById } from "@/lib/api/player-profiles";
import type { ItemResponse, PlayerProfileResponse } from "@/lib/types";

const PLAYER_PAGE_SIZE = 10;

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

const STEPS = [
  { id: 1, label: "Recipients", icon: Users },
  { id: 2, label: "Message", icon: MailIcon },
  { id: 3, label: "Rewards", icon: Package },
  { id: 4, label: "Review", icon: Eye },
];

export default function SendMailPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendToAll, setSendToAll] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Item picker state
  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemSearch, setItemSearch] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ItemResponse[]>([]);
  // Per-item quantity keyed by itemId (string for controlled input; blank = default 1).
  const [itemQuantities, setItemQuantities] = useState<Record<number, string>>({});
  const itemDropdownRef = useRef<HTMLDivElement>(null);

  // Player picker state — recipients are chosen from a searchable, server-paginated
  // list (10/page). Search accepts a numeric ID (exact lookup) or a name.
  const PLAYERS_PER_PAGE = 10;
  const [players, setPlayers] = useState<PlayerProfileResponse[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerPage, setPlayerPage] = useState(1);
  const [playerTotalCount, setPlayerTotalCount] = useState(0);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  // One shared recipient list — send to one or many, all collected here.
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerProfileResponse[]>([]);
  const playerDropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "System",
    attachedGold: "",
    attachedGems: "",
    expiredAt: "",
  });

  useEffect(() => {
    getAllSimple()
      .then((res) => setAllItems(res.items))
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  // Fetch a page of players (debounced on search). A numeric query is treated as an
  // exact ID lookup (backend search only matches DisplayName); otherwise page normally.
  useEffect(() => {
    const q = playerSearch.trim();
    const asId = Number(q);
    const isIdQuery = q !== "" && Number.isInteger(asId) && asId > 0;

    setLoadingPlayers(true);
    const handle = setTimeout(() => {
      if (isIdQuery) {
        getPlayerProfileById(asId)
          .then((p) => {
            setPlayers([p]);
            setPlayerTotalCount(1);
          })
          .catch(() => {
            setPlayers([]);
            setPlayerTotalCount(0);
          })
          .finally(() => setLoadingPlayers(false));
        return;
      }
      getAllPlayers(playerPage, PLAYERS_PER_PAGE, q || undefined)
        .then((res) => {
          setPlayers(res.items);
          setPlayerTotalCount(res.totalCount);
        })
        .catch(() => {
          setPlayers([]);
          setPlayerTotalCount(0);
        })
        .finally(() => setLoadingPlayers(false));
    }, 350);

    return () => clearTimeout(handle);
  }, [playerSearch, playerPage]);

  // Reset to page 1 whenever the search text changes.
  useEffect(() => {
    setPlayerPage(1);
  }, [playerSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(e.target as Node)) {
        setShowItemDropdown(false);
      }
      if (playerDropdownRef.current && !playerDropdownRef.current.contains(e.target as Node)) {
        setShowPlayerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredItems = useMemo(
    () =>
      allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          String(item.itemId).includes(itemSearch)
      ),
    [allItems, itemSearch]
  );

  const recipientCount = useMemo(() => {
    if (sendToAll) return "All players";
    const n = selectedPlayers.length;
    return `${n} player${n === 1 ? "" : "s"}`;
  }, [sendToAll, selectedPlayers.length]);

  const hasRewards = useMemo(() => {
    return (
      Number(form.attachedGold || 0) > 0 ||
      Number(form.attachedGems || 0) > 0 ||
      selectedItems.length > 0
    );
  }, [form.attachedGold, form.attachedGems, selectedItems]);

  // Effective quantity for an item (blank/invalid → 1, clamped to maxStack & 99).
  const getItemQuantity = (itemId: number): number => {
    const raw = Number(itemQuantities[itemId]);
    if (!raw || raw < 1) return 1;
    const item = selectedItems.find((s) => s.itemId === itemId);
    const maxStack = item?.maxStack && item.maxStack > 0 ? item.maxStack : 99;
    const max = Math.min(maxStack, 99);
    return Math.min(raw, max);
  };

  const handleSelectItem = (item: ItemResponse) => {
    if (selectedItems.some((s) => s.itemId === item.itemId)) {
      setSelectedItems((prev) => prev.filter((s) => s.itemId !== item.itemId));
      setItemQuantities((prev) => {
        const next = { ...prev };
        delete next[item.itemId];
        return next;
      });
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
    setItemSearch("");
    setShowItemDropdown(false);
  };

  const handleRemoveItem = (itemId: number) => {
    setSelectedItems((prev) => prev.filter((s) => s.itemId !== itemId));
    setItemQuantities((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const playerTotalPages = Math.max(1, Math.ceil(playerTotalCount / PLAYERS_PER_PAGE));

  // Toggle a player in the shared recipient list (one or many — same list).
  const handleSelectPlayer = (player: PlayerProfileResponse) => {
    setSelectedPlayers((prev) =>
      prev.some((p) => p.playerProfileId === player.playerProfileId)
        ? prev.filter((p) => p.playerProfileId !== player.playerProfileId)
        : [...prev, player]
    );
  };

  const handleRemovePlayer = (playerProfileId: number) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.playerProfileId !== playerProfileId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      type: "System",
      attachedGold: "",
      attachedGems: "",
      expiredAt: "",
    });
    setSelectedItems([]);
    setItemQuantities({});
    setSelectedPlayers([]);
    setPlayerSearch("");
    setPlayerPage(1);
    setShowPlayerDropdown(false);
    setSendToAll(false);
    setActiveStep(1);
    setError(null);
  };

  const buildPayload = (): SendMailboxByListIdRequest | SendMailboxToAllRequest => {
    let expiredAtUtc: string | undefined = undefined;
    if (form.expiredAt) {
      const localDate = new Date(form.expiredAt);
      expiredAtUtc = localDate.toISOString();
    }

    const base = {
      title: form.title,
      content: form.content,
      type: form.type,
      attachedGold: form.attachedGold ? Number(form.attachedGold) : 0,
      attachedGems: form.attachedGems ? Number(form.attachedGems) : 0,
      attachedItems: selectedItems.map((it) => ({
        itemId: it.itemId,
        quantity: getItemQuantity(it.itemId),
      })),
      expiredAt: expiredAtUtc,
    };

    if (sendToAll) {
      return base as SendMailboxToAllRequest;
    }

    const ids = selectedPlayers.map((p) => p.playerProfileId);

    return { ...base, playerProfileIds: ids } as SendMailboxByListIdRequest;
  };

  const validateCurrentStep = (): boolean => {
    if (activeStep === 1) {
      if (sendToAll) return true;
      if (selectedPlayers.length === 0) {
        setError("Please select at least one player.");
        return false;
      }
    }
    if (activeStep === 2) {
      if (!form.title.trim()) {
        setError("Mailbox title is required.");
        return false;
      }
      if (!form.content.trim()) {
        setError("Mailbox content is required.");
        return false;
      }
    }
    if (activeStep === 3) {
      if (Number(form.attachedGold) > 9999) {
        setError("Gold amount cannot exceed 9999.");
        return false;
      }
      if (Number(form.attachedGems) > 9999) {
        setError("Gems amount cannot exceed 9999.");
        return false;
      }
      for (const item of selectedItems) {
        const qty = getItemQuantity(item.itemId);
        if (qty > 99) {
          setError(`Item quantity for '${item.name}' cannot exceed 99.`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setError(null);
    setActiveStep((p) => Math.min(p + 1, STEPS.length));
  };

  const goPrev = () => {
    setError(null);
    setActiveStep((p) => Math.max(p - 1, 1));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateCurrentStep()) {
      setActiveStep(2);
      return;
    }

    try {
      setSubmitting(true);
      if (sendToAll) {
        await sendBroadcast(buildPayload() as SendMailboxToAllRequest);
      } else {
        await sendByList(buildPayload() as SendMailboxByListIdRequest);
      }
      setSuccess(true);
      await showSuccessAlert("Success!", "Mailbox sent successfully.");
      setTimeout(() => router.push("/manage-mailbox"), 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send mailbox. Please try again.";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const currentType = MAIL_TYPES.find((t) => t.value === form.type) ?? MAIL_TYPES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <FormHeader
        title="Send Mailbox"
        subtitle="Compose and deliver mailbox to players"
        backHref="/manage-mailbox"
        badge="Composer"
        badgeTone="warning"
        actions={
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">Recipients:</span>
            <span className="text-xs font-semibold text-[#ffc032]">{recipientCount}</span>
          </div>
        }
      />

      {/* Stepper */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {STEPS.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => isCompleted && setActiveStep(step.id)}
                  disabled={!isCompleted && !isActive}
                  className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      isActive
                        ? "bg-[#ffc032] text-[#111] border-[#ffc032] scale-110"
                        : isCompleted
                          ? "bg-green-500/20 text-green-400 border-green-500/40"
                          : "bg-[#111] text-gray-500 border-white/10"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? "text-[#ffc032]" : isCompleted ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2 mb-5 bg-gray-800 relative overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                        isCompleted ? "w-full bg-green-500/50" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback banners */}
      {error && (
        <FormAlert type="error" message={error} onDismiss={() => setError(null)} />
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-green-400 text-sm">Mailbox sent successfully! Redirecting...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main Form Area */}
        <div className="space-y-5 min-w-0">
          {/* STEP 1 - Recipients */}
          {activeStep === 1 && (
            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-visible">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#ffc032]" />
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Step 1 · Choose Recipients
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                    sendToAll
                      ? "bg-purple-500/10 border-purple-500/50"
                      : "bg-[#111] border-white/10 hover:border-gray-600"
                  }`}
                  onClick={() => setSendToAll(!sendToAll)}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      sendToAll ? "bg-purple-500/20" : "bg-gray-800"
                    }`}
                  >
                    <Globe
                      className={`w-6 h-6 ${sendToAll ? "text-purple-400" : "text-gray-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Broadcast to All Players</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Send to every active account in the server
                    </p>
                  </div>
                  <div
                    className={`w-12 h-7 rounded-full transition-all relative shrink-0 ${
                      sendToAll ? "bg-purple-500" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                        sendToAll ? "left-6" : "left-1"
                      }`}
                    />
                  </div>
                </div>

                {!sendToAll && (
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                        <span>
                          Recipients <span className="text-red-400">*</span>
                        </span>
                        {selectedPlayers.length > 0 && (
                          <span className="text-[#ffc032] normal-case font-semibold">
                            {selectedPlayers.length} selected
                          </span>
                        )}
                      </label>

                      {/* Selected recipient chips */}
                      {selectedPlayers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedPlayers.map((player) => (
                            <div
                              key={player.playerProfileId}
                              className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-[#ffc032]/10 border border-[#ffc032]/30 rounded-lg"
                            >
                              <div className="w-6 h-6 rounded overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                                {player.avatarUrl ? (
                                  <img
                                    src={player.avatarUrl}
                                    alt={player.displayName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <User className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                              <span className="text-xs font-medium text-white">
                                {player.displayName}
                              </span>
                              <span className="text-xs text-gray-500">
                                #{player.playerProfileId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(player.playerProfileId)}
                                aria-label={`Remove ${player.displayName}`}
                                className="ml-1 text-[#ffc032]/60 hover:text-[#ffc032] transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Searchable player dropdown */}
                      <div className="relative" ref={playerDropdownRef}>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={playerSearch}
                            onChange={(e) => {
                              setPlayerSearch(e.target.value);
                              setShowPlayerDropdown(true);
                            }}
                            onFocus={() => setShowPlayerDropdown(true)}
                            placeholder={
                              loadingPlayers
                                ? "Loading players..."
                                : "Search players by name, ID or email..."
                            }
                            disabled={loadingPlayers}
                            className="w-full pl-10 pr-10 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors disabled:opacity-50"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPlayerDropdown(!showPlayerDropdown)}
                            aria-label={showPlayerDropdown ? "Close player list" : "Open player list"}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                showPlayerDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {showPlayerDropdown && (
                          <div className="absolute z-50 mt-2 w-full bg-[#111111] border border-white/10 rounded-xl shadow-2xl shadow-black/60 max-h-72 overflow-y-auto">
                            {loadingPlayers ? (
                              <div className="flex items-center justify-center py-8 gap-2">
                                <Loader2 className="w-4 h-4 text-[#ffc032] animate-spin" />
                                <span className="text-sm text-gray-400">Loading players...</span>
                              </div>
                            ) : players.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Users className="w-8 h-8 mb-2 opacity-40" />
                                <span className="text-sm">No players found</span>
                              </div>
                            ) : (
                              <div className="py-1">
                                {players.map((player) => {
                                  const isSelected = selectedPlayers.some(
                                    (p) => p.playerProfileId === player.playerProfileId
                                  );
                                  return (
                                    <button
                                      key={player.playerProfileId}
                                      type="button"
                                      onClick={() => handleSelectPlayer(player)}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#252525] transition-colors text-left cursor-pointer ${
                                        isSelected ? "bg-[#ffc032]/10" : ""
                                      }`}
                                    >
                                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                        {player.avatarUrl ? (
                                          <img
                                            src={player.avatarUrl}
                                            alt={player.displayName}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <User className="w-4 h-4 text-white/20" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-white">
                                          {player.displayName}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-gray-500">
                                            #{player.playerProfileId}
                                          </span>
                                          <span className="text-xs text-gray-600">•</span>
                                          <span className="text-xs text-gray-500">
                                            Lv.{player.level} {player.playerClass}
                                          </span>
                                          {player.accountEmail && (
                                            <>
                                              <span className="text-xs text-gray-600">•</span>
                                              <span className="text-xs text-gray-500 truncate">
                                                {player.accountEmail}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check className="w-4 h-4 text-[#ffc032] shrink-0" />
                                      )}
                                    </button>
                                  );
                                })}
                                {playerTotalCount > PLAYERS_PER_PAGE && (
                                  <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-white/10 sticky bottom-0 bg-[#111111]">
                                    <button
                                      type="button"
                                      onClick={() => setPlayerPage((p) => Math.max(1, p - 1))}
                                      disabled={playerPage <= 1}
                                      className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 hover:border-[#ffc032] hover:text-[#ffc032] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      Prev
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {playerPage} / {Math.max(1, Math.ceil(playerTotalCount / PLAYERS_PER_PAGE))}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPlayerPage((p) =>
                                          p < Math.ceil(playerTotalCount / PLAYERS_PER_PAGE) ? p + 1 : p
                                        )
                                      }
                                      disabled={playerPage >= Math.ceil(playerTotalCount / PLAYERS_PER_PAGE)}
                                      className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-300 hover:border-[#ffc032] hover:text-[#ffc032] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      Next
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 - Message */}
          {activeStep === 2 && (
            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-[#ffc032]" />
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Step 2 · Compose Message
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    <span>
                      Title <span className="text-red-400">*</span>
                    </span>
                    <span className="text-gray-600 normal-case">{form.title.length}/200</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="e.g. Compensation for maintenance downtime"
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    <span>
                      Content <span className="text-red-400">*</span>
                    </span>
                    <span className="text-gray-600 normal-case">
                      {form.content.length} chars
                    </span>
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Write the message players will see in their mailbox..."
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                    Mailbox Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {MAIL_TYPES.map((t) => {
                      const Icon = t.icon;
                      const selected = form.type === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            selected
                              ? `${t.bg} ${t.border}`
                              : "bg-[#111] border-white/10 hover:border-gray-600"
                          }`}
                        >
                          <Icon className={`w-5 h-5 shrink-0 ${selected ? t.color : "text-gray-500"}`} />
                          <span
                            className={`text-sm font-medium ${selected ? t.color : "text-gray-400"}`}
                          >
                            {t.label}
                          </span>
                          {selected && <Check className={`w-4 h-4 ml-auto ${t.color}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 - Rewards */}
          {activeStep === 3 && (
            <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-visible">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#ffc032]" />
                <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Step 3 · Attach Rewards (Optional)
                </h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" />
                      Gold Amount (Max 9999)
                    </label>
                    <input
                      type="number"
                      name="attachedGold"
                      value={form.attachedGold}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      placeholder="0 (max 9999)"
                      className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      <Gem className="w-3.5 h-3.5 text-blue-400" />
                      Gems Amount (Max 9999)
                    </label>
                    <input
                      type="number"
                      name="attachedGems"
                      value={form.attachedGems}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      placeholder="0 (max 9999)"
                      className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
                    />
                  </div>
                </div>

                {/* Item Picker */}
                <div>
                  <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-purple-400" />
                      Item Rewards
                    </span>
                    {selectedItems.length > 0 && (
                      <span className="text-[#ffc032] normal-case font-semibold">
                        {selectedItems.length} selected
                      </span>
                    )}
                  </label>

                  {selectedItems.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedItems.map((item) => (
                        <div
                          key={item.itemId}
                          className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-purple-500/15 border border-purple-500/30 rounded-lg"
                        >
                          <div className="w-6 h-6 rounded overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                            {item.iconUrl ? (
                              <img
                                src={item.iconUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-3 h-3 text-purple-400" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-medium ${RARITY_COLORS[item.rarity] || "text-white"}`}
                          >
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.itemId)}
                            aria-label={`Remove ${item.name}`}
                            className="ml-1 text-purple-400/60 hover:text-purple-400 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative" ref={itemDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={itemSearch}
                        onChange={(e) => {
                          setItemSearch(e.target.value);
                          setShowItemDropdown(true);
                        }}
                        onFocus={() => setShowItemDropdown(true)}
                        placeholder={
                          loadingItems ? "Loading items..." : "Search items by name or ID..."
                        }
                        disabled={loadingItems}
                        className="w-full pl-10 pr-10 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowItemDropdown(!showItemDropdown)}
                        aria-label={showItemDropdown ? "Close item list" : "Open item list"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showItemDropdown ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {showItemDropdown && (
                      <div className="absolute z-50 mt-2 w-full bg-[#111111] border border-white/10 rounded-xl shadow-2xl shadow-black/60 max-h-72 overflow-y-auto">
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
                              const isSelected = selectedItems.some(
                                (s) => s.itemId === item.itemId
                              );
                              return (
                                <button
                                  key={item.itemId}
                                  type="button"
                                  onClick={() => handleSelectItem(item)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#252525] transition-colors text-left cursor-pointer ${
                                    isSelected ? "bg-purple-500/10" : ""
                                  }`}
                                >
                                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                    {item.iconUrl ? (
                                      <img
                                        src={item.iconUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Package className="w-4 h-4 text-white/20" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm font-medium truncate ${
                                        RARITY_COLORS[item.rarity] || "text-white"
                                      }`}
                                    >
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500">
                                        #{item.itemId}
                                      </span>
                                      <span className="text-xs text-gray-600">•</span>
                                      <span className="text-xs text-gray-500">{item.type}</span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-purple-400 shrink-0" />
                                  )}
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

                {selectedItems.length > 0 && (
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      <Package className="w-3.5 h-3.5 text-purple-400" />
                      Item Quantities
                    </label>
                    <div className="space-y-2">
                      {selectedItems.map((item) => (
                        <div
                          key={item.itemId}
                          className="flex items-center gap-3 p-2.5 bg-[#111] border border-white/10 rounded-xl"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                            {item.iconUrl ? (
                              <img
                                src={item.iconUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-white/20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                RARITY_COLORS[item.rarity] || "text-white"
                              }`}
                            >
                              {item.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              #{item.itemId}
                              {item.maxStack > 1 && ` · max ${item.maxStack}`}
                            </span>
                          </div>
                          <label htmlFor={`qty-${item.itemId}`} className="sr-only">
                            {`Quantity for ${item.name}`}
                          </label>
                          <input
                            id={`qty-${item.itemId}`}
                            type="number"
                            value={itemQuantities[item.itemId] ?? ""}
                            onChange={(e) =>
                              setItemQuantities((prev) => ({
                                ...prev,
                                [item.itemId]: e.target.value,
                              }))
                            }
                            min="1"
                            max={item.maxStack > 0 ? Math.min(item.maxStack, 99) : 99}
                            placeholder="1 (max 99)"
                            className="w-28 px-3 py-2 bg-[#0d0d0d] border border-white/10 rounded-lg text-white text-center placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="expiredAt"
                    aria-label="Expiry date"
                    value={form.expiredAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Leave empty for no expiry. Time is interpreted in your local timezone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 - Review */}
          {activeStep === 4 && (
            <div className="space-y-5">
              <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#ffc032]" />
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                    Step 4 · Review &amp; Send
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  {/* Live preview card */}
                  <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentType.bg} ${currentType.color} ${currentType.border}`}
                      >
                        <currentType.icon className="w-3 h-3" />
                        {currentType.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        To:{" "}
                        <span className="text-white font-medium">{recipientCount}</span>
                      </span>
                      {form.expiredAt && (
                        <span className="text-xs text-gray-500">
                          Expires:{" "}
                          <span className="text-orange-400 font-medium">
                            {new Date(form.expiredAt).toLocaleString()}
                          </span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {form.title || (
                        <span className="italic text-gray-600">No title yet</span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {form.content || (
                        <span className="italic text-gray-600">No content yet</span>
                      )}
                    </p>
                    {hasRewards && (
                      <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                        {Number(form.attachedGold || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                            <Coins className="w-3 h-3" />
                            {Number(form.attachedGold).toLocaleString()} Gold
                          </span>
                        )}
                        {Number(form.attachedGems || 0) > 0 && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            <Gem className="w-3 h-3" />
                            {Number(form.attachedGems).toLocaleString()} Gems
                          </span>
                        )}
                        {selectedItems.map((item) => (
                          <span
                            key={item.itemId}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-purple-500/15 text-purple-400 border border-purple-500/30"
                          >
                            <Package className="w-3 h-3" />
                            {item.name}
                            {getItemQuantity(item.itemId) > 1 &&
                              ` x${getItemQuantity(item.itemId)}`}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirmation list */}
                  <div className="space-y-2 text-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Summary
                    </p>
                    <SummaryRow label="Recipients" value={recipientCount} />
                    <SummaryRow label="Mailbox Type" value={currentType.label} />
                    <SummaryRow
                      label="Title"
                      value={form.title || <span className="text-red-400">missing</span>}
                    />
                    <SummaryRow
                      label="Content"
                      value={
                        form.content ? (
                          `${form.content.length} characters`
                        ) : (
                          <span className="text-red-400">missing</span>
                        )
                      }
                    />
                    <SummaryRow
                      label="Attached Rewards"
                      value={
                        hasRewards ? (
                          <span className="text-green-400">Yes</span>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )
                      }
                    />
                    <SummaryRow
                      label="Expires"
                      value={
                        form.expiredAt ? (
                          new Date(form.expiredAt).toLocaleString()
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div className="text-sm text-orange-300">
                  <p className="font-semibold text-orange-400 mb-1">Please confirm</p>
                  <p className="text-orange-300/80">
                    This action will deliver mail immediately. Make sure all details are
                    correct before sending.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={submitting || success}
                  className="px-5 py-2.5 bg-[#111111] hover:bg-[#222] text-gray-400 hover:text-white border border-white/10 hover:border-gray-600 rounded-xl font-medium transition-all disabled:opacity-50 cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting || success}
                className="px-4 py-2.5 text-gray-500 hover:text-red-400 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Reset
              </button>
            </div>

            {activeStep < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                disabled={submitting || success}
                className="px-6 py-2.5 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || success}
                className="flex items-center gap-2 px-8 py-3 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            )}
          </div>
        </div>

        {/* Live Side Panel */}
        <div className="space-y-3 lg:sticky lg:top-6">
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#ffc032]" />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Quick Summary
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <SideRow label="Recipients" value={recipientCount} highlight />
              <SideRow
                label="Type"
                value={
                  <span className={`inline-flex items-center gap-1 ${currentType.color}`}>
                    <currentType.icon className="w-3 h-3" />
                    {currentType.label}
                  </span>
                }
              />
              <SideRow
                label="Title"
                value={
                  form.title ? (
                    <span className="text-white line-clamp-2">{form.title}</span>
                  ) : (
                    <span className="text-gray-600 italic">—</span>
                  )
                }
              />
              <SideRow
                label="Content"
                value={
                  form.content ? (
                    <span className="text-gray-300 line-clamp-3 text-xs">
                      {form.content}
                    </span>
                  ) : (
                    <span className="text-gray-600 italic">—</span>
                  )
                }
              />
              <div className="pt-3 border-t border-white/10 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rewards
                </p>
                {!hasRewards ? (
                  <p className="text-xs text-gray-600 italic">No rewards attached</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {Number(form.attachedGold || 0) > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                        <Coins className="w-3 h-3" />
                        {Number(form.attachedGold).toLocaleString()}
                      </span>
                    )}
                    {Number(form.attachedGems || 0) > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <Gem className="w-3 h-3" />
                        {Number(form.attachedGems).toLocaleString()}
                      </span>
                    )}
                    {selectedItems.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <Package className="w-3 h-3" />
                        {selectedItems.length} item
                        {selectedItems.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/manage-mailbox")}
            className="w-full px-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            ← Back to Mailbox
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-white/10 last:border-0">
      <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-sm text-white text-right break-words">{value}</span>
    </div>
  );
}

function SideRow({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <div className={`text-sm ${highlight ? "text-[#ffc032] font-semibold" : ""}`}>{value}</div>
    </div>
  );
}
