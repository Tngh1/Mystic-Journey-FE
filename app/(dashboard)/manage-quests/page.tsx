'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestResponse } from "@/lib/api/quests";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import {
  Activity,
  CheckCircle2,
  Gift,
  MapPin,
  MessageSquare,
  Plus,
  Scroll,
  Target,
  XCircle,
} from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";

const typeColors: Record<string, string> = {
  Main: "text-blue-400",
  Side: "text-purple-400",
  Daily: "text-green-400",
  Event: "text-orange-400",
};

const statusColors: Record<string, string> = {
  NotStarted: "text-gray-400",
  InProgress: "text-yellow-400",
  Completed: "text-green-400",
  Claimed: "text-blue-400",
  Failed: "text-red-400",
};

const objectiveColors: Record<string, string> = {
  Explore: "text-cyan-400",
  Defeat: "text-red-400",
  Collect: "text-amber-400",
  Talk: "text-purple-400",
  OpenChest: "text-yellow-400",
  Interact: "text-teal-400",
};

const QUEST_TYPES = [
  { value: "Main", label: "Main" },
  { value: "Side", label: "Side" },
  { value: "Daily", label: "Daily" },
  { value: "Event", label: "Event" },
];

const ACTIVE_FILTERS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const MAP_FILTERS = [
  { value: "ElfForest", label: "ElfForest" },
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

function getObjectiveText(quest: QuestResponse) {
  const target = quest.objectiveTarget || quest.objectiveLocation || "No target";
  const amount = quest.targetAmount > 1 ? ` x${quest.targetAmount}` : "";
  return `${quest.objectiveType}${amount} - ${target}`;
}

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
    quest.rewardExperience > 0 ? `${quest.rewardExperience} EXP` : "",
    quest.rewardGold > 0 ? `${quest.rewardGold} Gold` : "",
    quest.rewardGems > 0 ? `${quest.rewardGems} Gems` : "",
    ...itemRewards,
    ...skillRewards,
  ].filter(Boolean);

  return rewards.length > 0 ? rewards.join(" + ") : "No reward";
}

const columns = [
  { key: "questId", label: "ID", sortable: true },
  {
    key: "title",
    label: "Quest",
    sortable: true,
    render: (_val: string, row: QuestResponse) => (
      <div className="max-w-[360px]">
        <p className="truncate font-semibold text-white">{row.title}</p>
        <p className="mt-1 truncate text-xs text-white/45">
          {row.description || "No description"}
        </p>
      </div>
    ),
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    render: (val: string) => (
      <span className={`font-semibold ${typeColors[val] || "text-gray-300"}`}>{val}</span>
    ),
  },
  {
    key: "mapName",
    label: "World",
    sortable: true,
    render: (_val: string, row: QuestResponse) => (
      <div className="max-w-[220px]">
        <p className="truncate text-white/80">{row.mapName}</p>
        <p className="mt-1 truncate text-xs text-white/40">{row.regionName || "No region"}</p>
      </div>
    ),
  },
  {
    key: "questGiverName",
    label: "NPC",
    sortable: true,
    render: (_val: string | null, row: QuestResponse) => (
      <div className="max-w-[180px]">
        <p className="truncate text-white/80">{row.questGiverName || "Unassigned"}</p>
        <p className="mt-1 truncate text-xs text-purple-300/70">
          LinkedQuestId #{row.questId}
        </p>
      </div>
    ),
  },
  {
    key: "objectiveType",
    label: "Objective",
    sortable: true,
    render: (_val: string, row: QuestResponse) => (
      <div className="max-w-[240px]">
        <p className={`truncate text-xs font-semibold ${objectiveColors[row.objectiveType] || "text-gray-300"}`}>
          {getObjectiveText(row)}
        </p>
        <p className="mt-1 truncate text-xs text-white/40">
          {row.defaultStatus}
        </p>
      </div>
    ),
  },
  {
    key: "rewardExperience",
    label: "Rewards",
    sortable: true,
    render: (_val: number, row: QuestResponse) => (
      <span className="block max-w-[260px] truncate text-xs text-amber-300/90">
        {getRewardText(row)}
      </span>
    ),
  },
  {
    key: "requiredLevel",
    label: "Req",
    sortable: true,
    render: (val: number) => (
      <span className="text-xs font-semibold text-white/70">Lv. {val}</span>
    ),
  },
  {
    key: "isActive",
    label: "Active",
    sortable: true,
    render: (val: boolean) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${val ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
        {val ? "Active" : "Inactive"}
      </span>
    ),
  },
];

