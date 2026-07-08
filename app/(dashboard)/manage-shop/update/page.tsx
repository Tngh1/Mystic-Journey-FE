"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update, ShopItemResponse } from "@/lib/api/shop-items";
import { getAll as getAllItems, ItemResponse } from "@/lib/api/items";
import { Save, Loader2, ShoppingBag } from "lucide-react";
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

const toDateTimeLocal = (value: string | null) => value ? value.slice(0, 16) : "";

export default function EditShopItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopItemId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    if (!shopItemId) return;
    getById(Number(shopItemId))
      .then((item: ShopItemResponse) => {
        setFormData({
          itemId: item.itemId,
          currency: item.currency,
          price: item.price,
          stock: item.stock,
          dailyPurchaseLimit: item.dailyPurchaseLimit,
          availableFrom: toDateTimeLocal(item.availableFrom),
          availableTo: toDateTimeLocal(item.availableTo),
          isActive: item.isActive,
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load shop item");
      })
      .finally(() => setFetching(false));
  }, [shopItemId]);

  const handleChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopItemId) return;
    try {
      setLoading(true);
      setError(null);
      await update(Number(shopItemId), {
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
      setError(err instanceof Error ? err.message : "Failed to update shop item");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading shop item data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-32">
      <FormHeader
        title="Update Shop Item"
        subtitle={`Update shop item details (ID: ${shopItemId})`}
        backHref="/manage-shop"
        badge="Editing"
        badgeTone="warning"
      />

      {error && <FormAlert message={error} onDismiss={() => setError(null)} />}

      <FormSection title="Pricing & Availability" icon={ShoppingBag}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Select Item" htmlFor="itemId" required>
            {loadingItems ? (
              <div className="flex items-center gap-2 text-white/50 px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading items...</span>
              </div>
            ) : (
              <SelectInput
                id="itemId"
                options={items.map((item) => ({
                  value: String(item.itemId),
                  label: `${item.name} (${item.type} - ${item.rarity})`,
                }))}
                value={String(formData.itemId)}
                onChange={(e) => handleChange("itemId", Number(e.target.value))}
              />
            )}
          </FormField>

          <FormField label="Currency Type" htmlFor="currency">
            <SelectInput
              id="currency"
              options={CURRENCY_TYPES}
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
            />
          </FormField>

          <FormField label="Price" htmlFor="price">
            <TextInput
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              min="0"
              step="0.01"
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

          <FormField label="Daily Purchase Limit" htmlFor="dailyPurchaseLimit">
            <TextInput
              id="dailyPurchaseLimit"
              type="number"
              value={formData.dailyPurchaseLimit}
              onChange={(e) => handleChange("dailyPurchaseLimit", Number(e.target.value))}
              min="0"
            />
          </FormField>

          <FormField label="Available From" htmlFor="availableFrom">
            <TextInput
              id="availableFrom"
              type="datetime-local"
              value={formData.availableFrom}
              onChange={(e) => handleChange("availableFrom", e.target.value)}
            />
          </FormField>

          <FormField label="Available To" htmlFor="availableTo">
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
        submitLabel="Update Shop Item"
        loadingLabel="Updating..."
        loading={loading}
        submitIcon={Save}
      />
    </form>
  );
}