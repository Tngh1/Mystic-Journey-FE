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
  lastMapName: string;
  positionX: number;
  positionY: number;
}

export interface AccountResponse {
  accountId: number;
  userName: string;
  emailAddress: string;
  roleId: number;
  role: string;
  isActive: boolean;
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
  isActive?: boolean;
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
  createdAt: string;
  updatedAt: string | null;
  isBanned: boolean;
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
  isBanned: boolean;
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

export interface CreateItemRequest {
  name: string;
  description?: string;
  type?: string;
  rarity?: string;
  slot?: string;
  baseValue?: number;
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

export type UpdateItemRequest = Partial<CreateItemRequest>;

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

export interface CreateMonsterRequest {
  name: string;
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

export type UpdateMonsterRequest = Partial<CreateMonsterRequest>;

export interface AddMonsterDropRequest {
  itemId: number;
  dropRate: number;
  minQuantity?: number;
  maxQuantity?: number;
  isGuaranteed?: boolean;
  isActive?: boolean;
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
  chestId: number | null;
  isActive: boolean;
}

export interface CreateDungeonConfigRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  type?: string;
  levelRequirement?: number;
  maxMembers?: number;
  difficulty?: number;
  recommendedPower?: number;
  chestId?: number;
  isActive?: boolean;
}

export type UpdateDungeonConfigRequest = CreateDungeonConfigRequest;

/* ─── Quest ──────────────────────────────────────────────────────────────── */

export interface QuestResponse {
  questId: number;
  title: string;
  description: string | null;
  type: string;
  defaultStatus: string;
  requiredLevel: number;
  rewardExperience: number;
  rewardGold: number;
  rewardGems: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  isActive: boolean;
}

export interface CreateQuestRequest {
  title: string;
  description?: string;
  type?: string;
  defaultStatus?: string;
  requiredLevel?: number;
  rewardExperience?: number;
  rewardGold?: number;
  rewardGems?: number;
  rewardItemId?: number | null;
  isActive?: boolean;
}

export type UpdateQuestRequest = CreateQuestRequest;

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
}

export interface CreateAchievementRequest {
  name: string;
  description?: string;
  type?: string;
  iconUrl?: string | null;
  requiredValue?: number;
  isActive?: boolean;
  rewardItemId?: number | null;
  rewardQuantity?: number;
  rewardGold?: number;
  rewardGem?: number;
}

export type UpdateAchievementRequest = CreateAchievementRequest;

/* ─── Shop ───────────────────────────────────────────────────────────────── */

export interface ShopItemResponse {
  shopItemId: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  itemType: string | null;
  currency: string;
  price: number;
  stock: number;
  dailyPurchaseLimit: number;
  isActive: boolean;
  availableFrom: string | null;
  availableTo: string | null;
}

export interface CreateShopItemRequest {
  itemId: number;
  currency?: string;
  price?: number;
  stock?: number;
  dailyPurchaseLimit?: number;
  isActive?: boolean;
  availableFrom?: string;
  availableTo?: string;
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

export interface CreateGachaBannerRequest {
  name: string;
  type?: string;
  pullCost?: number;
  pityLimit?: number;
  isActive?: boolean;
  startAt: string;
  endAt: string;
}

export type UpdateGachaBannerRequest = CreateGachaBannerRequest;

export interface AddGachaBannerItemRequest {
  itemId: number;
  dropRate: number;
  isFeatured?: boolean;
}

/* ─── Mail ───────────────────────────────────────────────────────────────── */

export interface MailResponse {
  mailId: number;
  playerProfileId: number;
  playerName: string | null;
  title: string;
  content: string;
  type: string;
  attachedGold: number;
  attachedGems: number;
  attachedItemId: number | null;
  attachedItemName: string | null;
  attachedItemQuantity: number;
  isRead: boolean;
  isClaimed: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
}

export interface SendMailByListIdRequest {
  playerProfileIds: number[];
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItemId?: number;
  attachedItemQuantity?: number;
  expiredAt?: string;
}

export interface SendMailToAllRequest {
  title: string;
  content: string;
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItemId?: number;
  attachedItemQuantity?: number;
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
  title: string;
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
  title: string;
  contentId: number;
  contentData?: string;
  mediaUrl?: string;
  caption?: string;
  blockType?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateBlockRequest = Partial<CreateBlockRequest>;

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
  quantity: number;
  totalPrice: number;
  currency: string;
  purchasedAt: string;
}

export interface SaleResponse {
  id: number;
  playerProfileId: number;
  playerName: string | null;
  saleDate: string;
  totalAmount: number;
  saleItems: SaleItemResponse[];
}

export interface SaleItemResponse {
  id: number;
  saleId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

/* ─── Game Config ────────────────────────────────────────────────────────── */

export interface GameSettingResponse {
  gameSettingId: number;
  key: string;
  value: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface UpdateGameSettingRequest {
  value?: string;
  description?: string;
  isActive?: boolean;
}

export interface DailyLoginRewardResponse {
  dailyLoginRewardId: number;
  dayNumber: number;
  rewardType: string;
  rewardValue: number;
  rewardItemId: number | null;
  rewardItemName: string | null;
  rewardItemQuantity: number;
  isActive: boolean;
}

export interface CreateDailyLoginRewardRequest {
  dayNumber: number;
  rewardType?: string;
  rewardValue?: number;
  rewardItemId?: number;
  rewardItemQuantity?: number;
  isActive?: boolean;
}

/* ─── Cloudinary ─────────────────────────────────────────────────────────── */

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}
