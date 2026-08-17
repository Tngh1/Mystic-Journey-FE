import { get, put } from "./client";

export interface SkillResponse {
  skillId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  type: string;
  // Supported damage types: Physical, Magical, or TrueDamage; the value selects how skill damage is categorized and resolved.
  damageType: string;
  // Supported target types: SingleTarget, Area, Self, or Ally; the value determines who can receive the skill effect.
  targetType: string;
  // Supported class requirements: Knight, Archer, Mage, or All; All allows every player class to use the skill or reward.
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
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  type?: string;
  isActive?: boolean;
}

// Retrieves paginated list of skill definitions with filter parameters.
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

  if (search) query.set("search", search); // Search by skill name
  if (type) query.set("type", type); // Filter active/passive/buff
  if (isActive !== undefined) query.set("isActive", String(isActive)); // Filter active status

  const res = await get<{
    items: SkillResponse[];
    totalCount: number;
  }>(`/api/skills?${query.toString()}`); // GET /api/skills
  return res;
}

// Fetches single skill configuration by skill ID.
export async function getSkillById(id: number) {
  return get<SkillResponse>(`/api/skills/${id}`); // Query skill damage ratios and cooldowns
}

// Updates skill stats, scaling factors, or unlock levels.
export async function updateSkill(id: number, data: UpdateSkillRequest) {
  return put<SkillResponse>(`/api/skills/${id}`, data); // PUT /api/skills/{id}
}
