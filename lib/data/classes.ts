/* Static class data — base stats mirror the backend ClassConfigs seed
   (Mystic-Journey-BE migration AddClassConfigs). No public class API yet.
   Skills are fetched live and filtered by SkillResponse.classRequirement. */

export interface GameClass {
  id: string;
  /** Matches ClassConfig.ClassName and Skill.ClassRequirement (Knight/Mage/Archer). */
  name: string;
  role: string;
  image: string;
  /** Tailwind accent classes for the class's semantic color. */
  accent: string;
  accentText: string;
  accentBorder: string;
  barColor: string;
  description: string;
  playstyle: string;
  /** Base combat stats from ClassConfig. */
  stats: { hp: number; atk: number; def: number };
}

/** Max base value per stat across all classes — used to normalise stat bars. */
export const STAT_MAX = { hp: 500, atk: 50, def: 40 } as const;

/** Base stats identical across every class (from the ClassConfig seed). */
export const SHARED_STATS = [
  { label: "Crit Rate", value: "5%" },
  { label: "Crit DMG", value: "150%" },
  { label: "Atk Speed", value: "100" },
  { label: "Move Speed", value: "100" },
];

export const CLASSES: GameClass[] = [
  {
    id: "knight",
    name: "Knight",
    role: "Frontline Defender",
    image: "/images/classes/knight.png",
    accent: "bg-red-500/15",
    accentText: "text-red-400",
    accentBorder: "border-red-500/30",
    barColor: "#f87171",
    description:
      "A sturdy sword fighter built for close combat. Knights hold the line, absorb hits from Shadow Sprouts, and protect the party while exploring the Enchanted Forest.",
    playstyle: "Tanky melee bruiser — soak damage and control the frontline.",
    stats: { hp: 500, atk: 30, def: 40 },
  },
  {
    id: "mage",
    name: "Mage",
    role: "Arcane Damage",
    image: "/images/classes/mage.png",
    accent: "bg-purple-500/15",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    barColor: "#c084fc",
    description:
      "A ranged spellcaster who channels elemental magic from a safe distance. Mages control groups of enemies and burst down corrupted forest creatures.",
    playstyle: "High-burst caster — devastating spells, fragile up close.",
    stats: { hp: 300, atk: 50, def: 15 },
  },
  {
    id: "archer",
    name: "Archer",
    role: "Precision Ranged",
    image: "/images/classes/archer.png",
    accent: "bg-green-500/15",
    accentText: "text-green-400",
    accentBorder: "border-green-500/30",
    barColor: "#4ade80",
    description:
      "A nimble bow user focused on speed, positioning, and precise shots. Archers thin out threats before they can reach the hero.",
    playstyle: "Agile marksman — kite enemies and strike from range.",
    stats: { hp: 350, atk: 40, def: 20 },
  },
];

export function getClassBySlug(slug: string): GameClass | undefined {
  return CLASSES.find((c) => c.id === slug.toLowerCase());
}
