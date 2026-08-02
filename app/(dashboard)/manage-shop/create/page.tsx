"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { create } from "@/lib/api/shop-items";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import type { CreateShopItemRequest } from "@/lib/types";
import FormHeader from "@/components/form/FormHeader";
import ShopItemForm from "../_components/ShopItemForm";

export default function CreateShopItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateShopItemRequest) => {
    try {
      setLoading(true);
      setError(null);
      await create(payload);
      await showSuccessAlert("Success!", "Shop item created successfully.");
      router.push("/manage-shop");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create shop item";
      setError(msg);
      await showErrorAlert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader
        title="Create Shop Item"
        subtitle="Add an item to the in-game shop"
        backHref="/manage-shop"
        badge="New"
        badgeTone="primary"
        actions={<ShoppingBag className="h-5 w-5 text-[#ffc032]" />}
      />

      <ShopItemForm
        mode="create"
        loading={loading}
        error={error}
        onDismissError={() => setError(null)}
        onCancel={() => router.push("/manage-shop")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}