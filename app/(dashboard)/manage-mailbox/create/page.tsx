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
import { sendByList, sendBroadcast } from "@/lib/api/mails";
import type { SendMailByListIdRequest, SendMailToAllRequest } from "@/lib/api/mails";
import { getAllSimple } from "@/lib/api/items";
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
  const [playerSelection, setPlayerSelection] = useState<"single" | "multiple">("single");
  const [activeStep, setActiveStep] = useState(1);

  // Item picker state
  const [allItems, setAllItems] = useState<ItemResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
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

  useEffect(() => {
    getAllSimple()
      .then(setAllItems)
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(e.target as Node)) {
        setShowItemDropdown(false);
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

  const parsedMultipleIds = useMemo(
    () =>
      multipleIds
        .split(/[\s,]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0),
    [multipleIds]
  );

  const recipientCount = useMemo(() => {
    if (sendToAll) return "All players";
    if (playerSelection === "single") return singleId.trim() ? "1 player" : "0 players";
    return `${parsedMultipleIds.length} players`;
  }, [sendToAll, playerSelection, singleId, parsedMultipleIds.length]);

  const hasRewards = useMemo(() => {
    return (
      Number(form.attachedGold || 0) > 0 ||
      Number(form.attachedGems || 0) > 0 ||
      selectedItems.length > 0
    );
  }, [form.attachedGold, form.attachedGems, selectedItems]);

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

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      type: "System",
      attachedGold: "",
      attachedGems: "",
      attachedItemQuantity: "",
      expiredAt: "",
    });
    setSingleId("");
    setMultipleIds("");
    setSelectedItems([]);
    setSendToAll(false);
    setPlayerSelection("single");
    setActiveStep(1);
    setError(null);
  };

  const buildPayload = (): SendMailByListIdRequest | SendMailToAllRequest => {
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
        quantity: form.attachedItemQuantity
          ? Number(form.attachedItemQuantity)
          : 1,
      })),
      expiredAt: expiredAtUtc,
    };

    if (sendToAll) {
      return base as SendMailToAllRequest;
    }

    let ids: number[] = [];
    if (playerSelection === "single" && singleId) {
      const id = Number(singleId);
      if (!isNaN(id)) ids = [id];
    } else {
      ids = parsedMultipleIds;
    }

    return { ...base, playerProfileIds: ids } as SendMailByListIdRequest;
  };

  const validateCurrentStep = (): boolean => {
    if (activeStep === 1) {
      if (sendToAll) return true;
      if (playerSelection === "single") {
        if (!singleId.trim() || isNaN(Number(singleId))) {
          setError("Please enter a valid Player Profile ID.");
          return false;
        }
      } else if (parsedMultipleIds.length === 0) {
        setError("Please enter at least one valid Player Profile ID.");
        return false;
      }
    }
    if (activeStep === 2) {
      if (!form.title.trim()) {
        setError("Mail title is required.");
        return false;
      }
      if (!form.content.trim()) {
        setError("Mail content is required.");
        return false;
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

  const currentType = MAIL_TYPES.find((t) => t.value === form.type) ?? MAIL_TYPES[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <FormHeader
        title="Send Mail"
        subtitle="Compose and deliver mail to players"
        backHref="/manage-mailbox"
        badge="Composer"
        badgeTone="warning"
        actions={
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] border border-gray-800">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">Recipients:</span>
            <span className="text-xs font-semibold text-[#ffc032]">{recipientCount}</span>
          </div>
        }
      />

      {/* Stepper */}
      <div className="bg-[#111111] border border-gray-800 rounded-2xl p-4">
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
                  className="flex flex-col items-center gap-1.5 shrink-0 group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      isActive
                        ? "bg-[#ffc032] text-[#111] border-[#ffc032] scale-110"
                        : isCompleted
                          ? "bg-green-500/20 text-green-400 border-green-500/40"
                          : "bg-[#111] text-gray-500 border-gray-700"
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
          <p className="text-green-400 text-sm">Mail sent successfully! Redirecting...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main Form Area */}
        <div className="space-y-5 min-w-0">
          {/* STEP 1 - Recipients */}
          {activeStep === 1 && (
            <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
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
                      : "bg-[#111] border-gray-700 hover:border-gray-600"
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
                    <div className="flex rounded-xl bg-[#111] p-1 gap-1 border border-gray-800">
                      <button
                        type="button"
                        onClick={() => setPlayerSelection("single")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          playerSelection === "single"
                            ? "bg-[#ffc032] text-[#111]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Single Player
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlayerSelection("multiple")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          playerSelection === "multiple"
                            ? "bg-[#ffc032] text-[#111]"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        Multiple Players
                      </button>
                    </div>

                    {playerSelection === "single" ? (
                      <div>
                        <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                          <span>
                            Player Profile ID <span className="text-red-400">*</span>
                          </span>
                          <span className="text-gray-600 normal-case">Numeric only</span>
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
                        <label className="flex items-center justify-between text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                          <span>
                            Player Profile IDs <span className="text-red-400">*</span>
                          </span>
                          <span className="text-[#ffc032] normal-case font-semibold">
                            {parsedMultipleIds.length} valid
                          </span>
                        </label>
                        <textarea
                          value={multipleIds}
                          onChange={(e) => setMultipleIds(e.target.value)}
                          placeholder={"One per line, or separated by commas:\n1, 2, 3, 4, 5"}
                          rows={4}
                          className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 - Message */}
          {activeStep === 2 && (
            <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
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
                    className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wide">
                    Mail Type
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
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                            selected
                              ? `${t.bg} ${t.border}`
                              : "bg-[#111] border-gray-700 hover:border-gray-600"
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
            <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-visible">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
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
                      Gold Amount
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
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                      <Gem className="w-3.5 h-3.5 text-blue-400" />
                      Gems Amount
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
                        className="w-full pl-10 pr-10 py-3 bg-[#111] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#ffc032] transition-colors disabled:opacity-50"
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
                      <div className="absolute z-50 mt-2 w-full bg-[#111111] border border-gray-700 rounded-xl shadow-2xl shadow-black/60 max-h-72 overflow-y-auto">
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
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#252525] transition-colors text-left ${
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
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="expiredAt"
                    aria-label="Expiry date"
                    value={form.expiredAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-[#ffc032] transition-colors"
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
              <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#ffc032]" />
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                    Step 4 · Review &amp; Send
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  {/* Live preview card */}
                  <div className="bg-[#111] border border-gray-800 rounded-xl p-5 space-y-3">
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
                      <div className="pt-3 border-t border-gray-800 flex flex-wrap gap-2">
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
                            {Number(form.attachedItemQuantity || 1) > 1 &&
                              ` x${form.attachedItemQuantity || 1}`}
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
                    <SummaryRow label="Mail Type" value={currentType.label} />
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
                  className="px-5 py-2.5 bg-[#111111] hover:bg-[#222] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting || success}
                className="px-4 py-2.5 text-gray-500 hover:text-red-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
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
                className="px-6 py-2.5 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] font-bold rounded-xl transition-all disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
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
            )}
          </div>
        </div>

        {/* Live Side Panel */}
        <div className="space-y-3 lg:sticky lg:top-6">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
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
              <div className="pt-3 border-t border-gray-800 space-y-2">
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
    <div className="flex items-start justify-between gap-4 py-2 border-b border-gray-800 last:border-0">
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
