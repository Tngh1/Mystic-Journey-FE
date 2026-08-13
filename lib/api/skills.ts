import { get, put } from "./client";

export interface SkillResponse {
  skillId: number;
  name: string;
  description: string | null;
  type: string;
  damageType: string;
  targetType: string;
  classRequirement: string;
  cooldownSeconds: number;
  baseDamage: number;
  damagePerLevel: number;
  damageGrowthPercent: number;
  unlockLevel: number;
  corruptionCost: number;
  isActive: boolean;
}

export type UpdateSkillRequest = Omit<SkillResponse, "skillId">;

export interface SkillListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  isActive?: boolean;
}

export async function getSkills({
  page = 1,
  pageSize = 50,
  search,
  type,
  isActive,
}: SkillListParams = {}) {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search) query.set("search", search);
  if (type) query.set("type", type);
  if (isActive !== undefined) query.set("isActive", String(isActive));

  const res = await get<{
    items: SkillResponse[];
    totalCount: number;
  }>(`/api/skills?${query.toString()}`);
  return res;
}

export async function getSkillById(id: number) {
  return get<SkillResponse>(`/api/skills/${id}`);
}

export async function updateSkill(id: number, data: UpdateSkillRequest) {
  return put<SkillResponse>(`/api/skills/${id}`, data);
}
