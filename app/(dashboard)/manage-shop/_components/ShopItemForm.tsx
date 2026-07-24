"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, Coins, Gem, Package, Save, ShoppingBag, TimerReset, Search } from "lucide-react";
import { getAll as getAllItems } from "@/lib/api/items";
import type { CreateShopItemRequest, ItemResponse, ShopItemResponse } from "@/lib/types";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import FormField from "@/components/form/FormField";
import FormSection from "@/components/form/FormSection";
import { Checkbox, SelectInput, TextInput } from "@/components/form/FormInput";
import DateTimePicker from "@/components/ui/DateTimePicker";
import ItemPickerModal from "@/components/ui/ItemPickerModal";

const CURRENCY_OPTIONS = [
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
];

const SECTION_OPTIONS = [
  { value: "Fixed", label: "Fixed" },
  { value: "DailyDeal", label: "Daily Deal" },
];

const RARITY_BADGES: Record<string, string> = {
  Common: "text-slate-300 border-slate-500/30 bg-slate-500/10",
  Uncommon: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Rare: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  Epic: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Legendary: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  Mythic: "text-rose-400 border-rose-500/30 bg-rose-500/10",
};

type ShopFormData = {
  itemId: number;
  shopSection: string;
  currency: string;
  price: number;
  stock: number;
  dailyPurchaseLimit: number;
  weeklyPurchaseLimit: number;
  availableFrom: string;
  availableTo: string;
  isActive: boolean;
};

type ShopItemFormProps = {
  mode: "create" | "update";
  initialData?: ShopItemResponse | null;
  loading: boolean;
  error?: string | null;
  onDismissError?: () => void;
  onCancel: () => void;
  onSubmit: (payload: CreateShopItemRequest) => Promise<void> | void;
};

const EMPTY_FORM: ShopFormData = {
  itemId: 0,
  shopSection: "Fixed",
  currency: "Gold",
  price: 0,
  stock: -1,
  dailyPurchaseLimit: 0,
  weeklyPurchaseLimit: 0,
  availableFrom: "",
  availableTo: "",
  isActive: true,
};

