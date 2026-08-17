import { get } from "./client";
import type { ItemResponse } from "./items";
import type { SkillResponse } from "./skills";
import type { ClassConfigResponse } from "./characters";
import type { MonsterResponse, MonsterDetailResponse, PagedResponse } from "@/lib/types";


export type { ItemResponse, SkillResponse, ClassConfigResponse, MonsterResponse, MonsterDetailResponse };


// Build query parameters from the supplied filters, omit unset values, and append the serialized query to the API endpoint.
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

// Fetches character class encyclopedic definitions and base scaling stats.
export async function getWikiClasses() {
  return get<ClassConfigResponse[]>("/api/wiki/classes"); // GET /api/wiki/classes
}

// Retrieves public bestiary monster encyclopedia entries with search and sort support.
export async function getWikiMonsters(params: WikiListParams = {}) {
  return get<PagedResponse<MonsterResponse>>(`/api/wiki/monsters?${query({ ...params })}`); // GET /api/wiki/monsters
}

// Fetches public bestiary detail card by monster ID.
export async function getWikiMonster(id: number) {
  return get<MonsterDetailResponse>(`/api/wiki/monsters/${id}`); // Query monster encyclopedia details
}

// Retrieves public items encyclopedia with rarity filter.
export async function getWikiItems(params: WikiListParams & { rarity?: string } = {}) {
  return get<PagedResponse<ItemResponse>>(`/api/wiki/items?${query({ ...params })}`); // GET /api/wiki/items
}

// Fetches single item card and lore from public encyclopedia.
export async function getWikiItem(id: number) {
  return get<ItemResponse>(`/api/wiki/items/${id}`); // Query item card
}

// Retrieves public skill compendium entries.
export async function getWikiSkills(params: Omit<WikiListParams, "sortBy" | "sortOrder"> = {}) {
  return get<PagedResponse<SkillResponse>>(`/api/wiki/skills?${query({ ...params })}`); // GET /api/wiki/skills
}

// Fetches detailed skill scaling ratios from public encyclopedia.
export async function getWikiSkill(id: number) {
  return get<SkillResponse>(`/api/wiki/skills/${id}`); // Query skill card
}
