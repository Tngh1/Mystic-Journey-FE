"use client";

import { useParams } from "next/navigation";
import MonstersCodex from "@/components/wiki/MonstersCodex";

// Renders the monster detail page view component.
// Returns the JSX element hierarchy for the page view.
export default function MonsterDetailPage() {
  // Renders the params view component.
  // Returns the JSX element hierarchy for the page view.
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <MonstersCodex initialMonsterId={Number.isFinite(id) ? id : undefined} />;
}
