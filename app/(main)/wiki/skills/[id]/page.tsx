"use client";

import { useParams } from "next/navigation";
import SkillsCodex from "@/components/wiki/SkillsCodex";

export default function SkillDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <SkillsCodex initialSkillId={Number.isFinite(id) ? id : undefined} />;
}
