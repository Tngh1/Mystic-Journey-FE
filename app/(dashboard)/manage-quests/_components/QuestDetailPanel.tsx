"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Edit2,
  MapPin,
  Target,
  Gift,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Scroll,
  Star,
  Swords,
  Package,
  Zap,
  BookOpen,
  Shield,
  Hash,
} from "lucide-react";
import type { QuestResponse } from "@/lib/types";

const TYPE_THEMES: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Main:  { text: "text-[#ffc032]", bg: "bg-[#ffc032]/10",  border: "border-[#ffc032]/30",  glow: "shadow-[0_0_12px_rgba(255,192,50,0.25)]" },
  Side:  { text: "text-purple-300", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-[0_0_12px_rgba(168,85,247,0.2)]" },
  Daily: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-[0_0_12px_rgba(52,211,153,0.2)]" },
  Event: { text: "text-orange-400", bg: "bg-orange-500/10",  border: "border-orange-500/30",  glow: "shadow-[0_0_12px_rgba(251,146,60,0.2)]" },
};

const OBJECTIVE_THEMES: Record<string, { text: string; bg: string; icon: typeof Target }> = {
  Explore:   { text: "text-cyan-300",   bg: "bg-cyan-500/10",   icon: MapPin },
  Defeat:    { text: "text-red-400",    bg: "bg-red-500/10",    icon: Swords },
  Collect:   { text: "text-amber-300",  bg: "bg-amber-500/10",  icon: Package },
  Talk:      { text: "text-purple-300", bg: "bg-purple-500/10", icon: MessageSquare },
  OpenChest: { text: "text-yellow-300", bg: "bg-yellow-500/10", icon: Gift },
  Interact:  { text: "text-teal-300",   bg: "bg-teal-500/10",   icon: Zap },
};

// Renders the info row reusable UI component.
// Returns the styled JSX element.
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-xs font-semibold text-white/40 shrink-0 uppercase tracking-wider">{label}</span>
      <span className="text-xs font-semibold text-white/80 text-right">{value}</span>
    </div>
  );
}

// Renders the reward chip reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
function RewardChip({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof Star }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
}

interface QuestDetailPanelProps {
  quest: QuestResponse;
  onClose: () => void;
}

