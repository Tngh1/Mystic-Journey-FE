"use client";

import { useParams } from "next/navigation";
import ItemsCodex from "@/components/wiki/ItemsCodex";

// Renders the item detail page view component.
// Returns the JSX element hierarchy for the page view.
export default function ItemDetailPage() {
  // Renders the params view component.
  // Returns the JSX element hierarchy for the page view.
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <ItemsCodex initialItemId={Number.isFinite(id) ? id : undefined} />;
}
