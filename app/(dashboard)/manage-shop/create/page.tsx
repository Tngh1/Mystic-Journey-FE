"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { create } from "@/lib/api/shop-items";
import { showSuccessAlert, showErrorAlert } from "@/lib/utils/swal";
import type { CreateShopItemRequest } from "@/lib/types";
import FormHeader from "@/components/form/FormHeader";
import ShopItemForm from "../_components/ShopItemForm";

// Renders the create shop item page view component.
// Key functionality: manages local UI state, pagination, and filter values; displays interactive alert dialogues for user actions.
// Returns the JSX element hierarchy for the page view.
export default function CreateShopItemPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [loading, setLoading] = useState(false);  // Initialize boolean flag as inactive
  const [error, setError] = useState<string | null>(null);

  // Renders the handle submit view component.
  // Key functionality: displays interactive alert dialogues for user actions.
  // Returns the JSX element hierarchy for the page view.
  const handleSubmit = async (payload: CreateShopItemRequest) => {
    try {
      setLoading(true);
      setError(null);
      await create(payload);
      await showSuccessAlert("Success!", "Shop item created successfully.");  // Display styled success alert dialog to the user
      router.push("/manage-shop");  // Navigate to the next page and push to history stack
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create shop item";
      setError(msg);
      await showErrorAlert("Error", msg);  // Display styled error alert dialog to the user
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
        onCancel={() => router.push("/manage-shop")}  // Navigate to the next page and push to history stack
        onSubmit={handleSubmit}
      />
    </div>
  );
}
