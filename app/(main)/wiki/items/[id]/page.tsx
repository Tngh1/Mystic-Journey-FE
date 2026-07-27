"use client";

import { useParams } from "next/navigation";
import ItemsCodex from "@/components/wiki/ItemsCodex";

/* Same tome as /wiki/items — a deep link only decides which entry starts open on
   the recto, so there is no second layout here to drift from the index. */
export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <ItemsCodex initialItemId={Number.isFinite(id) ? id : undefined} />;
}
