import http from 'http';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

const routesToTest = [
  { feature: 'F01_Register', path: '/register' },
  { feature: 'F02_Login', path: '/login' },
  { feature: 'F03_ForgotPwd', path: '/forgot-password' },
  { feature: 'F04_ChangePwd', path: '/change-password' },
  { feature: 'F05_Logout', path: '/dashboard' },
  { feature: 'F06_GameInfo', path: '/dashboard' },
  { feature: 'F07_ViewProfile', path: '/manage-accounts' },
  { feature: 'F08_PlayerManagement', path: '/manage-players' },
  { feature: 'F09_CategoryManagement', path: '/manage-category-content' },
  { feature: 'F10_ContentManagement', path: '/manage-content' },
  { feature: 'F11_ItemManagement', path: '/manage-items' },
  { feature: 'F12_MonsterManagement', path: '/manage-monsters' },
  { feature: 'F13_GachaManagement', path: '/manage-gacha-pools' },
  { feature: 'F14_ShopItemManagement', path: '/manage-shop' },
  { feature: 'F15_TransactionList', path: '/manage-transactions' },
  { feature: 'F16_DungeonManagement', path: '/manage-dungeons' },
  { feature: 'F17_QuestManagement', path: '/manage-quests' },
  { feature: 'F18_AchievementManagement', path: '/manage-achievements' },
  { feature: 'F19_MailManagement', path: '/manage-mailbox' },
  { feature: 'F20_DailyLoginManagement', path: '/manage-daily-login' },
  { feature: 'F21_Statistics', path: '/dashboard' },
  { feature: 'F22_AdminManagement', path: '/manage-admins' }
];

async function checkRoute(item) {
  return new Promise((resolve) => {
    const url = new URL(item.path, BASE_URL);
    const req = http.get(url, (res) => {
      const statusCode = res.statusCode || 0;
      const pass = statusCode >= 200 && statusCode < 400;
      resolve({
        feature: item.feature,
        path: item.path,
        status: statusCode,
        pass
      });
    });

    req.on('error', (err) => {
      resolve({
        feature: item.feature,
        path: item.path,
        status: 'CONNECTION_ERROR',
        pass: false,
        error: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log(`=======================================================`);
  console.log(` Mystic Journey Frontend Web Feature Test Runner`);
  console.log(` Testing 22 Feature Routes against ${BASE_URL}`);
  console.log(`=======================================================\n`);

  let passed = 0;
  let failed = 0;

  for (const item of routesToTest) {
    const result = await checkRoute(item);
    if (result.pass) {
      console.log(` [PASS] ${result.feature.padEnd(25)} -> ${result.path.padEnd(25)} (Status: ${result.status})`);
      passed++;
    } else {
      console.log(` [FAIL] ${result.feature.padEnd(25)} -> ${result.path.padEnd(25)} (Status: ${result.status}) ${result.error ? `- ${result.error}` : ''}`);
      failed++;
    }
  }

  console.log(`\n-------------------------------------------------------`);
  console.log(` Test Summary: Total: ${routesToTest.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`-------------------------------------------------------\n`);

  if (failed > 0 && process.env.FAIL_ON_ERROR === 'true') {
    process.exit(1);
  }
}

runTests();
