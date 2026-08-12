const USERNAME = /^[A-Za-z0-9._-]+$/;
export function validateUsername(value) { const v = String(value ?? "").trim(); return v.length >= 3 && v.length <= 100 && USERNAME.test(v); }
export function validatePassword(value) { const v = String(value ?? ""); return v.length >= 6 && v.length <= 100 && /[A-Za-z]/.test(v) && /\d/.test(v); }
export function normalizeRegistration(email, username) { return { email: String(email ?? "").trim().toLowerCase(), username: String(username ?? "").trim() }; }
export function validatePositivePrice(price) { return Number.isFinite(Number(price)) && Number(price) > 0; }
export function validateGachaRates(rates) { return Array.isArray(rates) && rates.length > 0 && rates.every(r => Number.isFinite(Number(r)) && Number(r) >= 0) && rates.reduce((s, r) => s + Number(r), 0) <= 100; }
export function validateDateWindow(start, end) { const a = Date.parse(start), b = Date.parse(end); return Number.isFinite(a) && Number.isFinite(b) && b > a; }
export function validateDungeonConfig(c) { return Number(c.requiredLevel) >= 1 && Number(c.maxMembers) >= 1 && Number(c.maxMembers) <= 4 && Number(c.energyCost) >= 0; }
export function validateQuestConfig(c) { return String(c.title ?? "").trim().length > 0 && Number(c.targetAmount) >= 1 && Number(c.rewardGold ?? 0) >= 0 && Number(c.rewardGems ?? 0) >= 0; }
export function validateMail(c) { return String(c.subject ?? "").trim().length > 0 && String(c.body ?? "").trim().length > 0 && Number(c.gold ?? 0) >= 0 && Number(c.gems ?? 0) >= 0; }
