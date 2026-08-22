"use client";

import { Plus, Trash2 } from "lucide-react";
import { Checkbox, TextArea } from "@/components/form/FormInput";

export type QuestDialogueDraft = {
  content: string;
  isActive: boolean;
};

export function normalizeQuestDialogues(dialogues: QuestDialogueDraft[]) {
  return dialogues
    .filter((dialogue) => dialogue.content.trim())
    .map((dialogue, index) => ({
      content: dialogue.content.trim(),
      displayOrder: index,
      isActive: dialogue.isActive,
    }));
}

type Props = {
  dialogues: QuestDialogueDraft[];
  onChange: (dialogues: QuestDialogueDraft[]) => void;
  idPrefix: string;
};

export default function QuestDialogueEditor({ dialogues, onChange, idPrefix }: Props) {
  const addDialogue = () => onChange([...dialogues, { content: "", isActive: true }]);

  const updateDialogue = (index: number, patch: Partial<QuestDialogueDraft>) => {
    onChange(dialogues.map((dialogue, dialogueIndex) =>
      dialogueIndex === index ? { ...dialogue, ...patch } : dialogue));
  };

  const removeDialogue = (index: number) => {
    const remaining = dialogues.filter((_, dialogueIndex) => dialogueIndex !== index);
    onChange(remaining.length > 0 ? remaining : [{ content: "", isActive: true }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Dialogue sequence</p>
          <p className="text-xs text-white/40">The game displays active lines from top to bottom.</p>
        </div>
        <button
          type="button"
          onClick={addDialogue}
          className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-purple-500/20"
        >
          <Plus className="h-4 w-4" />
          Add dialogue
        </button>
      </div>

      {dialogues.map((dialogue, index) => (
        <div key={index} className="rounded-xl border border-purple-500/20 bg-black/15 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Dialogue {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeDialogue(index)}
              className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
              title="Remove dialogue"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <TextArea
            id={idPrefix + "-" + index}
            value={dialogue.content}
            onChange={(event) => updateDialogue(index, { content: event.target.value })}
            placeholder={"NPC dialogue line " + (index + 1)}
            rows={3}
          />

          <div className="mt-2">
            <Checkbox
              id={idPrefix + "-active-" + index}
              checked={dialogue.isActive}
              onChange={(event) => updateDialogue(index, { isActive: event.target.checked })}
              label="Active in game"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
