"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getById, update } from "@/lib/api/quests";
import type { QuestResponse, UpdateQuestRequest } from "@/lib/types";
import FormHeader from "@/components/form/FormHeader";
import FormAlert from "@/components/form/FormAlert";
import QuestForm from "../_components/QuestForm";
import { Loader2, Scroll } from "lucide-react";

export default function EditQuestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const questId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(Boolean(questId));
  const [quest, setQuest] = useState<QuestResponse | null>(null);
  const [error, setError] = useState<string | null>(questId ? null : "Quest ID is missing.");

  useEffect(() => {
    if (!questId) return;

    getById(Number(questId))
      .then((item) => setQuest(item))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load quest details"))
      .finally(() => setFetching(false));
  }, [questId]);

  const handleSubmit = async (payload: UpdateQuestRequest) => {
    if (!questId) return;

    try {
      setLoading(true);
      setError(null);
      await update(Number(questId), payload);
      router.push("/manage-quests");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update quest");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <Loader2 className="h-10 w-10 animate-spin text-[#ffc032]" />
        <p className="text-gray-400">Loading quest details...</p>
      </div>
    );
  }

  if (!quest && error) {
    return (
      <div className="space-y-6">
        <FormHeader title="Update Quest" subtitle="Quest could not be loaded" backHref="/manage-quests" badge="Error" badgeTone="danger" />
        <FormAlert message={error} onDismiss={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title="Update Quest"
        subtitle={`Modify quest flow & reward config (ID: ${questId})`}
        backHref="/manage-quests"
        badge={quest?.isActive ? "Active" : "Inactive"}
        badgeTone={quest?.isActive ? "success" : "danger"}
        actions={<Scroll className="h-5 w-5 text-[#ffc032]" />}
      />

      <QuestForm
        key={quest?.questId ?? "pending"}
        mode="update"
        initialData={quest}
        loading={loading}
        error={error}
        onDismissError={() => setError(null)}
        onCancel={() => router.push("/manage-quests")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}