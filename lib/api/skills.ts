import { del, get, post, put } from "./client";

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
  isActive: boolean;
}

export async function getSkills(page = 1, pageSize = 50) {
  const res = await get<{
    items: SkillResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
  }>(`/api/skills?page=${page}&pageSize=${pageSize}`);
  return res;
}

export async function getSkillById(id: number) {
  return get<SkillResponse>(`/api/skills/${id}`);
}

export async function createSkill(data: Partial<SkillResponse>) {
  return post<SkillResponse>("/api/skills", data);
}

export async function updateSkill(id: number, data: Partial<SkillResponse>) {
  return put<SkillResponse>(`/api/skills/${id}`, data);
}

export async function deleteSkill(id: number) {
  return del<void>(`/api/skills/${id}`);
}
