import { Swords, Sparkles, TreePine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Panel from "@/components/ui/Panel";

/* About, as a proclamation nailed to the wall with three shields hung under it.

   It used to be the generic treatment: the shared SectionHeading in the dark,
   an OrnateDivider under it, then the parchment slab, then three wooden rivet
   plaques. Two problems. The heading floated free of the sheet it introduced,
   so the section read as three unrelated blocks; and the plaques were oak —
   which now belongs to the wiki bookcase, not the landing page.

   So the heading moves *onto* the parchment: title, rule and lore are one
   sheet, held up by four iron nails and signed with a wax seal. The pillars
   become heraldic shields, each in its own dye — the only construction in the
   system that tapers to a point, which is what makes a rectangle read as a
   shield. Parchment-dim on all three dyes is 4.8–5.8:1. */

const ABOUT_CONTENT = {
  eyebrow: "The Legend Begins",
  title: "About Mystic Journey",
  lead:
    "A pixel-art MMORPG where you wake at the edge of the Elf Forest with no memory — and a dying world waiting for you.",
  body:
    "A curse is rotting the roots of the Origin Tree, and only four Seal Books scattered across four realms can break it. Answer Elder Rowan's call, choose your class, fight alongside other players, and follow the trail of the cursed codex from the Elf Forest to a castle where the dead still keep watch.",
};

const PILLARS: { icon: LucideIcon; title: string; text: string; dye: string }[] = [
  {
    icon: Swords,
    title: "Real-Time Combat",
    text: "Fight slimes, dragons, golems, and the UnderKing in skill-driven battles — solo or with friends.",
    dye: "bg-heraldry-crimson",
  },
  {
    icon: TreePine,
    title: "Four Cursed Realms",
    text: "The Elf Forest, an endless-autumn land, a frozen kingdom, and an abandoned castle — each holds one Seal Book.",
    dye: "bg-heraldry-pine",
  },
  {
    icon: Sparkles,
    title: "Rise as a Legend",
    text: "Pick from three distinct classes and grow from a lost stranger into the hero who heals the Origin Tree.",
    dye: "bg-heraldry-ember",
  },
];

/* An iron nail: lit head, shadowed shank. Decorative — the sheet is a normal
   article and needs no help being found. */
function Nail({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-3 w-3 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.55)] ${className}`}
      aria-hidden="true"
    />
  );
}

/* One shield: a dyed field with the fitting and copy on it, then three courses
   tapering to the point. The taper is the whole trick — without it this is a
   card. */
function Shield({ icon: Icon, title, text, dye }: (typeof PILLARS)[number]) {
  return (
    <li className="mx-auto w-full max-w-[19rem]">
      {/* Chief and field */}
      <div className={`border-2 border-black/70 ${dye} px-5 pb-5 pt-6 text-center shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]`}>
        {/* Iron boss. bg-iron, not .pixel-bevel-iron: that utility sets its own
            background and out-cascades a hover swap. */}
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2 border-black/60 bg-iron text-accent shadow-[inset_2px_2px_0_var(--color-iron-light),inset_-2px_-2px_0_rgb(0_0_0_/_0.55)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="text-base font-black uppercase tracking-[0.14em] text-parchment">
          {title}
        </h3>
        <span className="mx-auto my-3 block h-0.5 w-12 bg-accent/60" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-parchment-dim">{text}</p>
      </div>

      {/* The point: three stepped courses, each narrower and darker by an
          overlay, so the shield comes to a tip without a single curve. */}
      <div className={`mx-auto h-4 w-[82%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.20)]`} aria-hidden="true" />
      <div className={`mx-auto h-4 w-[56%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.30)]`} aria-hidden="true" />
      <div className={`mx-auto h-3 w-[26%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.45)]`} aria-hidden="true" />
    </li>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden bg-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      {/* Dungeon-tile texture — replaces the blurred gold glow, which softened
          the pixel look. Hard 32px lattice, faded out toward the bottom. */}
      <div
        className="pixel-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* The sheet. Parchment is the one light surface in the system and it
            earns it here: ink on paper is 8.7:1, so the longest copy on the
            page is also the most legible block on it. */}
        <Panel
          material="parchment"
          as="article"
          className="relative mx-auto max-w-4xl px-6 py-9 sm:px-12 sm:py-11"
        >
          <Nail className="left-2 top-2" />
          <Nail className="right-2 top-2" />
          <Nail className="bottom-2 left-2" />
          <Nail className="bottom-2 right-2" />

          <p className="flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-on-parchment/70 sm:text-xs">
            <span className="h-0.5 w-6 bg-on-parchment/40" aria-hidden="true" />
            {ABOUT_CONTENT.eyebrow}
            <span className="h-0.5 w-6 bg-on-parchment/40" aria-hidden="true" />
          </p>

          <h2
            id="about-heading"
            className="mt-3 text-center text-3xl font-black text-on-parchment sm:text-4xl"
          >
            {ABOUT_CONTENT.title}
          </h2>

          {/* Two rules with a lozenge between them, drawn in ink — parchment
              shouldn't carry crisp machine borders inside it. */}
          <div className="mx-auto mt-5 flex max-w-sm items-center gap-2" aria-hidden="true">
            <span className="h-0.5 flex-1 bg-on-parchment/35" />
            <span className="h-2 w-2 bg-on-parchment/55" />
            <span className="h-0.5 flex-1 bg-on-parchment/35" />
          </div>

          <p className="mx-auto mt-7 max-w-3xl text-center text-lg font-medium leading-relaxed sm:text-xl">
            {ABOUT_CONTENT.lead}
          </p>

          <span className="mx-auto mt-6 block h-0.5 w-24 bg-parchment-dim" aria-hidden="true" />

          {/* Measure capped near 70ch so the line length stays readable on
              wide screens. */}
          <p className="mx-auto mt-6 max-w-[70ch] text-center text-base leading-[1.9] tracking-wide sm:text-lg">
            {ABOUT_CONTENT.body}
          </p>

          {/* Wax seal: three courses of crimson, widest in the middle, so it
              reads as a pressed blob rather than a square. */}
          <div className="mt-8 flex flex-col items-center" aria-hidden="true">
            <span className="h-1.5 w-6 bg-heraldry-crimson" />
            <span className="h-4 w-9 bg-heraldry-crimson shadow-[inset_2px_2px_0_rgb(255_255_255_/_0.12),inset_-2px_-2px_0_rgb(0_0_0_/_0.35)]" />
            <span className="h-1.5 w-6 bg-heraldry-crimson" />
          </div>
        </Panel>

        {/* The shields, hung under the proclamation. */}
        <ul className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {PILLARS.map((pillar) => (
            <Shield key={pillar.title} {...pillar} />
          ))}
        </ul>
      </div>
    </section>
  );
}
