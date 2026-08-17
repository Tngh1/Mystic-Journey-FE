
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
  plate: string;
  tone: BannerTone;
  border: string;
  text: string;
  hex: string;
  pips: number;
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

// Trim and lowercase the supplied rarity, return a supported rarity key, and fall back to common for missing or unknown values.
export function normalizeRarity(r?: string | null): ItemRarity {
  const n = r?.trim().toLowerCase();
  return RARITY_KEYS.includes(n as ItemRarity) ? (n as ItemRarity) : "common";
}

// Normalize the requested rarity and return its label, color, border, pip count, and sorting metadata.
export function getRarityMeta(r?: string | null): RarityMeta {
  return RARITY_META[normalizeRarity(r)];
}
