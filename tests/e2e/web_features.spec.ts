/**
 * Mystic Journey Web App - 22 Feature E2E Test Suite Specification
 * Maps to Report5_Web_Test_Cases.xlsx features F01 - F22
 */

export interface TestFeatureRoute {
  featureId: number;
  featureCode: string;
  title: string;
  route: string;
  expectedSelectors: string[];
}

export const WEB_FEATURE_ROUTES: TestFeatureRoute[] = [
  { featureId: 1, featureCode: "F01_Register", title: "Register", route: "/register", expectedSelectors: ["input[name='email']", "input[name='password']", "button[type='submit']"] },
  { featureId: 2, featureCode: "F02_Login", title: "Login", route: "/login", expectedSelectors: ["input[name='email']", "input[name='password']", "button[type='submit']"] },
  { featureId: 3, featureCode: "F03_ForgotPwd", title: "Forgot Password", route: "/forgot-password", expectedSelectors: ["input[name='email']", "button[type='submit']"] },
  { featureId: 4, featureCode: "F04_ChangePwd", title: "Change Password", route: "/change-password", expectedSelectors: ["input[name='oldPassword']", "input[name='newPassword']"] },
  { featureId: 5, featureCode: "F05_Logout", title: "Logout", route: "/dashboard", expectedSelectors: ["button[data-testid='logout-btn']", "a[href='/login']"] },
  { featureId: 6, featureCode: "F06_GameInfo", title: "View Game Info", route: "/dashboard", expectedSelectors: ["div", "main"] },
  { featureId: 7, featureCode: "F07_ViewProfile", title: "View Profile", route: "/manage-accounts", expectedSelectors: ["main", "table"] },
  { featureId: 8, featureCode: "F08_PlayerManagement", title: "Player Management", route: "/manage-players", expectedSelectors: ["main", "table"] },
  { featureId: 9, featureCode: "F09_CategoryManagement", title: "Category Management", route: "/manage-category-content", expectedSelectors: ["main", "table"] },
  { featureId: 10, featureCode: "F10_ContentManagement", title: "Content Management", route: "/manage-content", expectedSelectors: ["main", "table"] },
  { featureId: 11, featureCode: "F11_ItemManagement", title: "Item Management", route: "/manage-items", expectedSelectors: ["main", "table"] },
  { featureId: 12, featureCode: "F12_MonsterManagement", title: "Monster Management", route: "/manage-monsters", expectedSelectors: ["main", "table"] },
  { featureId: 13, featureCode: "F13_GachaManagement", title: "Gacha Management", route: "/manage-gacha-pools", expectedSelectors: ["main", "table"] },
  { featureId: 14, featureCode: "F14_ShopItemManagement", title: "Shop Management", route: "/manage-shop", expectedSelectors: ["main", "table"] },
  { featureId: 15, featureCode: "F15_TransactionList", title: "Transaction History", route: "/manage-transactions", expectedSelectors: ["main", "table"] },
  { featureId: 16, featureCode: "F16_DungeonManagement", title: "Dungeon Management", route: "/manage-dungeons", expectedSelectors: ["main", "table"] },
  { featureId: 17, featureCode: "F17_QuestManagement", title: "Quest Management", route: "/manage-quests", expectedSelectors: ["main", "table"] },
  { featureId: 18, featureCode: "F18_AchievementManagement", title: "Achievement Management", route: "/manage-achievements", expectedSelectors: ["main", "table"] },
  { featureId: 19, featureCode: "F19_MailManagement", title: "Mail Management", route: "/manage-mailbox", expectedSelectors: ["main", "table"] },
  { featureId: 20, featureCode: "F20_DailyLoginManagement", title: "Daily Login Management", route: "/manage-daily-login", expectedSelectors: ["main", "table"] },
  { featureId: 21, featureCode: "F21_Statistics", title: "Statistics Dashboard", route: "/dashboard", expectedSelectors: ["main"] },
  { featureId: 22, featureCode: "F22_AdminManagement", title: "Admin Management", route: "/manage-admins", expectedSelectors: ["main", "table"] }
];
