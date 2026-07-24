"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { create } from "@/lib/api/quests";
import type { UpdateQuestRequest } from "@/lib/types";
import FormHeader from "@/components/form/FormHeader";
import QuestForm from "../_components/QuestForm";
import { Scroll } from "lucide-react";

export default function CreateQuestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: UpdateQuestRequest) => {
    try {
      setLoading(true);
      setError(null);
      await create(payload);
      router.push("/manage-quests");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create quest");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader
        title="Create New Quest"
        subtitle="Configure quest objectives, rewards, NPC dialogue link, and map routing"
        backHref="/manage-quests"
        badge="New"
        badgeTone="primary"
        actions={<Scroll className="h-5 w-5 text-[#ffc032]" />}
      />

      <QuestForm
        mode="create"
        loading={loading}
        error={error}
        onDismissError={() => setError(null)}
        onCancel={() => router.push("/manage-quests")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}