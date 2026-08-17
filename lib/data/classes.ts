
import type { BannerTone } from "@/components/ui/Banner";

export interface GameClass {
  id: string;
  name: string;
  // Free-form combat role label, such as Frontline Defender, Arcane Damage, or Precision Ranged; this is display metadata, not an account role.
  role: string;
  image: string;
  accent: string;
  accentText: string;
  bannerTone: BannerTone;
  accentBorder: string;
  barColor: string;
  description: string;
  playstyle: string;
}

export const CLASSES: GameClass[] = [
  {
    id: "knight",
    name: "Knight",
    // Free-form combat role label, such as Frontline Defender, Arcane Damage, or Precision Ranged; this is display metadata, not an account role.
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
    // Free-form combat role label, such as Frontline Defender, Arcane Damage, or Precision Ranged; this is display metadata, not an account role.
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
    // Free-form combat role label, such as Frontline Defender, Arcane Damage, or Precision Ranged; this is display metadata, not an account role.
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

// Helper function executing get class by slug.
// Processes input parameters and returns the calculated result.
export function getClassBySlug(slug: string): GameClass | undefined {
  return CLASSES.find((c) => c.id === slug.toLowerCase());
}
