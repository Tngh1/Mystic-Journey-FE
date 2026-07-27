/* Item/skin rarity, shared by the items codex and the item detail page. Both
   used to declare their own `rarityMeta` with Tailwind's web palette (gray-300,
   green-500, blue-500, purple-500, amber-500, red-500) and they had already
   drifted apart in their tints.

   Rarity is the one deliberate exception to "gold is the only saturated colour":
   a rarity scale is a genre convention players read instantly, and flattening it
   to one hue would lose real information. It stays inside the system two ways —
   the tiers are the heraldic cloth tones the rest of the app uses, and legendary
   is the deep gold trim (`accent-deep`), never the pure CTA gold, so a rarity
   plate can't be mistaken for something to click.

   Every tier also carries a pip count, so rarity survives without colour. */

import type { BannerTone } from "@/components/ui/Banner";

export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic";

export interface RarityMeta {
  label: string;
  /** Solid cloth plate plus its ink. Use for badges and sigil tiles. */
  plate: string;
  /** The same cloth as `plate`, for call sites that render a real <Banner> —
   *  e.g. the rarity hung over a BookSpread gutter. Keep the two in step.
   *  Legendary is `gilt` (deep gold trim), never `gold`: the CTA tone must not
   *  appear on something that isn't an action. */
  tone: BannerTone;
  /** Border for a framed surface tinted by rarity. */
  border: string;
  /** Ink colour when the tier is named as bare text on a dark ground. */
  text: string;
  /** Raw colour for the discrete stat/rarity blocks and filter dots, where a
   *  Tailwind class can't reach (inline style on a generated element). */
  hex: string;
  /** 1–6. Rendered as pips so the tier reads without colour. */
  pips: number;
  /** Ascending sort weight. */
  sort: number;
}

export const RARITY_KEYS: ItemRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
];

export const RARITY_META: Record<ItemRarity, RarityMeta> = {
  common: {
    label: "Common",
    tone: "iron",
    plate: "bg-iron text-parchment",
    border: "border-iron-light",
    text: "text-parchment-dim",
    hex: "#5b6272",
    pips: 1,
    sort: 0,
  },
  uncommon: {
    label: "Uncommon",
    tone: "pine",
    plate: "bg-heraldry-pine text-parchment",
    border: "border-heraldry-pine",
    text: "text-parchment",
    hex: "#5aa06a",
    pips: 2,
    sort: 1,
  },
  rare: {
    label: "Rare",
    tone: "royal",
    plate: "bg-heraldry-royal text-parchment",
    border: "border-heraldry-royal",
    text: "text-parchment",
    hex: "#5b7fc7",
    pips: 3,
    sort: 2,
  },
  epic: {
    label: "Epic",
    tone: "arcane",
    plate: "bg-heraldry-arcane text-parchment",
    border: "border-heraldry-arcane",
    text: "text-parchment",
    hex: "#9a6fc4",
    pips: 4,
    sort: 3,
  },
  legendary: {
    label: "Legendary",
    tone: "gilt",
    plate: "bg-accent-deep text-on-accent",
    border: "border-accent-deep",
    text: "text-accent",
    hex: "#e8a33c",
    pips: 5,
    sort: 4,
  },
  mythic: {
    label: "Mythic",
    tone: "crimson",
    plate: "bg-heraldry-crimson text-parchment",
    border: "border-heraldry-crimson",
    text: "text-parchment",
    hex: "#b9503c",
    pips: 6,
    sort: 5,
  },
};

/** The API returns rarity in mixed case and occasionally null. */
export function normalizeRarity(r?: string | null): ItemRarity {
  const n = r?.trim().toLowerCase();
  return RARITY_KEYS.includes(n as ItemRarity) ? (n as ItemRarity) : "common";
}

export function getRarityMeta(r?: string | null): RarityMeta {
  return RARITY_META[normalizeRarity(r)];
}
