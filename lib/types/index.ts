/* ─── Shared / Common ─────────────────────────────────────────────────────── */

export interface PagedResponse<T> {
  totalCount: number;
  items: T[];
}

/* ─── Account / Auth ─────────────────────────────────────────────────────── */

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MeResponse {
  accountId: number;
  userName: string;
  email: string;
  role: string;
  playerProfileId: number | null;
  playerClass: string;
  level: number;
  lastMapName: string;
  positionX: number;
  positionY: number;
}

export interface LoginResponse {
  accountId: number;
  userName: string;
  emailAddress: string;
  role: string;
  roleId?: number;
  hasCharacter?: boolean;
  playerProfileId?: number;
  playerDisplayName?: string | null;
  playerClass?: string | null;
  level?: number;
  lastMapName?: string | null;
  positionX?: number;
  positionY?: number;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
}

export interface AccountAdminResponse {
  accountId: number;
  userName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string | null;
  playerProfileId: number | null;
  playerDisplayName: string | null;
}

export interface CreateAdminAccountRequest {
  userName: string;
  email: string;
  password: string;
  roleId: number;
  displayName?: string;
  playerClass?: string;
}

export interface UpdateAdminAccountRequest {
  fullName?: string;
  email?: string;
  roleId?: number;
  isActive?: boolean;
  newPassword?: string;
}

/* ─── Player ─────────────────────────────────────────────────────────────── */

