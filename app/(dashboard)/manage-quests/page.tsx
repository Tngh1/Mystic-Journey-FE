"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quests";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import {
  Activity,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Plus,
  Scroll,
  Target,
} from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";
import QuestDetailPanel from "./_components/QuestDetailPanel";

const TYPE_THEMES: Record<string, { text: string; bg: string; border: string }> = {
  Main: { text: "text-[#ffc032]", bg: "bg-[#ffc032]/10", border: "border-[#ffc032]/30" },
  Side: { text: "text-purple-300", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  Daily: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  Event: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
};

const OBJECTIVE_THEMES: Record<string, { text: string; bg: string }> = {
  Explore: { text: "text-cyan-300", bg: "bg-cyan-500/10" },
  Defeat: { text: "text-red-400", bg: "bg-red-500/10" },
  Collect: { text: "text-amber-300", bg: "bg-amber-500/10" },
  Talk: { text: "text-purple-300", bg: "bg-purple-500/10" },
  OpenChest: { text: "text-yellow-300", bg: "bg-yellow-500/10" },
  Interact: { text: "text-teal-300", bg: "bg-teal-500/10" },
};

const QUEST_TYPES = [
  { value: "Main", label: "Main Story" },
  { value: "Side", label: "Side Quest" },
  { value: "Daily", label: "Daily Quest" },
  { value: "Event", label: "Event Quest" },
];

const ACTIVE_FILTERS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const MAP_FILTERS = [
  { value: "ElfForest", label: "ElfForest" },
  { value: "AutumnPumpkin", label: "AutumnPumpkin" },
  { value: "AutumnTown", label: "AutumnTown" },
  { value: "FrozenMountain", label: "FrozenMountain" },
  { value: "AbandonedCastle", label: "AbandonedCastle" },
];

type QueryState = {
  search: string;
  filterType: string;
  filterStatus: string;
  filterMap: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

// Renders the get objective text view component.
// Returns the JSX element hierarchy for the page view.
function getObjectiveText(quest: QuestResponse) {
  const target = quest.objectiveTarget || quest.objectiveLocation || "No target";
  // Renders the amount view component.
  // Returns the JSX element hierarchy for the page view.
  const amount = quest.targetAmount > 1 ? ` x${quest.targetAmount}` : "";
  return `${quest.objectiveType}${amount} — ${target}`;
}

// Renders the get reward text view component.
// Returns the JSX element hierarchy for the page view.
function getRewardText(quest: QuestResponse) {
  const itemRewards = quest.rewardItems?.length
    ? quest.rewardItems.map((item) => `${item.itemName || `Item #${item.itemId}`} x${item.quantity}`)
    : [quest.rewardItemName || (quest.rewardItemId ? `Item #${quest.rewardItemId}` : "")].filter(Boolean);

  const skillRewards = quest.rewardSkills?.length
    ? quest.rewardSkills.map(
        (skill) => `${skill.skillName || `Skill #${skill.skillId}`}${skill.classRequirement ? ` - ${skill.classRequirement}` : ""}`,
      )
    : [quest.rewardSkillName || (quest.rewardSkillId ? `Skill #${quest.rewardSkillId}` : "")].filter(Boolean);

  const rewards = [
    quest.rewardExperience > 0 ? `${quest.rewardExperience} XP` : "",
    quest.rewardGold > 0 ? `${quest.rewardGold} Gold` : "",
    quest.rewardGems > 0 ? `${quest.rewardGems} Gems` : "",
    ...itemRewards,
    ...skillRewards,
  ].filter(Boolean);

  return rewards.length > 0 ? rewards.join(" + ") : "No reward";
}

// Renders the manage quests page view component.
// Key functionality: manages local UI state, pagination, and filter values; fetches asynchronous page data on initial load and parameter changes.
// Returns the JSX element hierarchy for the page view.
export default function ManageQuestsPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const detailRef = useRef<HTMLDivElement>(null);

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMap, setFilterMap] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("questId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);

  // Synchronize the derived component state whenever this effect's dependency values change.
  useEffect(() => {
    if (selectedQuestId !== null && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedQuestId]);

  // Renders the build params view component.
  // Returns the JSX element hierarchy for the page view.
  const buildParams = (overrides: Partial<QueryState> = {}) => {
    // Renders the next view component.
    // Returns the JSX element hierarchy for the page view.
    const next = {
      search,
      filterType,
      filterStatus,
      filterMap,
      sortBy,
      sortOrder,
      ...overrides,
    };

    return {
      ...(next.search ? { search: next.search } : {}),
      ...(next.filterType ? { type: next.filterType } : {}),
      ...(next.filterStatus ? { isActive: next.filterStatus === "active" } : {}),
      ...(next.filterMap ? { mapName: next.filterMap } : {}),
      sortBy: next.sortBy,
      sortOrder: next.sortOrder,
    };
  };

  const {
    data: quests,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<QuestResponse>({
    endpoint: "/api/quests",
    pageSize: 10,
    params: buildParams(),
  });

  // Renders the selected quest view component.
  // Returns the JSX element hierarchy for the page view.
  const selectedQuest = quests.find((quest) => quest.questId === selectedQuestId) ?? null;

  // Renders the summary cards view component.
  // Returns the JSX element hierarchy for the page view.
  const summaryCards = useMemo(() => {
    // Renders the active count view component.
    // Returns the JSX element hierarchy for the page view.
    const activeCount = quests.filter((quest) => quest.isActive).length;
    // Renders the main count view component.
    // Returns the JSX element hierarchy for the page view.
    const mainCount = quests.filter((quest) => quest.type === "Main").length;
    // Renders the npc linked count view component.
    // Returns the JSX element hierarchy for the page view.
    const npcLinkedCount = quests.filter((quest) => quest.questGiverName).length;

    return [
      {
        label: "Total Quests",
        value: totalCount,
        icon: Scroll,
        tone: "text-[#ffc032]",
        bg: "bg-[#ffc032]/10",
      },
      {
        label: "Active On Page",
        value: activeCount,
        icon: CheckCircle2,
        tone: "text-emerald-400",
        bg: "bg-emerald-500/10",
      },
      {
        label: "Main Story",
        value: mainCount,
        icon: Target,
        tone: "text-sky-400",
        bg: "bg-sky-500/10",
      },
      {
        label: "NPC Giver Linked",
        value: npcLinkedCount,
        icon: MessageSquare,
        tone: "text-purple-400",
        bg: "bg-purple-500/10",
      },
    ];
  }, [quests, totalCount]);

  // Renders the handle search view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ search: value }));
  };

  // Renders the handle filter type change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ filterType: value }));
  };

  // Renders the handle filter status change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ filterStatus: value }));
  };

  // Renders the handle filter map change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleFilterMapChange = (value: string) => {
    setFilterMap(value);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ filterMap: value }));
  };

  // Renders the handle sort change view component.
  // Returns the JSX element hierarchy for the page view.
  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);  // Reset to first page after filter/search change
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  const columns = [
    { key: "questId", label: "ID", sortable: true },
    {
      key: "title",
      label: "Quest Title & Flow",
      sortable: true,
      render: (_val: string, row: QuestResponse) => (
        <div className="max-w-[360px]">
          <p className="truncate font-bold text-white group-hover:text-[#ffc032] transition-colors">{row.title}</p>
          <p className="mt-1 truncate text-xs text-white/45">
            {row.description || "No journal story prompt"}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Category",
      sortable: true,
      render: (val: string) => {
        const theme = TYPE_THEMES[val] || TYPE_THEMES.Main;
        return (
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${theme.bg} ${theme.text} ${theme.border}`}>
            {val}
          </span>
        );
      },
    },
    {
      key: "mapName",
      label: "Map Location",
      sortable: true,
      render: (_val: string, row: QuestResponse) => (
        <div className="max-w-[200px]">
          <p className="truncate text-xs font-bold text-white/80 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#ffc032]" />
            {row.mapName}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-white/40">{row.regionName || "Entire Region"}</p>
        </div>
      ),
    },
    {
      key: "questGiverName",
      label: "NPC Giver",
      sortable: true,
      render: (_val: string | null, row: QuestResponse) => (
        <div className="max-w-[160px]">
          <p className="truncate text-xs font-semibold text-purple-200">{row.questGiverName || "System Auto"}</p>
          <p className="mt-0.5 text-[10px] text-white/40">LinkedQuest #{row.questId}</p>
        </div>
      ),
    },
    {
      key: "objectiveType",
      label: "Objective Target",
      sortable: true,
      render: (_val: string, row: QuestResponse) => {
        // Renders the obj theme view component.
        // Returns the JSX element hierarchy for the page view.
        const objTheme = OBJECTIVE_THEMES[row.objectiveType] || { text: "text-white", bg: "bg-white/5" };
        return (
          <div className="max-w-[220px]">
            <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ${objTheme.bg} ${objTheme.text}`}>
              {getObjectiveText(row)}
            </span>
          </div>
        );
      },
    },
    {
      key: "rewardExperience",
      label: "Rewards",
      sortable: true,
      render: (_val: number, row: QuestResponse) => (
        <span className="block max-w-[240px] truncate font-mono text-xs font-semibold text-emerald-300">
          {getRewardText(row)}
        </span>
      ),
    },
    {
      key: "requiredLevel",
      label: "Level",
      sortable: true,
      render: (val: number) => (
        <span className="text-xs font-bold text-white/70">Lv.{val}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (val: boolean) => (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${val ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ffc032] to-[#ff8c00]">
            <Scroll className="h-7 w-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Quests & Story Flow</h1>
            <p className="text-sm text-white/45">Configure main story lines, NPC dialogue links, objectives, and quest rewards.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/manage-quests/create")}  // Navigate to the next page and push to history stack
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#ffc032] px-4 text-sm font-semibold text-[#111] transition-colors hover:bg-[#ffd04c]"
          >
            <Plus className="h-4 w-4" />
            Create Quest
          </button>

          <button
            type="button"
            onClick={refresh}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111] px-4 text-sm font-semibold text-white/70 transition-colors hover:border-[#ffc032]/40 hover:text-[#ffc032]"
          >
            <Activity className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-[#111111] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{card.label}</p>
                  <p className="mt-2 text-2xl font-black text-white">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FilterSortBar
        search={{ placeholder: "Search quest title, target, NPC...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Categories",
            value: filterType,
            onChange: handleFilterTypeChange,
            options: QUEST_TYPES,
          },
          {
            key: "status",
            label: "All Status",
            value: filterStatus,
            onChange: handleFilterStatusChange,
            options: ACTIVE_FILTERS,
          },
          {
            key: "map",
            label: "All Worlds",
            value: filterMap,
            onChange: handleFilterMapChange,
            options: MAP_FILTERS,
          },
        ]}
      />

      <AdminTable
        title="Quests List"
        columns={columns}
        data={quests}
        loading={loading}
        error={error}
        onRetry={refresh}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(quest) => router.push(`/manage-quests/update?id=${quest.questId}`)}  // Navigate to the next page and push to history stack
        onRowClick={(quest) => setSelectedQuestId(quest.questId)}
        selectedId={selectedQuestId}
        idField="questId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
        emptyTitle="No quests found"
        emptyHint="Try another search term or filter."
      />

      {selectedQuest && (
        <div ref={detailRef} className="scroll-mt-6">
          <QuestDetailPanel
            quest={selectedQuest}
            onClose={() => setSelectedQuestId(null)}
          />
        </div>
      )}
    </div>
  );
}
