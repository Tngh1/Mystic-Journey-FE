"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, CalendarClock, Coins, Gem, Loader2, Package, Save, ShoppingBag, TimerReset, Archive } from "lucide-react";
import { getAll as getAllItems } from "@/lib/api/items";
import type { CreateShopItemRequest, ItemResponse, ShopItemResponse } from "@/lib/types";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import FormField from "@/components/form/FormField";
import FormSection from "@/components/form/FormSection";
import { Checkbox, SelectInput, TextInput } from "@/components/form/FormInput";
import DateTimePicker from "@/components/ui/DateTimePicker";

const CURRENCY_OPTIONS = [
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
];

const SECTION_OPTIONS = [
  { value: "Fixed", label: "Fixed" },
  { value: "DailyDeal", label: "Daily Deal" },
];

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

  const itemOptions = useMemo(() => {
    const options = items.map((item) => ({
      value: String(item.itemId),
      label: `${item.name} #${item.itemId} - ${item.type}${item.rarity ? ` / ${item.rarity}` : ""}`,
    }));

    if (initialData?.itemId && !options.some((option) => option.value === String(initialData.itemId))) {
      options.unshift({
        value: String(initialData.itemId),
        label: `${initialData.itemName ?? `Item #${initialData.itemId}`} #${initialData.itemId} - current item`,
      });
    }

    return options;
  }, [initialData, items]);

  const alertMessage = localError || error;

  const handleChange = <K extends keyof ShopFormData>(field: K, value: ShopFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <FormSection title="Shop Item" icon={Package} iconColor="text-sky-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Item" htmlFor="itemId" required>
                {loadingItems ? (
                  <div className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-white/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading items...
                  </div>
                ) : (
                  <SelectInput
                    id="itemId"
                    options={itemOptions}
                    placeholder="Choose item"
                    value={formData.itemId > 0 ? String(formData.itemId) : ""}
                    onChange={(event) => handleChange("itemId", event.target.value ? Number(event.target.value) : 0)}
                    required
                  />
                )}
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

          <FormSection title="Pricing & Stock" icon={ShoppingBag} iconColor="text-[#ffc032]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Currency" htmlFor="currency" required>
                <SelectInput
                  id="currency"
                  options={CURRENCY_OPTIONS}
                  value={formData.currency}
                  onChange={(event) => handleChange("currency", event.target.value)}
                  required
                />
              </FormField>

              <FormField label="Price" htmlFor="price" required>
                <TextInput
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(event) => handleChange("price", Math.max(0, toNumber(event.target.value)))}
                  min="0"
                  step="0.01"
                  required
                />
              </FormField>

              <FormField label="Stock" htmlFor="stock" hint="-1 = Unlimited">
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
              <FormField label="Daily Purchase Limit" htmlFor="dailyPurchaseLimit" hint="0 = None">
                <TextInput
                  id="dailyPurchaseLimit"
                  type="number"
                  value={formData.dailyPurchaseLimit}
                  onChange={(event) => handleChange("dailyPurchaseLimit", Math.max(0, Math.floor(toNumber(event.target.value))))}
                  min="0"
                />
              </FormField>

              <FormField label="Weekly Purchase Limit" htmlFor="weeklyPurchaseLimit" hint="0 = None">
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

          <FormSection title="Availability" icon={CalendarClock} iconColor="text-emerald-300">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Available From" htmlFor="availableFrom" hint="Optional">
                <DateTimePicker
                  id="availableFrom"
                  value={formData.availableFrom}
                  onChange={(val) => handleChange("availableFrom", val)}
                  placeholder="No start limit"
                />
              </FormField>

              <FormField label="Available To" htmlFor="availableTo" hint="Optional">
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

        <aside className="space-y-4 xl:sticky xl:top-24">
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffc032]/10 text-[#ffc032]">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Shop Preview</h2>
                <p className="text-xs text-white/40">{mode === "create" ? "New item" : `Shop item #${initialData?.shopItemId ?? ""}`}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/20">
                  {selectedItem?.iconUrl || initialData?.itemIconUrl ? (
                    <img
                      src={selectedItem?.iconUrl || initialData?.itemIconUrl || ""}
                      alt={selectedItem?.name || initialData?.itemName || "Shop item"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-white/35" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{selectedItem?.name || initialData?.itemName || "No item selected"}</p>
                  <p className="mt-1 text-xs text-white/40">{selectedItem?.type || initialData?.itemType || "Item"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  {formData.currency === "Gems" ? <Gem className="h-4 w-4 text-cyan-300" /> : <Coins className="h-4 w-4 text-yellow-300" />}
                  <p className="mt-2 text-sm font-black text-white">{formatCurrency(formData.price, formData.currency)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/35">Price</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <Archive className="h-4 w-4 text-green-300" />
                  <p className="mt-2 text-sm font-black text-white">{stockLabel(formData.stock)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/35">Stock</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/35">Runtime</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[#ffc032]/10 px-2 py-1 text-xs font-semibold text-[#ffc032]">{formData.shopSection}</span>
                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-semibold text-white/70">{availabilityLabel(formData)}</span>
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