export default function ManageQuestsPage() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMap, setFilterMap] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("questId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedQuestId, setSelectedQuestId] = useState<number | null>(null);

  const buildParams = (overrides: Partial<QueryState> = {}) => {
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

  const selectedQuest = quests.find((quest) => quest.questId === selectedQuestId) ?? null;

  const summaryCards = useMemo(() => {
    const activeCount = quests.filter((quest) => quest.isActive).length;
    const mainCount = quests.filter((quest) => quest.type === "Main").length;
    const npcLinkedCount = quests.filter((quest) => quest.questGiverName).length;

    return [
      {
        label: "Total Results",
        value: totalCount,
        icon: Scroll,
        tone: "text-[#ffc032]",
        bg: "bg-[#ffc032]/10",
      },
      {
        label: "Active On Page",
        value: activeCount,
        icon: CheckCircle2,
        tone: "text-green-400",
        bg: "bg-green-500/10",
      },
      {
        label: "Main On Page",
        value: mainCount,
        icon: Target,
        tone: "text-blue-400",
        bg: "bg-blue-500/10",
      },
      {
        label: "NPC Linked",
        value: npcLinkedCount,
        icon: MessageSquare,
        tone: "text-purple-400",
        bg: "bg-purple-500/10",
      },
    ];
  }, [quests, totalCount]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setParams(buildParams({ search: value }));
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setPage(1);
    setParams(buildParams({ filterType: value }));
  };

  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value);
    setPage(1);
    setParams(buildParams({ filterStatus: value }));
  };

  const handleFilterMapChange = (value: string) => {
    setFilterMap(value);
    setPage(1);
    setParams(buildParams({ filterMap: value }));
  };

  const handleSortChange = (value: string) => {
    const nextOrder = sortBy === value && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(value);
    setSortOrder(nextOrder);
    setPage(1);
    setParams(buildParams({ sortBy: value, sortOrder: nextOrder }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#ffc032] to-[#ff8c00]">
            <Scroll className="h-7 w-7 text-[#111]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#ffc032]">Manage Quests</h1>
            <p className="text-sm text-gray-500">Tune quest flow, rewards, NPC giver, and objective routing.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/manage-quests/create")}
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
        search={{ placeholder: "Search title, target, NPC...", value: search, onChange: handleSearch }}
        filters={[
          {
            key: "type",
            label: "All Types",
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
            label: "All Maps",
            value: filterMap,
            onChange: handleFilterMapChange,
            options: MAP_FILTERS,
          },
        ]}
      />

      <AdminTable
        title="Quests"
        columns={columns}
        data={quests}
        loading={loading}
        error={error}
        onRetry={refresh}
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(quest) => router.push(`/manage-quests/update?id=${quest.questId}`)}
        onRowClick={(quest) => setSelectedQuestId(quest.questId)}
        selectedId={selectedQuestId}
        idField="questId"
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSortChange}
        emptyTitle="No quests found"
        emptyHint="Try another search, type, status, or map filter."
      />

      {selectedQuest && (
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${typeColors[selectedQuest.type] || "text-white/60"}`}>
                  {selectedQuest.type}
                </span>
                <span className={`text-xs font-semibold ${statusColors[selectedQuest.defaultStatus] || "text-white/50"}`}>
                  {selectedQuest.defaultStatus}
                </span>
                {selectedQuest.isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                    <XCircle className="h-3.5 w-3.5" />
                    Inactive
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">{selectedQuest.title}</h2>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-white/55">
                {selectedQuest.description || "No description"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push(`/manage-quests/update?id=${selectedQuest.questId}`)}
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-[#ffc032] px-4 text-sm font-semibold text-[#111] transition-colors hover:bg-[#ffd04c]"
            >
              Edit Quest
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                <MapPin className="h-4 w-4" />
                World
              </div>
              <p className="text-sm font-semibold text-white">{selectedQuest.mapName}</p>
              <p className="mt-1 text-xs text-white/45">{selectedQuest.regionName || "No region"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                <Target className="h-4 w-4" />
                Objective
              </div>
              <p className={`text-sm font-semibold ${objectiveColors[selectedQuest.objectiveType] || "text-white"}`}>
                {getObjectiveText(selectedQuest)}
              </p>
              <p className="mt-1 text-xs text-white/45">Required level {selectedQuest.requiredLevel}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                <Gift className="h-4 w-4" />
                Reward
              </div>
              <p className="text-sm font-semibold text-amber-300">{getRewardText(selectedQuest)}</p>
              <p className="mt-1 text-xs text-purple-300/70">
                NPCDialogue LinkedQuestId #{selectedQuest.questId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