function toNumber(value: string, fallback = 0) {
  if (value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formFromInitial(initialData?: ShopItemResponse | null): ShopFormData {
  if (!initialData) return EMPTY_FORM;
  return {
    itemId: initialData.itemId,
    shopSection: initialData.shopSection || "Fixed",
    currency: initialData.currency || "Gold",
    price: initialData.price ?? 0,
    stock: initialData.stock ?? -1,
    dailyPurchaseLimit: initialData.dailyPurchaseLimit ?? 0,
    weeklyPurchaseLimit: initialData.weeklyPurchaseLimit ?? 0,
    availableFrom: toDateTimeLocal(initialData.availableFrom),
    availableTo: toDateTimeLocal(initialData.availableTo),
    isActive: initialData.isActive,
  };
}

function toIsoOrNull(value: string) {
  return value ? new Date(value).toISOString() : null;
}

function formatCurrency(value: number, currency: string) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
}

function stockLabel(stock: number) {
  if (stock < 0) return "Unlimited";
  if (stock === 0) return "Sold out";
  return stock.toLocaleString();
}

function availabilityLabel(formData: ShopFormData) {
  const now = Date.now();
  const from = formData.availableFrom ? new Date(formData.availableFrom).getTime() : null;
  const to = formData.availableTo ? new Date(formData.availableTo).getTime() : null;

  if (!formData.isActive) return "Inactive";
  if (from && from > now) return "Scheduled";
  if (to && to < now) return "Expired";
  if (!from && !to) return "Always available";
  return "Live";
}

export default function ShopItemForm({
  mode,
  initialData,
  loading,
  error,
  onDismissError,
  onCancel,
  onSubmit,
}: ShopItemFormProps) {
  const [formData, setFormData] = useState<ShopFormData>(() => formFromInitial(initialData));
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    getAllItems(1, 1000, { isActive: true })
      .then((res) => {
        if (!mounted) return;
        setItems(res.items ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setItems([]);
      })
      .finally(() => {
        if (mounted) setLoadingItems(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedItem = useMemo(
    () => items.find((item) => item.itemId === formData.itemId),
    [formData.itemId, items],
  );

  const alertMessage = localError || error;

  const handleChange = <K extends keyof ShopFormData>(field: K, value: ShopFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectItem = (item: ItemResponse) => {
    setFormData((prev) => ({
      ...prev,
      itemId: item.itemId,
      // Smart default price matching item baseValue if price is 0
      price: prev.price === 0 ? item.baseValue : prev.price,
    }));
  };

  const validate = () => {
    if (formData.itemId <= 0) return "Choose an item before saving.";
    if (!SECTION_OPTIONS.some((section) => section.value === formData.shopSection)) return "Shop section must be Fixed or DailyDeal.";
    if (!CURRENCY_OPTIONS.some((currency) => currency.value === formData.currency)) return "Currency must be Gold or Gems.";
    if (formData.price < 0) return "Price cannot be negative.";
    if (formData.stock < -1) return "Stock must be -1 or higher.";
    if (formData.dailyPurchaseLimit < 0 || formData.weeklyPurchaseLimit < 0) return "Purchase limits cannot be negative.";
    if (formData.availableFrom && formData.availableTo && new Date(formData.availableFrom) > new Date(formData.availableTo)) {
      return "Available To must be after Available From.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setLocalError(validation);
      return;
    }

    setLocalError(null);
    await onSubmit({
      itemId: formData.itemId,
      shopSection: formData.shopSection,
      currency: formData.currency,
      price: Math.max(0, formData.price),
      stock: Math.max(-1, Math.floor(formData.stock)),
      dailyPurchaseLimit: Math.max(0, Math.floor(formData.dailyPurchaseLimit)),
      weeklyPurchaseLimit: Math.max(0, Math.floor(formData.weeklyPurchaseLimit)),
      isActive: formData.isActive,
      availableFrom: toIsoOrNull(formData.availableFrom),
      availableTo: toIsoOrNull(formData.availableTo),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      {alertMessage && (
        <FormAlert
          message={alertMessage}
          onDismiss={() => {
            setLocalError(null);
            onDismissError?.();
          }}
        />
      )}

      {/* Item Picker Modal */}
      <ItemPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectItem}
        selectedItemId={formData.itemId}
        title="Select Target Shop Item"
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <FormSection title="Shop Item Selection" icon={Package} iconColor="text-sky-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Target Item" htmlFor="itemId" required>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="flex h-11 flex-1 items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-4 text-left text-sm transition-colors hover:border-[#ffc032]/40"
                  >
                    {selectedItem ? (
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={selectedItem.iconUrl || "/images/demo.jpg"}
                          alt={selectedItem.name}
                          className="h-6 w-6 rounded object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/demo.jpg"; }}
                        />
                        <span className="truncate font-bold text-white">{selectedItem.name}</span>
                        <span className="text-xs text-white/40">#{selectedItem.itemId}</span>
                      </div>
                    ) : (
                      <span className="text-white/40">Click to pick game item...</span>
                    )}
                    <Search className="h-4 w-4 shrink-0 text-[#ffc032]" />
                  </button>
                </div>
              </FormField>

              <FormField label="Shop Section" htmlFor="shopSection" required>
                <SelectInput
                  id="shopSection"
                  options={SECTION_OPTIONS}
                  value={formData.shopSection}
                  onChange={(event) => handleChange("shopSection", event.target.value)}
                  required
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Pricing & Stock Settings" icon={ShoppingBag} iconColor="text-[#ffc032]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Currency Type" htmlFor="currency" required>
                <SelectInput
                  id="currency"
                  options={CURRENCY_OPTIONS}
                  value={formData.currency}
                  onChange={(event) => handleChange("currency", event.target.value)}
                  required
                />
              </FormField>

              <FormField label="Selling Price" htmlFor="price" required>
                <div className="space-y-2">
                  <TextInput
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(event) => handleChange("price", Math.max(0, toNumber(event.target.value)))}
                    min="0"
                    step="0.01"
                    required
                  />
                  {selectedItem && selectedItem.baseValue > 0 && (
                    <button
                      type="button"
                      onClick={() => handleChange("price", selectedItem.baseValue)}
                      className="text-xs text-[#ffc032] hover:underline"
                    >
                      ⚡ Match Base Item Value ({selectedItem.baseValue} Gold)
                    </button>
                  )}
                </div>
              </FormField>

              <FormField label="Stock Quantity" htmlFor="stock" hint="-1 = Unlimited">
                <TextInput
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(event) => handleChange("stock", Math.max(-1, Math.floor(toNumber(event.target.value, -1))))}
                  min="-1"
                />
              </FormField>

              <div className="flex items-end gap-2">
                {[
                  { label: "Unlimited", value: -1 },
                  { label: "Sold out", value: 0 },
                  { label: "10", value: 10 },
                  { label: "50", value: 50 },
                  { label: "100", value: 100 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleChange("stock", preset.value)}
                    className="h-11 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-semibold text-white/65 transition-colors hover:border-[#ffc032]/40 hover:text-[#ffc032]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </FormSection>

          <FormSection title="Purchase Limits" icon={TimerReset} iconColor="text-purple-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Daily Purchase Limit" htmlFor="dailyPurchaseLimit" hint="0 = No daily limit">
                <TextInput
                  id="dailyPurchaseLimit"
                  type="number"
                  value={formData.dailyPurchaseLimit}
                  onChange={(event) => handleChange("dailyPurchaseLimit", Math.max(0, Math.floor(toNumber(event.target.value))))}
                  min="0"
                />
              </FormField>

              <FormField label="Weekly Purchase Limit" htmlFor="weeklyPurchaseLimit" hint="0 = No weekly limit">
                <TextInput
                  id="weeklyPurchaseLimit"
                  type="number"
                  value={formData.weeklyPurchaseLimit}
                  onChange={(event) => handleChange("weeklyPurchaseLimit", Math.max(0, Math.floor(toNumber(event.target.value))))}
                  min="0"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Availability Window" icon={CalendarClock} iconColor="text-emerald-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Available From" htmlFor="availableFrom" hint="Optional start time">
                <DateTimePicker
                  id="availableFrom"
                  value={formData.availableFrom}
                  onChange={(val) => handleChange("availableFrom", val)}
                  placeholder="No start limit"
                />
              </FormField>

              <FormField label="Available To" htmlFor="availableTo" hint="Optional end time">
                <DateTimePicker
                  id="availableTo"
                  value={formData.availableTo}
                  onChange={(val) => handleChange("availableTo", val)}
                  placeholder="No end limit"
                />
              </FormField>
            </div>

            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onChange={(event) => handleChange("isActive", event.target.checked)}
              label="Item is active in shop"
            />
          </FormSection>
        </div>

        {/* Live Shop Preview Card */}
        <aside className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffc032]/10 text-[#ffc032]">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Live Shop Card</h3>
                  <p className="text-[10px] text-white/40">{mode === "create" ? "New Shop Item" : `Shop Item #${initialData?.shopItemId}`}</p>
                </div>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${formData.isActive ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                {formData.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            {/* Simulated Shop Card */}
            <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  {selectedItem?.iconUrl || initialData?.itemIconUrl ? (
                    <img
                      src={selectedItem?.iconUrl || initialData?.itemIconUrl || ""}
                      alt={selectedItem?.name || initialData?.itemName || "Shop Item"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-white/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {selectedItem?.rarity && (
                      <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${RARITY_BADGES[selectedItem.rarity] || "text-white"}`}>
                        {selectedItem.rarity}
                      </span>
                    )}
                    <span className="text-[10px] text-white/40">{selectedItem?.type || initialData?.itemType || "Item"}</span>
                  </div>
                  <h4 className="truncate text-sm font-bold text-white mt-1">
                    {selectedItem?.name || initialData?.itemName || "No item selected"}
                  </h4>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-black text-white">
                    {formData.currency === "Gems" ? <Gem className="h-4 w-4 text-cyan-400" /> : <Coins className="h-4 w-4 text-amber-400" />}
                    {formatCurrency(formData.price, formData.currency)}
                  </div>
                  <span className="text-[10px] font-semibold text-white/40 uppercase">Price Tag</span>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <div className="text-sm font-black text-white">{stockLabel(formData.stock)}</div>
                  <span className="text-[10px] font-semibold text-white/40 uppercase">Stock</span>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-xs">
                <div className="flex items-center justify-between text-white/60">
                  <span>Limits:</span>
                  <span className="font-semibold text-purple-300">
                    {formData.dailyPurchaseLimit > 0 ? `Daily ${formData.dailyPurchaseLimit}` : "No Daily"} / {formData.weeklyPurchaseLimit > 0 ? `Weekly ${formData.weeklyPurchaseLimit}` : "No Weekly"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between text-white/60">
                  <span>Runtime:</span>
                  <span className="font-semibold text-amber-300">{availabilityLabel(formData)}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <FormActions
        onCancel={onCancel}
        submitLabel={mode === "create" ? "Create Shop Item" : "Update Shop Item"}
        loadingLabel={mode === "create" ? "Creating..." : "Updating..."}
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}