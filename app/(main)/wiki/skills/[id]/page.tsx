"use client";

import { useParams } from "next/navigation";
import SkillsCodex from "@/components/wiki/SkillsCodex";

// Renders the skill detail page view component.
// Returns the JSX element hierarchy for the page view.
export default function SkillDetailPage() {
  // Renders the params view component.
  // Returns the JSX element hierarchy for the page view.
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <SkillsCodex initialSkillId={Number.isFinite(id) ? id : undefined} />;
}
