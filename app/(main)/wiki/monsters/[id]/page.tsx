"use client";

import { useParams } from "next/navigation";
import MonstersCodex from "@/components/wiki/MonstersCodex";

export default function MonsterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  return <MonstersCodex initialMonsterId={Number.isFinite(id) ? id : undefined} />;
}
