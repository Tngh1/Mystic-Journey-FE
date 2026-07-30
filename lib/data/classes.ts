/* Presentation data for the three playable orders: art, heraldry and lore.
   The *numbers* are not here — base stats come live from
   `GET /api/wiki/classes` via `lib/hooks/useClassConfigs.ts`.

   They used to be duplicated in this file and had already drifted from the
   backend seed (Knight ATK was 30 here against 50 in the DB), which is exactly
   the failure mode a second copy invites. `name` is the join key: it matches
   both ClassConfig.ClassName and Skill.ClassRequirement. */

import type { BannerTone } from "@/components/ui/Banner";

export interface GameClass {
  id: string;
  /** Matches ClassConfig.ClassName and Skill.ClassRequirement (Knight/Mage/Archer). */
  name: string;
  role: string;
  image: string;
  /** Heraldic cloth for the class name plate (solid, with parchment ink on it),
   *  matching the Banner tones. Not a second brand accent: gold stays the only
   *  saturated colour that means "act on this". */
  accent: string;
  accentText: string;
  /** The same cloth as `accent`, for call sites that render a real <Banner>
   *  rather than styling a plate by hand. Keep the two in step. */
  bannerTone: BannerTone;
  /** Frame line. Deliberately the same neutral for all three — a class is told
   *  apart by its plate and stat bars, not by a coloured card outline. */
  accentBorder: string;
  /** Lit tint of the plate colour, for the discrete stat blocks. Always paired
   *  with an icon and a number so meaning never rests on colour alone. */
  barColor: string;
  description: string;
  playstyle: string;
}

export const CLASSES: GameClass[] = [
  {
    id: "knight",
    name: "Knight",
    role: "Frontline Defender",
    image: "/images/classes/knight.webp",
    accent: "bg-heraldry-crimson",
    accentText: "text-parchment",
    bannerTone: "crimson",
    accentBorder: "border-line-strong",
    barColor: "#b9503c",
    description:
      "A sturdy sword fighter built for close combat. Knights hold the line, absorb hits from Shadow Sprouts, and protect the party while exploring the Enchanted Forest.",
    playstyle: "Tanky melee bruiser — soak damage and control the frontline.",
  },
  {
    id: "mage",
    name: "Mage",
    role: "Arcane Damage",
    image: "/images/classes/mage.webp",
    accent: "bg-heraldry-arcane",
    accentText: "text-parchment",
    bannerTone: "arcane",
    accentBorder: "border-line-strong",
    barColor: "#9a6fc4",
    description:
      "A ranged spellcaster who channels elemental magic from a safe distance. Mages control groups of enemies and burst down corrupted forest creatures.",
    playstyle: "High-burst caster — devastating spells, fragile up close.",
  },
  {
    id: "archer",
    name: "Archer",
    role: "Precision Ranged",
    image: "/images/classes/archer.webp",
    accent: "bg-heraldry-pine",
    accentText: "text-parchment",
    bannerTone: "pine",
    accentBorder: "border-line-strong",
    barColor: "#5aa06a",
    description:
      "A nimble bow user focused on speed, positioning, and precise shots. Archers thin out threats before they can reach the hero.",
    playstyle: "Agile marksman — kite enemies and strike from range.",
  },
];

export function getClassBySlug(slug: string): GameClass | undefined {
  return CLASSES.find((c) => c.id === slug.toLowerCase());
}