export interface PlayerProfileResponse {
  playerProfileId: number;
  accountId: number;
  accountEmail: string | null;
  displayName: string;
  avatarUrl: string | null;
  playerClass: string;
  level: number;
  experiencePoints: number;
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  lastEnergyUpdateTime: string | null;
  corruptionLevel: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface PlayerStatsResponse {
  currentHp: number;
  maxHp: number;
  atk: number;
  def: number;
  moveSpeed: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  damageBonus: number;
  skillPoints: number;
  totalWins: number;
  totalLosses: number;
  totalKills: number;
  totalDeaths: number;
}

export interface PlayerProfileWithStats extends PlayerProfileResponse {
  stats: PlayerStatsResponse | null;
}

export interface CreatePlayerProfileRequest {
  accountId: number;
  displayName: string;
  avatarUrl?: string;
  class?: string;
}

export interface UpdatePlayerProfileRequest {
  displayName: string;
  avatarUrl: string;
  playerClass: string;
  level: number;
  experiencePoints: number;
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  corruptionLevel: number;
}

/* ─── Item ───────────────────────────────────────────────────────────────── */

export interface ItemResponse {
  itemId: number;
  name: string;
  description: string | null;
  type: string;
  rarity: string;
  slot: string;
  baseValue: number;
  corruptionReduction: number;
  maxStack: number;
  isActive: boolean;
  iconUrl: string | null;
  createdAt: string;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  bonusCritRate?: number;
  bonusCritDamage?: number;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  type?: string;
  rarity?: string;
  slot?: string;
  baseValue?: number;
  corruptionReduction?: number;
  maxStack?: number;
  isActive?: boolean;
  iconUrl?: string;
  baseHp?: number;
  baseAtk?: number;
  baseDef?: number;
  bonusHp?: number;
  bonusAtk?: number;
  bonusDef?: number;
  bonusCritRate?: number;
  bonusCritDamage?: number;
}

/* ─── Monster ────────────────────────────────────────────────────────────── */

export interface MonsterResponse {
  monsterId: number;
  name: string;
  type: string;
  description: string;
  level: number;
  maxHp: number;
  atk: number;
  def: number;
  moveSpeed: number;
  attackSpeed: number;
  critRate: number;
  critDamage: number;
  experienceReward: number;
  goldReward: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface MonsterDropResponse {
  monsterDropId: number;
  monsterId: number;
  itemId: number;
  itemName: string | null;
  dropRate: number;
  minQuantity: number;
  maxQuantity: number;
  isGuaranteed: boolean;
  isActive: boolean;
}

export interface MonsterDetailResponse extends MonsterResponse {
  monsterDrops: MonsterDropResponse[];
}

export interface UpdateMonsterRequest {
  name?: string;
  type?: string;
  description?: string;
  level?: number;
  maxHp?: number;
  atk?: number;
  def?: number;
  moveSpeed?: number;
  attackSpeed?: number;
  critRate?: number;
  critDamage?: number;
  experienceReward?: number;
  goldReward?: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface AddMonsterDropRequest {
  itemId: number;
  dropRate: number;
  minQuantity?: number;
  maxQuantity?: number;
  isGuaranteed?: boolean;
  isActive?: boolean;
}

export interface MonsterSpawnResponse {
  monsterSpawnId: number;
  monsterId: number;
  monsterName: string;
  monsterType: string;
  mapName: string;
  regionName?: string;
  location?: string;
  spawnCount: number;
  respawnSeconds: number;
  dungeonId?: number;
  dungeonName?: string;
  isDungeonRepeatable: boolean;
  isActive: boolean;
}

/* ─── Dungeon ────────────────────────────────────────────────────────────── */

export interface DungeonConfigResponse {
  dungeonConfigId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  type: string;
  levelRequirement: number;
  maxMembers: number;
  difficulty: number;
  recommendedPower: number;
  energyCost: number;
  chestId: number | null;
  isActive: boolean;
}

export interface UpdateDungeonConfigRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  type?: string;
  levelRequirement?: number;
  maxMembers?: number;
  difficulty?: number;
  recommendedPower?: number;
  energyCost?: number;
  chestId?: number;
  isActive?: boolean;
}

/* ─── Quest ──────────────────────────────────────────────────────────────── */

/* NPC */

export interface NPCResponse {
  npcId: number;
  name: string;
  description: string | null;
  type: string;
  mapName: string;
  positionX: number;
  positionY: number;
  interactionRadius: number;
  iconUrl: string | null;
  isActive: boolean;
}
export interface QuestRewardItemResponse {
  questRewardItemId: number;
  itemId: number;
  itemName: string | null;
  iconUrl: string | null;
  quantity: number;
}

export interface UpdateQuestRewardItemRequest {
  itemId: number;
  quantity: number;
}
export interface QuestRewardSkillResponse {
  questRewardSkillId: number;
  skillId: number;
  skillName: string | null;
  classRequirement: string | null;
  type: string | null;
  damageType: string | null;
}

export interface UpdateQuestRewardSkillRequest {
  skillId: number;
}

export interface QuestResponse {
  questId: number;
  title: string;
  description: string | null;
  type: string;
  defaultStatus: string;
  mapName: string;
  regionName: string | null;
  objectiveType: string;
  objectiveTarget: string | null;
  objectiveLocation: string | null;
  questGiverName: string | null;
  requiredLevel: number;
  targetAmount: number;
  rewardExperience: number;
  rewardGold: number;
  rewardGems: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardItems: QuestRewardItemResponse[];
  rewardSkillId: number | null;
  rewardSkillName: string | null;
  rewardSkills: QuestRewardSkillResponse[];
  dialogueId: number | null;
  dialogueNpcId: number | null;
  dialogueNpcName: string | null;
  dialogueContent: string | null;
  dialogueDisplayOrder: number | null;
  dialogueIsActive: boolean | null;
  isActive: boolean;
}

export interface UpdateQuestRequest {
  title?: string;
  description?: string | null;
  type?: string;
  defaultStatus?: string;
  mapName?: string;
  regionName?: string | null;
  objectiveType?: string;
  objectiveTarget?: string | null;
  objectiveLocation?: string | null;
  questGiverName?: string | null;
  requiredLevel?: number;
  targetAmount?: number;
  rewardExperience?: number;
  rewardGold?: number;
  rewardGems?: number;
  rewardItemId?: number | null;
  rewardItems?: UpdateQuestRewardItemRequest[];
  rewardSkillId?: number | null;
  rewardSkills?: UpdateQuestRewardSkillRequest[];
  syncDialogue?: boolean;
  dialogueContent?: string | null;
  dialogueDisplayOrder?: number | null;
  dialogueIsActive?: boolean | null;
  isActive?: boolean;
}

/* ─── Achievement ───────────────────────────────────────────────────────── */

export interface AchievementResponse {
  achievementId: number;
  name: string;
  description: string | null;
  type: string;
  iconUrl: string | null;
  requiredValue: number;
  isActive: boolean;
  createdAt: string;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardQuantity: number;
  rewardGold: number;
  rewardGem: number;
  point: number;
}

export interface UpdateAchievementRequest {
  name?: string;
  description?: string;
  type?: string;
  iconUrl?: string | null;
  requiredValue?: number;
  isActive?: boolean;
  rewardItemId?: number | null;
  rewardQuantity?: number;
  rewardGold?: number;
  rewardGem?: number;
  point?: number;
}

/* ─── Shop ───────────────────────────────────────────────────────────────── */

export interface ShopItemResponse {
  shopItemId: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  itemType: string | null;
  shopSection: string;
  currency: string;
  price: number;
  stock: number;
  dailyPurchaseLimit: number;
  weeklyPurchaseLimit: number;
  isActive: boolean;
  availableFrom: string | null;
  availableTo: string | null;
}

export interface CreateShopItemRequest {
  itemId: number;
  shopSection?: string;
  currency?: string;
  price?: number;
  stock?: number;
  dailyPurchaseLimit?: number;
  weeklyPurchaseLimit?: number;
  isActive?: boolean;
  availableFrom?: string | null;
  availableTo?: string | null;
}

export type UpdateShopItemRequest = Partial<CreateShopItemRequest>;
/* ─── Gacha ──────────────────────────────────────────────────────────────── */

export interface GachaBannerResponse {
  gachaBannerId: number;
  name: string;
  type: string;
  pullCost: number;
  pityLimit: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

export interface GachaBannerItemResponse {
  gachaBannerItemId: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  itemRarity: string | null;
  dropRate: number;
  isFeatured: boolean;
}

export interface GachaBannerDetailResponse extends GachaBannerResponse {
  bannerItems: GachaBannerItemResponse[];
}

export interface UpdateGachaBannerRequest {
  name?: string;
  type?: string;
  pullCost?: number;
  pityLimit?: number;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}

export interface AddGachaBannerItemRequest {
  itemId: number;
  dropRate: number;
  isFeatured?: boolean;
}

export interface CreateGachaBannerRequest {
  name: string;
  type: string;
  pullCost: number;
  pityLimit: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
}

export interface GachaPullHistoryResponse {
  gachaPullHistoryId: number;
  playerProfileId: number;
  gachaBannerId: number;
  bannerName: string | null;
  rewardItemId: number;
  rewardItemName: string | null;
  rewardItemIconUrl: string | null;
  rewardItemRarity: string | null;
  pullCount: number;
  costSpent: number;
  pulledAt: string;
}

export interface PlayerGachaStatsResponse {
  playerProfileId: number;
  playerName: string;
  accountId: number;
  totalPulls: number;
  totalCost: number;
  legendaryPulls: number;
  actualLegendaryRate: number;
  systemLegendaryRate: number;
}

/* ─── Mail ───────────────────────────────────────────────────────────────── */

export interface MailRewardItemResponse {
  itemId: number;
  itemName: string | null;
  iconUrl: string | null;
  quantity: number;
}

export interface MailResponse {
  mailId: number;
  playerProfileId: number;
  playerName: string | null;
  title: string;
  content: string;
  type: string;
  attachedGold: number;
  attachedGems: number;
  attachedItems: MailRewardItemResponse[];
  isRead: boolean;
  isClaimed: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
}

export interface SendMailRewardItem {
  itemId: number;
  quantity: number;
}

export interface SendMailByListIdRequest {
  playerProfileIds: number[];
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItems?: SendMailRewardItem[];
  expiredAt?: string;
}

export interface SendMailToAllRequest {
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItems?: SendMailRewardItem[];
  expiredAt?: string;
}

/* ─── Content / CMS ─────────────────────────────────────────────────────── */

export interface ContentResponse {
  contentId: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnailUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  isPublished: boolean;
  createdByName: string;
  createdAt: string;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface BlockResponse {
  blockContentId: number;
  contentId: number;
  contentData: string | null;
  mediaUrl: string | null;
  caption: string | null;
  blockType: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ContentDetailResponse extends ContentResponse {
  blocks: BlockResponse[];
}

export interface CategoryResponse {
  categoryContentId: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateContentRequest {
  title: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId?: number;
  isPublished?: boolean;
}

export type UpdateContentRequest = CreateContentRequest;

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
}

export interface CreateBlockRequest {
  contentId: number;
  contentData?: string;
  mediaUrl?: string;
  caption?: string;
  blockType?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateBlockRequest = Partial<CreateBlockRequest>;

export interface CreateContentWithBlocksRequest {
  title: string;
  summary?: string;
  thumbnailUrl?: string;
  categoryId?: number;
  isPublished?: boolean;
  blocks: CreateContentBlockItem[];
}

export interface CreateContentBlockItem {
  contentData?: string;
  mediaUrl?: string;
  caption?: string;
  blockType?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

export interface MonthlyStat {
  month: string;
  count: number;
  amount: number;
}

export interface DashboardStatsResponse {
  totalPlayers: number;
  totalAccounts: number;
  totalItems: number;
  totalMonsters: number;
  totalTransactions: number;
  totalRevenue: number;
  monthlyStats: MonthlyStat[];
}

/* ─── Purchase / Sale ─────────────────────────────────────────────────────── */

export interface PurchaseHistoryResponse {
  purchaseHistoryId: number;
  playerProfileId: number;
  playerName: string | null;
  shopItemId: number;
  itemName: string | null;
  itemIconUrl?: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  purchasedAt: string;
}

/* ─── Game Config ────────────────────────────────────────────────────────── */

export interface DailyLoginRewardResponse {
  dailyLoginRewardId: number;
  dayNumber: number;
  month: number | null;
  year: number | null;
  isDefault: boolean;
  rewardType: string;
  rewardValue: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardItemQuantity: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDailyLoginRewardRequest {
  dayNumber: number;
  month?: number | null;
  year?: number | null;
  rewardType?: string;
  rewardValue?: number;
  rewardItemId?: number;
  rewardItemQuantity: number;
  isActive?: boolean;
}

export interface UpdateDailyLoginRewardRequest {
  rewardType: string;
  rewardValue: number;
  rewardItemId?: number | null;
  rewardItemQuantity: number;
  isActive: boolean;
}

/* ─── Cloudinary ─────────────────────────────────────────────────────────── */

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

/* ─── Inventory ───────────────────────────────────────────────────────────── */

export interface InventoryItemResponse {
  inventoryItemId: number;
  playerProfileId: number;
  itemId: number;
  itemName: string;
  itemDescription: string | null;
  itemType: string;
  itemRarity: string;
  itemSlot: string | null;
  iconUrl: string | null;
  corruptionReduction: number;
  quantity: number;
  isEquipped: boolean;
  isSkin: boolean;
  equippedSlot: string | null;
  enhancementLevel: number;
  createdAt: string;
}

export interface PlayerSkinSummaryResponse {
  playerSkinId: number;
  skinId: number;
  skinName: string;
  skinDescription: string | null;
  skinType: string;
  skinRarity: string;
  iconUrl: string | null;
  previewUrl: string | null;
  isEquipped: boolean;
}

export interface InventorySummaryResponse {
  totalItems: number;
  totalSkins: number;
  equippedItems: InventoryItemResponse[];
  bagItems: InventoryItemResponse[];
  bagCapacity: number;
  playerSkins: PlayerSkinSummaryResponse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}
