import { get } from "./client";
import type { ItemResponse } from "./items";
import type { SkillResponse } from "./skills";
import type { ClassConfigResponse } from "./characters";
import type { MonsterResponse, MonsterDetailResponse, PagedResponse } from "@/lib/types";

/* The public codex client — every call here hits `WikiController`
   (`/api/wiki/*`), which is `[AllowAnonymous]` end to end. A visitor who has
   never logged in must be able to read the wiki, so the wiki pages must not
   touch the `/api/items`, `/api/skills`, `/api/monsters` or `/api/characters`
   routes: those are the dashboard's, and they now require Admin/SuperAdmin.

   Only two shapes exist, matching the sequence diagram: a paged List and a
   Detail by id. The BE pins `isActive: true` on every list, so there is no
   `isActive` parameter to pass — drafts are never public. */

export type { ItemResponse, SkillResponse, ClassConfigResponse, MonsterResponse, MonsterDetailResponse };

/** Shared query builder. Empty values are dropped rather than sent blank, so
 *  the BE's `string.IsNullOrEmpty` filter checks behave as intended. */
function query(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  return qs.toString();
}

export interface WikiListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Classes ──────────────────────────────────────────────────────────
// Unpaged: there are three classes, and the stat ceilings are computed across
// the whole set (see lib/hooks/useClassConfigs).
export async function getWikiClasses() {
  return get<ClassConfigResponse[]>("/api/wiki/classes");
}

// ── Monsters ─────────────────────────────────────────────────────────
export async function getWikiMonsters(params: WikiListParams = {}) {
  return get<PagedResponse<MonsterResponse>>(`/api/wiki/monsters?${query({ ...params })}`);
}

export async function getWikiMonster(id: number) {
  return get<MonsterDetailResponse>(`/api/wiki/monsters/${id}`);
}

// ── Items ────────────────────────────────────────────────────────────
export async function getWikiItems(params: WikiListParams & { rarity?: string } = {}) {
  return get<PagedResponse<ItemResponse>>(`/api/wiki/items?${query({ ...params })}`);
}

export async function getWikiItem(id: number) {
  return get<ItemResponse>(`/api/wiki/items/${id}`);
}

// ── Skills ───────────────────────────────────────────────────────────
// No sortBy/sortOrder: WikiRepository.GetSkillsPaged always orders by
// UnlockLevel then Name (the unlock path a codex reads by), so there is
// nothing to pass. Any other order the page needs is applied client-side.
export async function getWikiSkills(params: Omit<WikiListParams, "sortBy" | "sortOrder"> = {}) {
  return get<PagedResponse<SkillResponse>>(`/api/wiki/skills?${query({ ...params })}`);
}

export async function getWikiSkill(id: number) {
  return get<SkillResponse>(`/api/wiki/skills/${id}`);
}
