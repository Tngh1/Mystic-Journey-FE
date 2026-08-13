import test from "node:test";
import assert from "node:assert/strict";
import { normalizeRegistration, validateDateWindow, validateDungeonConfig, validateGachaRates, validateMail, validatePassword, validatePositivePrice, validateQuestConfig, validateUsername } from "../lib/validation/business-rules.mjs";

test("BR-002 normalizes registration identifiers", () => assert.deepEqual(normalizeRegistration("  PLAYER@Example.COM ", " Hero_01 "), { email: "player@example.com", username: "Hero_01" }));
test("BR-004 accepts allowed username characters", () => assert.equal(validateUsername(" hero_01-x.y "), true));
test("BR-004 rejects short username", () => assert.equal(validateUsername("ab"), false));
test("BR-004 rejects unsafe characters", () => assert.equal(validateUsername("hero<script>"), false));
test("BR-005 accepts password with letter and digit", () => assert.equal(validatePassword("mystic1"), true));
test("BR-005 rejects password without digit", () => assert.equal(validatePassword("mysticgame"), false));
test("BR-005 rejects password beyond 100 characters", () => assert.equal(validatePassword(`a1${"x".repeat(99)}`), false));
test("BR-041 accepts pool totaling 100 percent", () => assert.equal(validateGachaRates([70, 25, 5]), true));
test("BR-041 rejects pool above 100 percent", () => assert.equal(validateGachaRates([70, 25, 6]), false));
test("BR-047 rejects non-positive shop price", () => { assert.equal(validatePositivePrice(0), false); assert.equal(validatePositivePrice(-1), false); });
test("BR-037 enforces dungeon member bound", () => assert.equal(validateDungeonConfig({ requiredLevel: 1, maxMembers: 5, energyCost: 10 }), false));
test("BR-037 accepts valid dungeon controls", () => assert.equal(validateDungeonConfig({ requiredLevel: 10, maxMembers: 4, energyCost: 20 }), true));
test("BR-038 rejects quest target below one", () => assert.equal(validateQuestConfig({ title: "Defeat", targetAmount: 0 }), false));
test("BR-054 rejects blank system mail", () => assert.equal(validateMail({ subject: " ", body: "", gold: 0, gems: 0 }), false));
test("BR-040 rejects inverted date window", () => assert.equal(validateDateWindow("2026-08-31", "2026-08-01"), false));
