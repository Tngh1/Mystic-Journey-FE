"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  Coins,
  Gem,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ItemPickerModal from "./ItemPickerModal";
import {
  getRewardsByMonth,
  createDailyLoginReward,
  updateDailyLoginReward,
  deleteDailyLoginReward,
} from "@/lib/api/daily-login-rewards";
import type {
  DailyLoginRewardResponse,
  UpdateDailyLoginRewardRequest,
  CreateDailyLoginRewardRequest,
} from "@/lib/types";
import type { ItemResponse } from "@/lib/api/items";
import { normalizeError } from "@/lib/api/client";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";

// ── Constants ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const TOTAL_DAYS = 31;

// ── Reward type config ────────────────────────────────────────────────────────
const REWARD_TYPES = ["Gold", "Gems", "Energy", "Item"] as const;
type RewardType = (typeof REWARD_TYPES)[number];

const rewardConfig: Record<
  RewardType,
  { label: string; icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  Gold:   { label: "Gold",   icon: <Coins className="w-4 h-4" />,   color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  Gems:   { label: "Gems",   icon: <Gem className="w-4 h-4" />,     color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/30"   },
  Energy: { label: "Energy", icon: <Zap className="w-4 h-4" />,     color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30"  },
  Item:   { label: "Item",   icon: <Package className="w-4 h-4" />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[80] flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${
        type === "success"
          ? "bg-green-500/10 border-green-500/30 text-green-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-current opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Month Switcher ────────────────────────────────────────────────────────────
interface ViewState {
  mode: "default" | "month";
  month: number; // 1–12
  year: number;
}

function MonthSwitcher({
  view,
  onChange,
}: {
  view: ViewState;
  onChange: (v: ViewState) => void;
}) {
  const now = new Date();

  const goPrev = () => {
    if (view.mode === "default") return;
    let m = view.month - 1;
    let y = view.year;
    if (m < 1) { m = 12; y--; }
    onChange({ mode: "month", month: m, year: y });
  };

  const goNext = () => {
    if (view.mode === "default") return;
    let m = view.month + 1;
    let y = view.year;
    if (m > 12) { m = 1; y++; }
    onChange({ mode: "month", month: m, year: y });
  };

  const isCurrentMonth =
    view.mode === "month" &&
    view.month === now.getMonth() + 1 &&
    view.year === now.getFullYear();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Default tab */}
      <button
        id="view-default"
        onClick={() => onChange({ mode: "default", month: now.getMonth() + 1, year: now.getFullYear() })}
        className={[
          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
          view.mode === "default"
            ? "bg-white/10 border-white/30 text-white"
            : "bg-white/3 border-white/10 text-white/40 hover:text-white hover:border-white/20",
        ].join(" ")}
      >
        <Star className="w-3 h-3" />
        Default
      </button>

      {/* Month navigator */}
      <div className="flex items-center gap-1">
        <button
          id="month-prev"
          onClick={goPrev}
          disabled={view.mode === "default"}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          id="view-current-month"
          onClick={() =>
            onChange({
              mode: "month",
              month: view.mode === "default" ? now.getMonth() + 1 : view.month,
              year: view.mode === "default" ? now.getFullYear() : view.year,
            })
          }
          className={[
            "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-w-[110px] text-center",
            view.mode === "month"
              ? "bg-[#ffc032]/10 border-[#ffc032]/30 text-[#ffc032]"
              : "bg-white/3 border-white/10 text-white/40 hover:text-white hover:border-white/20",
          ].join(" ")}
        >
          {view.mode === "month"
            ? `${MONTH_NAMES[view.month - 1]} ${view.year}`
            : `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`}
          {isCurrentMonth && (
            <span className="ml-1.5 text-[10px] opacity-60">(current)</span>
          )}
        </button>

        <button
          id="month-next"
          onClick={goNext}
          disabled={view.mode === "default"}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Day Card ──────────────────────────────────────────────────────────────────
interface DayCardProps {
  dayNumber: number;
  reward?: DailyLoginRewardResponse;
  viewMode: "default" | "month";
  onEdit: (day: number, reward?: DailyLoginRewardResponse) => void;
  onDelete: (reward: DailyLoginRewardResponse) => void;
}

function DayCard({ dayNumber, reward, viewMode, onEdit, onDelete }: DayCardProps) {
  const hasReward = reward && reward.isActive && reward.rewardType !== "None";
  const cfg = hasReward ? rewardConfig[reward.rewardType as RewardType] : null;

  // Trong tab tháng: ô "fallback from default" = reward.isDefault=true
  const isFallback = viewMode === "month" && hasReward && reward?.isDefault;
  const isOverride = viewMode === "month" && hasReward && !reward?.isDefault;

  return (
    <div
      className={[
        "relative rounded-2xl border p-3 flex flex-col gap-2 transition-all duration-200 group",
        hasReward
          ? isOverride
            ? `${cfg!.bg} ${cfg!.border}`
            : "bg-white/[0.03] border-white/12"
          : "bg-white/[0.02] border-white/8 hover:border-white/20",
      ].join(" ")}
    >
      {/* Day number + badge */}
      <div className="flex items-center justify-between min-h-[18px]">
        <span className={`text-xs font-bold ${hasReward ? (isOverride ? cfg!.color : "text-white/50") : "text-white/30"}`}>
          Day {dayNumber}
        </span>

        <div className="flex items-center gap-1">
          {/* Badge */}
          {hasReward && (
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border leading-none ${
                isOverride
                  ? "bg-[#ffc032]/15 border-[#ffc032]/30 text-[#ffc032]"
                  : isFallback
                  ? "bg-white/5 border-white/15 text-white/30"
                  : "bg-white/10 border-white/20 text-white/50"
              }`}
            >
              {isOverride ? "OVERRIDE" : "DEFAULT"}
            </span>
          )}

          {/* Edit / Delete buttons — chỉ hiện cho reward có thể edit */}
          {hasReward && !isFallback && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              <button
                id={`edit-day-${dayNumber}`}
                onClick={() => onEdit(dayNumber, reward)}
                className="w-5 h-5 flex items-center justify-center rounded-md bg-white/10 hover:bg-[#ffc032]/20 text-white/50 hover:text-[#ffc032] transition-colors cursor-pointer"
              >
                <Pencil className="w-2.5 h-2.5" />
              </button>
              <button
                id={`delete-day-${dayNumber}`}
                onClick={() => onDelete(reward!)}
                className="w-5 h-5 flex items-center justify-center rounded-md bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors cursor-pointer"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {hasReward ? (
        <div className="flex flex-col items-center gap-1.5">
          {/* Icon */}
          {reward!.rewardType === "Item" ? (
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-white/30" />
            </div>
          ) : (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg!.bg} border ${cfg!.border} ${isFallback ? "opacity-50" : ""}`}>
              <span className={cfg!.color}>{cfg!.icon}</span>
            </div>
          )}

          {/* Value */}
          <div className="text-center">
            {reward!.rewardType === "Item" ? (
              <>
                <p className={`text-[11px] font-semibold truncate max-w-[80px] ${isFallback ? "text-white/40" : "text-white"}`}>
                  {reward!.rewardItemName ?? "Item"}
                </p>
                <p className={`text-[10px] font-medium ${cfg!.color} ${isFallback ? "opacity-50" : ""}`}>
                  ×{reward!.rewardItemQuantity}
                </p>
              </>
            ) : (
              <p className={`text-sm font-bold ${cfg!.color} ${isFallback ? "opacity-50" : ""}`}>
                {reward!.rewardValue.toLocaleString()}
              </p>
            )}
          </div>

          {/* Override button — chỉ trong tab tháng + ô đang dùng default */}
          {isFallback && (
            <button
              id={`override-day-${dayNumber}`}
              onClick={() => onEdit(dayNumber, undefined)}
              className="text-[9px] text-[#ffc032]/60 hover:text-[#ffc032] font-medium transition-colors cursor-pointer leading-none"
            >
              + Override
            </button>
          )}
        </div>
      ) : (
        <button
          id={`add-day-${dayNumber}`}
          onClick={() => onEdit(dayNumber, undefined)}
          className="flex flex-col items-center justify-center gap-1 py-2 text-white/20 hover:text-white/60 transition-colors cursor-pointer w-full"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px]">Add</span>
        </button>
      )}
    </div>
  );
}

// ── Reward Form Modal ─────────────────────────────────────────────────────────
interface RewardFormData {
  rewardType: RewardType;
  rewardValue: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardItemIconUrl: string | null;
  rewardItemQuantity: number;
  isActive: boolean;
}

const DEFAULT_FORM: RewardFormData = {
  rewardType: "Gold",
  rewardValue: 100,
  rewardItemId: null,
  rewardItemName: null,
  rewardItemIconUrl: null,
  rewardItemQuantity: 1,
  isActive: true,
};

interface RewardFormModalProps {
  isOpen: boolean;
  dayNumber: number;
  viewState: ViewState;
  existing?: DailyLoginRewardResponse;
  onClose: () => void;
  onSaved: () => void;
}

function RewardFormModal({
  isOpen,
  dayNumber,
  viewState,
  existing,
  onClose,
  onSaved,
}: RewardFormModalProps) {
  const [form, setForm] = useState<RewardFormData>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showItemPicker, setShowItemPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(
        existing
          ? {
              rewardType: existing.rewardType as RewardType,
              rewardValue: existing.rewardValue,
              rewardItemId: existing.rewardItemId ?? null,
              rewardItemName: existing.rewardItemName ?? null,
              rewardItemIconUrl: null,
              rewardItemQuantity: existing.rewardItemQuantity,
              isActive: existing.isActive,
            }
          : DEFAULT_FORM
      );
      setError(null);
    }
  }, [isOpen, existing]);

  const isCreating = !existing;
  const isDefaultMode = viewState.mode === "default";

  // Tháng/năm sẽ gắn vào record mới
  const targetMonth = isDefaultMode ? null : viewState.month;
  const targetYear  = isDefaultMode ? null : viewState.year;

  const modeLabel = isDefaultMode
    ? "Default Cycle"
    : `${MONTH_NAMES[viewState.month - 1]} ${viewState.year}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (existing) {
        const payload: UpdateDailyLoginRewardRequest = {
          rewardType: form.rewardType,
          rewardValue: form.rewardType === "Item" ? 0 : form.rewardValue,
          rewardItemId: form.rewardType === "Item" ? form.rewardItemId : null,
          rewardItemQuantity: form.rewardType === "Item" ? form.rewardItemQuantity : 0,
          isActive: form.isActive,
        };
        await updateDailyLoginReward(existing.dailyLoginRewardId, payload);
      } else {
        const payload: CreateDailyLoginRewardRequest = {
          dayNumber,
          month: targetMonth,
          year: targetYear,
          rewardType: form.rewardType,
          rewardValue: form.rewardType === "Item" ? 0 : form.rewardValue,
          rewardItemId: form.rewardType === "Item" ? (form.rewardItemId ?? undefined) : undefined,
          rewardItemQuantity: form.rewardType === "Item" ? form.rewardItemQuantity : 0,
          isActive: form.isActive,
        };
        await createDailyLoginReward(payload);
      }
      await showSuccessAlert("Success!", existing ? "Daily login reward updated successfully." : "Daily login reward created successfully.");
      onSaved();
      onClose();
    } catch (err) {
      const msg = normalizeError(err).message;
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleItemSelect = (item: ItemResponse) => {
    setForm((prev) => ({
      ...prev,
      rewardItemId: item.itemId,
      rewardItemName: item.name,
      rewardItemIconUrl: item.iconUrl ?? null,
    }));
  };

  if (!isOpen) return null;

  const cfg = rewardConfig[form.rewardType];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ffc032]/10 border border-[#ffc032]/20 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-[#ffc032]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {isCreating ? "Create" : "Edit"} Reward — Day {dayNumber}
                </h2>
                <p className="text-xs text-white/40">
                  {isCreating
                    ? isDefaultMode
                      ? "Adding to Default cycle"
                      : `Creating override for ${modeLabel}`
                    : existing?.isDefault
                    ? "Editing Default cycle reward"
                    : `Editing override for ${modeLabel}`}
                </p>
              </div>
            </div>
            <button
              id="reward-form-close"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form id="reward-form" onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Reward Type selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">Reward Type</label>
              <div className="grid grid-cols-4 gap-2">
                {REWARD_TYPES.map((type) => {
                  const c = rewardConfig[type];
                  const active = form.rewardType === type;
                  return (
                    <button
                      key={type}
                      id={`reward-type-${type.toLowerCase()}`}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, rewardType: type }))}
                      className={[
                        "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-medium transition-all duration-150 cursor-pointer",
                        active
                          ? `${c.bg} ${c.border} ${c.color} shadow-sm`
                          : "bg-white/3 border-white/10 text-white/50 hover:border-white/30 hover:text-white",
                      ].join(" ")}
                    >
                      {c.icon}
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount (non-Item) */}
            {form.rewardType !== "Item" && (
              <div className="space-y-2">
                <label htmlFor="reward-value" className="block text-sm font-medium text-white/70">
                  Amount <span className="text-red-400">*</span>
                </label>
                <input
                  id="reward-value"
                  type="number"
                  min={1}
                  value={form.rewardValue}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, rewardValue: Number(e.target.value) }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                  required
                />
              </div>
            )}

            {/* Item picker */}
            {form.rewardType === "Item" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white/70">
                  Reward Item <span className="text-red-400">*</span>
                </label>

                {form.rewardItemId ? (
                  <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {form.rewardItemIconUrl ? (
                        <img
                          src={form.rewardItemIconUrl}
                          alt={form.rewardItemName ?? ""}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/demo.jpg";
                          }}
                        />
                      ) : (
                        <Package className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{form.rewardItemName}</p>
                      <p className="text-xs text-white/40">ID: {form.rewardItemId}</p>
                    </div>
                    <button
                      id="reward-change-item"
                      type="button"
                      onClick={() => setShowItemPicker(true)}
                      className="text-xs text-[#ffc032] hover:text-[#ffd04c] font-medium transition-colors cursor-pointer shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    id="reward-pick-item"
                    type="button"
                    onClick={() => setShowItemPicker(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-white/15 rounded-xl text-sm text-white/40 hover:text-white/70 hover:border-white/30 transition-all cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    Click to select an item
                  </button>
                )}

                <div className="space-y-2">
                  <label htmlFor="reward-qty" className="block text-sm font-medium text-white/70">
                    Quantity <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="reward-qty"
                    type="number"
                    min={1}
                    value={form.rewardItemQuantity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, rewardItemQuantity: Number(e.target.value) }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#ffc032]/50 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Active toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                id="reward-active-toggle"
                onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={[
                  "relative w-10 h-5 rounded-full border transition-all duration-200 cursor-pointer",
                  form.isActive ? "bg-[#ffc032] border-[#ffc032]" : "bg-white/10 border-white/20",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200",
                    form.isActive ? "left-5" : "left-0.5",
                  ].join(" ")}
                />
              </div>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Active
              </span>
            </label>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="reward-form-submit"
                type="submit"
                disabled={submitting || (form.rewardType === "Item" && !form.rewardItemId)}
                className="px-5 py-2 text-sm font-semibold text-black bg-[#ffc032] hover:bg-[#ffd04c] rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : existing ? "Save Changes" : "Create Reward"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ItemPickerModal
        isOpen={showItemPicker}
        onClose={() => setShowItemPicker(false)}
        onSelect={handleItemSelect}
        selectedItemId={form.rewardItemId}
      />
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ManageDailyLoginPage() {
  const now = new Date();

  // View state: Default hoặc tháng/năm cụ thể
  const [view, setView] = useState<ViewState>({
    mode: "default",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const [rewards, setRewards] = useState<DailyLoginRewardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingReward, setEditingReward] = useState<DailyLoginRewardResponse | undefined>();

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<DailyLoginRewardResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });

  // ── Data fetching ───────────────────────────────────────────────────────────
  const fetchRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const month = view.mode === "month" ? view.month : null;
      const year  = view.mode === "month" ? view.year  : null;
      const data  = await getRewardsByMonth(month, year);
      setRewards(data);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [view]);

  useEffect(() => {
    void Promise.resolve().then(fetchRewards);
  }, [fetchRewards]);

  // ── Build day → reward map ──────────────────────────────────────────────────
  const rewardByDay = new Map<number, DailyLoginRewardResponse>();
  rewards.forEach((r) => { if (r.isActive || r.rewardType === "None") rewardByDay.set(r.dayNumber, r); });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleEdit = (day: number, reward?: DailyLoginRewardResponse) => {
    setSelectedDay(day);
    setEditingReward(reward);
    setFormOpen(true);
  };

  const handleSaved = () => {
    showToast(editingReward ? "Reward updated!" : "Reward created!", "success");
    void fetchRewards();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDailyLoginReward(deleteTarget.dailyLoginRewardId);
      await showSuccessAlert("Deleted!", "Daily login reward deleted successfully.");
      showToast("Reward deleted!", "success");
      setDeleteTarget(null);
      void fetchRewards();
    } catch (err) {
      const msg = normalizeError(err).message;
      showToast(msg, "error");
      await showErrorAlert("Error", msg);
    } finally {
      setDeleting(false);
    }
  };

  // ── Stats ───────────────────────────────────────────────────────────────────
  const activeRewards   = rewards.filter((r) => r.isActive && r.rewardType !== "None");
  const overrideRewards = activeRewards.filter((r) => !r.isDefault);
  const goldCount   = activeRewards.filter((r) => r.rewardType === "Gold").length;
  const itemCount   = activeRewards.filter((r) => r.rewardType === "Item").length;

  const isMonthView = view.mode === "month";
  const viewLabel   = isMonthView ? `${MONTH_NAMES[view.month - 1]} ${view.year}` : "Default Cycle";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Login Rewards"
        subtitle="Configure default rewards and per-month overrides for daily login"
        icon={CalendarDays}
        actions={[
          {
            label: "New Reward",
            icon: Plus,
            onClick: () => handleEdit(1, undefined),
            variant: "primary",
          },
        ]}
      />

      {/* Month Switcher */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-white/40 mb-0.5">Viewing</p>
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            {isMonthView ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#ffc032] inline-block" />
                {viewLabel}
                <span className="text-xs text-white/30 font-normal">
                  (overrides + default fallback)
                </span>
              </>
            ) : (
              <>
                <Star className="w-3.5 h-3.5 text-white/50" />
                Default Cycle
                <span className="text-xs text-white/30 font-normal">
                  (applies to all months without overrides)
                </span>
              </>
            )}
          </p>
        </div>
        <MonthSwitcher view={view} onChange={setView} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Configured Days",
            value: activeRewards.length,
            sub: `of ${TOTAL_DAYS}`,
            color: "text-[#ffc032]",
            bg: "bg-[#ffc032]/10",
            border: "border-[#ffc032]/20",
          },
          {
            label: isMonthView ? "Overrides" : "Default Days",
            value: isMonthView ? overrideRewards.length : activeRewards.length,
            sub: isMonthView ? "this month" : "total",
            color: "text-white",
            bg: "bg-white/5",
            border: "border-white/10",
          },
          {
            label: "Gold Rewards",
            value: goldCount,
            sub: "days",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
          },
          {
            label: "Item Rewards",
            value: itemCount,
            sub: "days",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className="text-xs text-white/50 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/60 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Day 1 — {TOTAL_DAYS}
          </h2>
          {isMonthView && (
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#ffc032]/70">
                <span className="w-2 h-2 rounded-full bg-[#ffc032]/60 inline-block" />
                Override
              </span>
              <span className="flex items-center gap-1 text-white/30">
                <span className="w-2 h-2 rounded-full bg-white/20 inline-block" />
                Default fallback
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-white/40">
            <div className="w-6 h-6 border-2 border-[#ffc032]/30 border-t-[#ffc032] rounded-full animate-spin mr-3" />
            Loading rewards...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400 opacity-60" />
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchRewards}
              className="text-xs text-[#ffc032] hover:underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((day) => (
              <DayCard
                key={day}
                dayNumber={day}
                reward={rewardByDay.get(day)}
                viewMode={view.mode}
                onEdit={handleEdit}
                onDelete={(r) => setDeleteTarget(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reward Form Modal */}
      <RewardFormModal
        isOpen={formOpen}
        dayNumber={selectedDay}
        viewState={view}
        existing={editingReward}
        onClose={() => {
          setFormOpen(false);
          setEditingReward(undefined);
        }}
        onSaved={handleSaved}
      />

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Reward</h3>
                <p className="text-xs text-white/40">
                  Day {deleteTarget.dayNumber}
                  {deleteTarget.isDefault
                    ? " — Default"
                    : ` — ${MONTH_NAMES[(deleteTarget.month ?? 1) - 1]} ${deleteTarget.year}`}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-6">
              Are you sure you want to delete the{" "}
              <span className="text-white font-medium">{deleteTarget.rewardType}</span> reward for{" "}
              <span className="text-white font-medium">Day {deleteTarget.dayNumber}</span>?
              {deleteTarget.isDefault && (
                <span className="text-yellow-400/80 block mt-1 text-xs">
                  ⚠ This is a Default reward — deleting it will affect all months that use this default.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                id="delete-cancel"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
