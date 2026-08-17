
export interface PagedResponse<T> {
  totalCount: number;
  items: T[];
}


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
  // Supported account roles: Player or Admin; the role determines authorization and access to management APIs.
  role: string;
  playerProfileId: number | null;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
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
  // Supported account roles: Player or Admin; the role determines authorization and access to management APIs.
  role: string;
  roleId?: number;
  hasCharacter?: boolean;
  playerProfileId?: number;
  playerDisplayName?: string | null;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
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
  // Supported account roles: Player or Admin; the role determines authorization and access to management APIs.
  roleName: string;
  isActive: boolean;
  banReason: string | null;
  createdAt: string;
  playerProfileId: number | null;
  playerDisplayName: string | null;
}



export interface PlayerProfileResponse {
  playerProfileId: number;
  accountId: number;
  accountEmail: string | null;
  displayName: string;
  avatarUrl: string | null;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
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
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  class?: string;
}

export interface UpdatePlayerProfileRequest {
  displayName: string;
  avatarUrl: string;
  // Supported player classes: Knight, Archer, or Mage; the class selects base stats, compatible skills, skins, and combat scaling.
  playerClass: string;
  level: number;
  experiencePoints: number;
  gold: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  corruptionLevel: number;
}


export interface ItemResponse {
  itemId: number;
  name: string;
  description: string | null;
  // Supported item types: Weapon, Armor, Consumable, Material, QuestItem, or Currency; the type controls filtering, stacking, and usage behavior.
  type: string;
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
  rarity: string;
  // Supported equipment slots: None, Weapon, Armor, Helmet, Gloves, Boots, Ring, Necklace, or Shield.
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
  // Supported item types: Weapon, Armor, Consumable, Material, QuestItem, or Currency; the type controls filtering, stacking, and usage behavior.
  type?: string;
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
  rarity?: string;
  // Supported equipment slots: None, Weapon, Armor, Helmet, Gloves, Boots, Ring, Necklace, or Shield.
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


export interface MonsterResponse {
  monsterId: number;
  name: string;
  // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
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
  // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
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
  // Supported monster types: Normal, Elite, or Boss; the type controls presentation and encounter behavior.
  monsterType: string;
  mapName: string;
  regionName: string | null;
  location: string | null;
  spawnCount: number;
  respawnSeconds: number;
  dungeonId: number | null;
  dungeonName: string | null;
  isDungeonRepeatable: boolean;
  isActive: boolean;
  monster: MonsterResponse;
}

export interface CreateMonsterSpawnRequest {
  monsterId: number;
  mapName: string;
  regionName?: string;
  location?: string;
  spawnCount?: number;
  respawnSeconds?: number;
  dungeonId?: number;
  isActive?: boolean;
}

export interface UpdateMonsterSpawnRequest {
  spawnCount: number;
  respawnSeconds: number;
}


export interface DungeonConfigResponse {
  dungeonConfigId: number;
  name: string;
  description: string | null;
  // Dungeon type is a free-form category with Normal as the current default; the backend does not enforce a closed allowlist.
  type: string;
  levelRequirement: number;
  maxMembers: number;
  difficulty: number;
  recommendedPower: number;
  energyCost: number;
  chestId: number | null;
  isActive: boolean;
  possibleDrops?: ChestItemResponse[];
}

export interface ChestItemResponse {
  chestItemId: number;
  chestId: number;
  itemId: number;
  itemName?: string;
  itemIconUrl?: string;
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
  itemRarity?: string;
  quantityMin: number;
  quantityMax: number;
  dropRate: number;
  isGuaranteed: boolean;
}

export interface CreateChestItemRequest {
  itemId: number;
  quantityMin?: number;
  quantityMax?: number;
  dropRate?: number;
  isGuaranteed?: boolean;
}

export interface UpdateDungeonConfigRequest {
  name?: string;
  description?: string;
  // Dungeon type is a free-form category with Normal as the current default; the backend does not enforce a closed allowlist.
  type?: string;
  levelRequirement?: number;
  maxMembers?: number;
  difficulty?: number;
  recommendedPower?: number;
  energyCost?: number;
  chestId?: number;
  isActive?: boolean;
}



export interface NPCResponse {
  npcId: number;
  name: string;
  description: string | null;
  // NPC type is a free-form category with Information as the current default; the backend does not enforce a closed allowlist.
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
  // Supported class requirements: Knight, Archer, Mage, or All; All allows every player class to use the skill or reward.
  classRequirement: string | null;
  // Supported skill types: Active, Passive, Buff, or Debuff; the type controls activation and effect presentation.
  type: string | null;
  // Supported damage types: Physical, Magical, or TrueDamage; the value selects how skill damage is categorized and resolved.
  damageType: string | null;
}

export interface UpdateQuestRewardSkillRequest {
  skillId: number;
}

export interface QuestResponse {
  questId: number;
  title: string;
  description: string | null;
  // Supported quest types: Main, Side, Daily, or Event; the type determines how the quest is grouped and presented.
  type: string;
  // Supported quest defaults: NotStarted, InProgress, Completed, Claimed, or Failed; this value initializes player quest progress.
  defaultStatus: string;
  mapName: string;
  regionName: string | null;
  // Supported quest objectives: Explore, Defeat, Collect, Talk, OpenChest, Interact, EquipSkill, or Kill; the value selects progress-tracking behavior.
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
  // Supported quest defaults: NotStarted, InProgress, Completed, Claimed, or Failed; this value initializes player quest progress.
  defaultStatus?: string;
  mapName?: string;
  regionName?: string | null;
  // Supported quest objectives: Explore, Defeat, Collect, Talk, OpenChest, Interact, EquipSkill, or Kill; the value selects progress-tracking behavior.
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


export interface AchievementResponse {
  achievementId: number;
  name: string;
  description: string | null;
  // Supported achievement types: Combat, Exploration, Social, Collection, or Progression; the type selects the tracked activity category.
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
  // Supported achievement types: Combat, Exploration, Social, Collection, or Progression; the type selects the tracked activity category.
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


export interface ShopItemResponse {
  shopItemId: number;
  itemId: number;
  itemName: string | null;
  itemIconUrl: string | null;
  // Supported item types: Weapon, Armor, Consumable, Material, QuestItem, or Currency; the type controls filtering, stacking, and usage behavior.
  itemType: string | null;
  shopSection: string;
  // Supported currencies: Gold or Gems; the selected currency determines which player balance is charged or credited.
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
  // Supported currencies: Gold or Gems; the selected currency determines which player balance is charged or credited.
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

export interface GachaBannerResponse {
  gachaBannerId: number;
  name: string;
  // Supported gacha banner types: Standard, Limited, or Event; the type controls banner categorization and presentation.
  type: string;
  pullCost: number;
  costItemId: number | null;
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
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
  itemRarity: string | null;
  dropRate: number;
  isFeatured: boolean;
}

export interface GachaBannerDetailResponse extends GachaBannerResponse {
  bannerItems: GachaBannerItemResponse[];
}

export interface UpdateGachaBannerRequest {
  name?: string;
  // Supported gacha banner types: Standard, Limited, or Event; the type controls banner categorization and presentation.
  type?: string;
  pullCost?: number;
  costItemId?: number | null;
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
  // Supported gacha banner types: Standard, Limited, or Event; the type controls banner categorization and presentation.
  type: string;
  pullCost: number;
  costItemId: number | null;
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


export interface MailboxRewardItemResponse {
  itemId: number;
  itemName: string | null;
  iconUrl: string | null;
  quantity: number;
}

export interface MailboxResponse {
  mailboxId: number;
  playerProfileId: number;
  playerName: string | null;
  title: string;
  content: string;
  // Mailbox type is a free-form category with System as the current default; the backend does not enforce a closed allowlist.
  type: string;
  attachedGold: number;
  attachedGems: number;
  attachedItems: MailboxRewardItemResponse[];
  isRead: boolean;
  isClaimed: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  sentAt: string;
  expiredAt: string | null;
}

export interface SendMailboxRewardItem {
  itemId: number;
  quantity: number;
}

export interface SendMailboxByListIdRequest {
  playerProfileIds: number[];
  title: string;
  content: string;
  // Mailbox type is a free-form category with System as the current default; the backend does not enforce a closed allowlist.
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItems?: SendMailboxRewardItem[];
  expiredAt?: string;
}

export interface SendMailboxToAllRequest {
  title: string;
  content: string;
  // Mailbox type is a free-form category with System as the current default; the backend does not enforce a closed allowlist.
  type?: string;
  attachedGold?: number;
  attachedGems?: number;
  attachedItems?: SendMailboxRewardItem[];
  expiredAt?: string;
}


export interface ContentResponse {
  contentId: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnailUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  isPublished: boolean;
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


export interface DashboardStatsResponse {
  totalPlayers: number;
  totalAccounts: number;
  onlinePlayers: number;
  offlinePlayers: number;
  totalItems: number;
  totalMonsters: number;
  totalTransactions: number;
  totalRevenue: number;
}


export interface PurchaseHistoryResponse {
  purchaseHistoryId: number;
  playerProfileId: number;
  playerName: string | null;
  shopItemId: number;
  itemName: string | null;
  itemIconUrl?: string;
  quantity: number;
  totalPrice: number;
  // Supported currencies: Gold or Gems; the selected currency determines which player balance is charged or credited.
  currency: string;
  purchasedAt: string;
}


export interface DailyLoginRewardResponse {
  dailyLoginRewardId: number;
  dayNumber: number;
  month: number | null;
  year: number | null;
  isDefault: boolean;
  // Supported reward types: Gold, Gems, EXP, Energy, or Item; Item rewards also require an item identifier and quantity.
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
  // Supported reward types: Gold, Gems, EXP, Energy, or Item; Item rewards also require an item identifier and quantity.
  rewardType?: string;
  rewardValue?: number;
  rewardItemId?: number;
  rewardItemQuantity: number;
  isActive?: boolean;
}

export interface UpdateDailyLoginRewardRequest {
  // Supported reward types: Gold, Gems, EXP, Energy, or Item; Item rewards also require an item identifier and quantity.
  rewardType: string;
  rewardValue: number;
  rewardItemId?: number | null;
  rewardItemQuantity: number;
  isActive: boolean;
}


export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}


export interface InventoryItemResponse {
  inventoryItemId: number;
  playerProfileId: number;
  itemId: number;
  itemName: string;
  itemDescription: string | null;
  // Supported item types: Weapon, Armor, Consumable, Material, QuestItem, or Currency; the type controls filtering, stacking, and usage behavior.
  itemType: string;
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
  itemRarity: string;
  // Supported equipment slots: None, Weapon, Armor, Helmet, Gloves, Boots, Ring, Necklace, or Shield.
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
  // Supported skin types include Armor and FullSet; the value identifies how the cosmetic is grouped and equipped.
  skinType: string;
  // Supported rarity values: Common, Uncommon, Rare, Epic, Legendary, or Mythic; rarity controls quality, visuals, and sorting priority.
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
