"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { getById, update } from "@/lib/api/shop-items";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import type { CreateShopItemRequest, ShopItemResponse } from "@/lib/types";
import FormHeader from "@/components/form/FormHeader";
import FormAlert from "@/components/form/FormAlert";
import ShopItemForm from "../_components/ShopItemForm";

export default function EditShopItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopItemId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(shopItemId));
  const [shopItem, setShopItem] = useState<ShopItemResponse | null>(null);
  const [error, setError] = useState<string | null>(shopItemId ? null : "Shop item id is missing.");

  useEffect(() => {
    if (!shopItemId) return;

    getById(Number(shopItemId))
      .then((item) => setShopItem(item))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load shop item"))
      .finally(() => setFetching(false));
  }, [shopItemId]);

  const handleSubmit = async (payload: CreateShopItemRequest) => {
    if (!shopItemId) return;

    try {
      setLoading(true);
      setError(null);
      await update(Number(shopItemId), payload);
      await showSuccessAlert("Success!", "Shop item updated successfully.");
      router.push("/manage-shop");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update shop item";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-10 w-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading shop item data...</p>
      </div>
    );
  }

  if (!shopItem && error) {
    return (
      <div className="space-y-6">
        <FormHeader title="Update Shop Item" subtitle="Shop item could not be loaded" backHref="/manage-shop" badge="Error" badgeTone="danger" />
        <FormAlert message={error} onDismiss={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title="Update Shop Item"
        subtitle={`Update shop item details (ID: ${shopItemId})`}
        backHref="/manage-shop"
        badge={shopItem?.isActive ? "Active" : "Inactive"}
        badgeTone={shopItem?.isActive ? "success" : "danger"}
        actions={<ShoppingBag className="h-5 w-5 text-[#ffc032]" />}
      />

      <ShopItemForm
        key={shopItem?.shopItemId ?? "pending"}
        mode="update"
        initialData={shopItem}
        loading={loading}
        error={error}
        onDismissError={() => setError(null)}
        onCancel={() => router.push("/manage-shop")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}