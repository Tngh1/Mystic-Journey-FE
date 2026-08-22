"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Sparkles, Swords } from "lucide-react";
import AdminTable from "@/components/ui/AdminTable";
import FilterSortBar from "@/components/ui/FilterSortBar";
import { usePagedQuery } from "@/lib/hooks/usePagedQuery";
import type { SkillResponse } from "@/lib/api/skills";
import { SkillArtwork } from "@/components/wiki/SkillLeaf";

const SKILL_TYPES = ["Active", "Passive", "Buff", "Debuff"];

// Renders the manage skills page view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
export default function ManageSkillsPage() {
  const router = useRouter();  // Initialize Next.js router for programmatic navigation
  const [search, setSearch] = useState("");
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: skills,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  } = usePagedQuery<SkillResponse>({ endpoint: "/api/skills", pageSize: 10 });

  // Renders the apply filters view component.
  // Returns the JSX element hierarchy for the page view.
  const applyFilters = (next: { search?: string; type?: string; status?: string }) => {
    const nextSearch = next.search ?? search;
    const nextType = next.type ?? type;
    const nextStatus = next.status ?? status;

    setPage(1);  // Reset to first page after filter/search change
    setParams({
      search: nextSearch || undefined,
      // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
      type: nextType || undefined,
      isActive: nextStatus === "" ? undefined : nextStatus === "true",
    });
  };

  const columns = [
    {
      key: "skillId",
      label: "Skill",
      render: (_: never, skill: SkillResponse) => (
        <div className="flex min-w-52 items-center gap-3">
          <SkillArtwork
            skill={skill}
            className="h-12 w-12 shrink-0 border-2 border-black/60 bg-iron-dark"
            iconSize={22}
          />
          <div>
            <p className="font-bold text-fg transition-colors group-hover:text-accent">
              {skill.name}
            </p>
            <p className="mt-0.5 text-xs text-fg-muted">ID #{skill.skillId}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: never) => (
        <span className="border-2 border-black/60 bg-iron px-2 py-1 text-xs font-bold text-parchment">
          {String(value)}
        </span>
      ),
    },
    { key: "classRequirement", label: "Class" },
    { key: "damageType", label: "Damage type" },
    {
      key: "baseDamage",
      label: "Base damage",
      render: (value: never) => (
        <span className="inline-flex items-center gap-1.5 tabular-nums text-parchment">
          <Swords className="h-4 w-4 text-accent" aria-hidden="true" />
          {Number(value).toLocaleString()}
        </span>
      ),
    },
    {
      key: "cooldownSeconds",
      label: "Cooldown",
      render: (value: never) => (
        <span className="inline-flex items-center gap-1.5 tabular-nums text-parchment">
          <Clock3 className="h-4 w-4 text-parchment-dim" aria-hidden="true" />
          {String(value)}s
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: never) => {
        const active = Boolean(value);
        return (
          <span
            className={`border-2 border-black/60 px-2 py-1 text-xs font-bold ${
              active
                ? "bg-heraldry-pine text-parchment"
                : "bg-heraldry-crimson text-parchment"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="pixel-bevel-gold flex h-14 w-14 shrink-0 items-center justify-center border-2 border-accent bg-accent text-on-accent">
            <Sparkles className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-fg">Manage Skills</h1>
            <p className="text-sm text-fg-muted">
              Edit combat values, class requirements and availability in-game.
            </p>
          </div>
        </div>
        <div className="border-2 border-black/60 bg-iron px-4 py-2 text-sm text-parchment shadow-sm">
          <span className="font-black tabular-nums text-accent">{totalCount}</span> skills
        </div>
      </header>

      <FilterSortBar
        search={{
          placeholder: "Search skill by name...",
          icon: Sparkles,
          value: search,
          onChange: (value) => {
            setSearch(value);
            applyFilters({ search: value });
          },
        }}
        filters={[
          {
            key: "type",
            label: "All Types",
            value: type,
            onChange: (value) => {
              setType(value);
              applyFilters({ type: value });
            },
            options: SKILL_TYPES.map((value) => ({ value, label: value })),
          },
          {
            key: "status",
            label: "All Statuses",
            value: status,
            onChange: (value) => {
              setStatus(value);
              applyFilters({ status: value });
            },
            options: [
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ],
          },
        ]}
      />

      <AdminTable
        title="Game Skills"
        columns={columns}
        data={skills}
        loading={loading}
        error={error}
        onRetry={refresh}
        emptyTitle="No skills found"
        emptyHint="Try changing the search text or filters."
        serverSide
        pagination={{ page, pageSize, totalCount, setPage, setPageSize }}
        onUpdate={(skill) => router.push(`/manage-skills/update?id=${skill.skillId}`)}  // Navigate to the next page and push to history stack
        idField="skillId"
      />
    </div>
  );
}
