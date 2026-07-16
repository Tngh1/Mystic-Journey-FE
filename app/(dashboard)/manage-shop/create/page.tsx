"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAll as getAllItems, ItemResponse } from "@/lib/api/items";
import { create } from "@/lib/api/shop-items";
import { Save, Loader2, ShoppingBag, Coins } from "lucide-react";
import FormHeader from "@/components/form/FormHeader";
import FormSection from "@/components/form/FormSection";
import FormField from "@/components/form/FormField";
import FormActions from "@/components/form/FormActions";
import FormAlert from "@/components/form/FormAlert";
import { TextInput, SelectInput, Checkbox } from "@/components/form/FormInput";

const CURRENCY_TYPES = [
  { value: "Gold", label: "Gold" },
  { value: "Gems", label: "Gems" },
  { value: "USD", label: "USD (Real Money)" },
];

export default function CreateShopItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemId: 0,
    currency: "Gold",
    price: 0,
    stock: -1,
    dailyPurchaseLimit: 0,
    availableFrom: "",
    availableTo: "",
    isActive: true,
  });

  useEffect(() => {
    getAllItems(1, 100)
      .then((res) => setItems(res.items))
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await create({
        itemId: formData.itemId,
        currency: formData.currency,
        price: formData.price,
        stock: formData.stock,
        dailyPurchaseLimit: formData.dailyPurchaseLimit,
        isActive: formData.isActive,
        ...(formData.availableFrom ? { availableFrom: new Date(formData.availableFrom).toISOString() } : {}),
        ...(formData.availableTo ? { availableTo: new Date(formData.availableTo).toISOString() } : {}),
      });
      router.push("/manage-shop");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create shop item");
    } finally {
      setLoading(false);
    }
  };

  const itemOptions = items.map((item) => ({
    value: item.itemId,
    label: `${item.name} (${item.type} - ${item.rarity})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Create Shop Item"
        subtitle="Add a new item to the shop"
        backHref="/manage-shop"
        badge="New"
        badgeTone="primary"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Pricing & Availability" icon={ShoppingBag}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Select Item" htmlFor="itemId" required>
            {loadingItems ? (
              <div className="flex items-center gap-2 text-white/50 h-[42px]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading items...</span>
              </div>
            ) : (
              <SelectInput
                id="itemId"
                options={[{ value: 0, label: "Select an item" }, ...itemOptions]}
                value={formData.itemId}
                onChange={(e) => handleChange("itemId", Number(e.target.value))}
                required
              />
            )}
          </FormField>

          <FormField label="Currency Type" htmlFor="currency" required>
            <SelectInput
              id="currency"
              options={CURRENCY_TYPES}
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
            />
          </FormField>

          <FormField label="Price" htmlFor="price" required>
            <TextInput
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
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
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              min="-1"
            />
          </FormField>

          <FormField label="Daily Purchase Limit" htmlFor="dailyPurchaseLimit" hint="0 = None">
            <TextInput
              id="dailyPurchaseLimit"
              type="number"
              value={formData.dailyPurchaseLimit}
              onChange={(e) => handleChange("dailyPurchaseLimit", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="Available From" htmlFor="availableFrom" hint="Optional">
            <TextInput
              id="availableFrom"
              type="datetime-local"
              value={formData.availableFrom}
              onChange={(e) => handleChange("availableFrom", e.target.value)}
            />
          </FormField>

          <FormField label="Available To" htmlFor="availableTo" hint="Optional">
            <TextInput
              id="availableTo"
              type="datetime-local"
              value={formData.availableTo}
              onChange={(e) => handleChange("availableTo", e.target.value)}
            />
          </FormField>
        </div>

        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          label="Item is available for purchase in shop"
        />
      </FormSection>

      <FormActions
        onCancel={() => router.push("/manage-shop")}
        submitLabel="Create Shop Item"
        loadingLabel="Creating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}