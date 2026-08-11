/* Guest-level route smoke test: every route is fetched with no access_token
   cookie, so what's under test is proxy.ts's gating plus "the page compiles and
   renders at all".

   The previous version accepted any 200..399 as a pass. Every protected route
   answers 307 -> /login for a guest, so all 20 dashboard rows passed without a
   single admin page ever rendering. Each route now declares what it should
   answer, and a redirect only counts when it lands on /login.

   ponytail: still HTTP-level, so it proves a page renders, not that it works.
   Asserting on content needs a real browser driver (Playwright) and a logged-in
   session — the next step is a `tests/` Playwright project reusing these paths. */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

/* `features` are the SRS IDs that route covers, kept for traceability. Several
   IDs share /dashboard (logout, game info, statistics all live on it), so they
   are grouped rather than re-fetched once per ID. */
const PUBLIC = 'public';   // 200, no cookie needed
const GATED = 'gated';     // 307 -> /login for a guest

const routesToTest = [
  { path: '/', expect: PUBLIC, features: ['F06_GameInfo'] },
  { path: '/register', expect: PUBLIC, features: ['F01_Register'] },
  { path: '/login', expect: PUBLIC, features: ['F02_Login'] },
  { path: '/forgot-password', expect: PUBLIC, features: ['F03_ForgotPwd'] },

  /* There is no /change-password route; changing a password is a panel on the
     account security page, which is itself gated. */
  { path: '/account/security', expect: GATED, features: ['F04_ChangePwd'] },

  { path: '/dashboard', expect: GATED, features: ['F05_Logout', 'F21_Statistics'] },
  { path: '/manage-accounts', expect: GATED, features: ['F07_ViewProfile'] },
  { path: '/manage-players', expect: GATED, features: ['F08_PlayerManagement'] },
  { path: '/manage-category-content', expect: GATED, features: ['F09_CategoryManagement'] },
  { path: '/manage-content', expect: GATED, features: ['F10_ContentManagement'] },
  { path: '/manage-items', expect: GATED, features: ['F11_ItemManagement'] },
  { path: '/manage-monsters', expect: GATED, features: ['F12_MonsterManagement'] },
  { path: '/manage-gacha-pools', expect: GATED, features: ['F13_GachaManagement'] },
  { path: '/manage-shop', expect: GATED, features: ['F14_ShopItemManagement'] },
  { path: '/manage-transactions', expect: GATED, features: ['F15_TransactionList'] },
  { path: '/manage-dungeons', expect: GATED, features: ['F16_DungeonManagement'] },
  { path: '/manage-quests', expect: GATED, features: ['F17_QuestManagement'] },
  { path: '/manage-achievements', expect: GATED, features: ['F18_AchievementManagement'] },
  { path: '/manage-mailbox', expect: GATED, features: ['F19_MailManagement'] },
  { path: '/manage-daily-login', expect: GATED, features: ['F20_DailyLoginManagement'] },
];

/* F22_AdminManagement has no route: creating/elevating admins was removed from
   the BE (see lib/api/admin-accounts.ts), so there is nothing to smoke test.
   It was previously listed against /manage-admins, which 404s. */

async function checkRoute(item) {
  const url = new URL(item.path, BASE_URL);
  let res;
  try {
    // manual: a followed redirect reports the *destination's* 200, which is
    // exactly how the gate used to pass unnoticed.
    res = await fetch(url, { redirect: 'manual' });
  } catch (err) {
    return { ...item, status: 'CONNECTION_ERROR', pass: false, detail: err.message };
  }

  const location = res.headers.get('location') || '';
  if (item.expect === GATED) {
    const redirected = res.status === 307 || res.status === 302;
    const toLogin = new URL(location, BASE_URL).pathname === '/login';
    return {
      ...item,
      status: res.status,
      pass: redirected && toLogin,
      detail: redirected
        ? (toLogin ? `-> ${location}` : `redirected to ${location}, expected /login`)
        : 'not gated: a guest reached this route',
    };
  }

  return {
    ...item,
    status: res.status,
    pass: res.status === 200,
    detail: res.status === 200 ? '' : `expected 200${location ? `, redirected to ${location}` : ''}`,
  };
}

async function runTests() {
  console.log(`=======================================================`);
  console.log(` Mystic Journey Frontend route smoke test (guest session)`);
  console.log(` ${routesToTest.length} routes against ${BASE_URL}`);
  console.log(`=======================================================\n`);

  let passed = 0;
  let failed = 0;

  for (const item of routesToTest) {
    const r = await checkRoute(item);
    const tag = r.pass ? '[PASS]' : '[FAIL]';
    console.log(
      ` ${tag} ${r.features.join(', ').padEnd(38)} ${r.path.padEnd(26)}` +
      ` (${r.expect}, ${r.status}) ${r.detail}`
    );
    if (r.pass) passed++;
    else failed++;
  }

  console.log(`\n-------------------------------------------------------`);
  console.log(` Total: ${routesToTest.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`-------------------------------------------------------\n`);

  // Was gated behind FAIL_ON_ERROR=true, so a red run still exited 0 and CI
  // went green on failures. Failing is the default now.
  if (failed > 0) process.exit(1);
}

runTests();