// Renders the quest detail panel reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
export default function QuestDetailPanel({ quest, onClose }: QuestDetailPanelProps) {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation

  const typeTheme = TYPE_THEMES[quest.type] ?? TYPE_THEMES.Main;
  // Helper function executing obj config.
  // Processes input parameters and returns the calculated result.
  const objConfig = OBJECTIVE_THEMES[quest.objectiveType] ?? { text: "text-white/70", bg: "bg-white/5", icon: Target };
  const ObjIcon = objConfig.icon;

  const hasItemRewards  = quest.rewardItems?.length > 0;
  const hasSkillRewards = quest.rewardSkills?.length > 0;
  const hasCurrencyRewards = quest.rewardExperience > 0 || quest.rewardGold > 0 || quest.rewardGems > 0;

  return (
    <div
      className={`rounded-2xl border bg-[#111111] overflow-hidden animate-in fade-in-0 slide-in-from-bottom-3 duration-200 ${typeTheme.border} ${typeTheme.glow}`}
      id={`quest-detail-${quest.questId}`}
    >
      <div className={`px-6 py-4 border-b ${typeTheme.border} bg-gradient-to-r from-white/[0.02] to-transparent`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest
                  ${typeTheme.bg} ${typeTheme.text} ${typeTheme.border}`}
              >
                <Scroll className="h-3 w-3" aria-hidden="true" />
                {quest.type} Quest
              </span>

              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold text-white/50">
                #{quest.questId}
              </span>

              {quest.isActive ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Inactive
                </span>
              )}

              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/40">
                Default: {quest.defaultStatus}
              </span>
            </div>

            <h2 className={`text-xl font-bold ${typeTheme.text}`}>{quest.title}</h2>

            {quest.description && (
              <p className="mt-2 text-sm leading-relaxed text-white/55 italic max-w-2xl">
                &ldquo;{quest.description}&rdquo;
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => router.push(`/manage-quests/update?id=${quest.questId}`)}  // Navigate to the next page and push to history stack
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#ffc032] px-3 text-xs font-bold text-[#111] transition-colors hover:bg-[#ffd04c]"
              aria-label="Edit quest"
            >
              <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-white/20 hover:text-white"
              aria-label="Close detail panel"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <MapPin className="h-4 w-4 text-[#ffc032]" aria-hidden="true" />
            World &amp; Location
          </div>
          <InfoRow label="Map" value={quest.mapName} />
          <InfoRow label="Region" value={quest.regionName || <span className="text-white/30 italic">Entire Region</span>} />
          <InfoRow label="Level Req." value={<span className="text-[#ffc032] font-black">Lv.{quest.requiredLevel}</span>} />
          {quest.questGiverName && (
            <InfoRow
              label="NPC Giver"
              value={
                <span className="flex items-center gap-1 text-purple-300">
                  <MessageSquare className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {quest.questGiverName}
                </span>
              }
            />
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <Target className="h-4 w-4 text-red-400" aria-hidden="true" />
            Objective
          </div>

          <div className={`mb-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold ${objConfig.bg} ${objConfig.text}`}>
            <ObjIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {quest.objectiveType}
          </div>

          <InfoRow
            label="Target"
            value={quest.objectiveTarget || quest.objectiveLocation || <span className="italic text-white/30">None specified</span>}
          />
          {quest.objectiveLocation && quest.objectiveTarget && (
            <InfoRow label="Location" value={quest.objectiveLocation} />
          )}
          <InfoRow
            label="Amount"
            value={
              <span className="font-mono text-sm font-black text-white">
                ×{quest.targetAmount}
              </span>
            }
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <BookOpen className="h-4 w-4 text-purple-400" aria-hidden="true" />
            Dialogue Link
          </div>

          {quest.dialogueId ? (
            <>
              <InfoRow label="Dialogue ID"  value={<span className="flex items-center gap-1"><Hash className="h-3 w-3 text-white/30" />{quest.dialogueId}</span>} />
              <InfoRow label="NPC"          value={quest.dialogueNpcName || <span className="italic text-white/30">Unknown</span>} />
              <InfoRow label="Order"        value={quest.dialogueDisplayOrder ?? "—"} />
              <InfoRow
                label="Status"
                value={
                  quest.dialogueIsActive
                    ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Active</span>
                    : <span className="text-red-400 flex items-center gap-1"><XCircle className="h-3 w-3" />Inactive</span>
                }
              />
              {quest.dialogueContent && (
                <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5 text-xs leading-relaxed text-white/50 italic">
                  &ldquo;{quest.dialogueContent}&rdquo;
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-white/30 italic">No dialogue linked to this quest.</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 md:col-span-2 xl:col-span-3">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
            <Gift className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Reward Breakdown
          </div>

          {!hasCurrencyRewards && !hasItemRewards && !hasSkillRewards ? (
            <p className="text-sm text-white/30 italic">No rewards configured.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {quest.rewardExperience > 0 && (
                <RewardChip icon={Star}>
                  {quest.rewardExperience.toLocaleString()} XP
                </RewardChip>
              )}
              {quest.rewardGold > 0 && (
                <RewardChip icon={Shield}>
                  {quest.rewardGold.toLocaleString()} Gold
                </RewardChip>
              )}
              {quest.rewardGems > 0 && (
                <RewardChip icon={Zap}>
                  {quest.rewardGems.toLocaleString()} Gems
                </RewardChip>
              )}

              {hasItemRewards
                ? quest.rewardItems.map((item) => (
                    <RewardChip key={item.questRewardItemId} icon={Package}>
                      {item.itemName || `Item #${item.itemId}`} ×{item.quantity}
                    </RewardChip>
                  ))
                : quest.rewardItemName && (
                    <RewardChip icon={Package}>
                      {quest.rewardItemName}
                    </RewardChip>
                  )}

              {hasSkillRewards
                ? quest.rewardSkills.map((sk) => (
                    <span
                      key={sk.questRewardSkillId}
                      className="inline-flex items-center gap-1.5 rounded border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300"
                    >
                      <Swords className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {sk.skillName || `Skill #${sk.skillId}`}
                      {sk.classRequirement && (
                        <span className="text-purple-400/60 font-normal">({sk.classRequirement})</span>
                      )}
                    </span>
                  ))
                : quest.rewardSkillName && (
                    <span className="inline-flex items-center gap-1.5 rounded border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-300">
                      <Swords className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {quest.rewardSkillName}
                    </span>
                  )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
