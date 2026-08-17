import { Swords, Sparkles, TreePine } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Panel from "@/components/ui/Panel";


// Renders the about_content reusable UI component.
// Returns the styled JSX element.
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

// Renders the nail reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
function Nail({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-3 w-3 border-2 border-black/60 bg-iron-light shadow-[inset_-1px_-1px_0_rgb(0_0_0_/_0.55)] ${className}`}
      aria-hidden="true"
    />
  );
}

// Renders the shield reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
function Shield({ icon: Icon, title, text, dye }: (typeof PILLARS)[number]) {
  return (
    <li className="mx-auto w-full max-w-[19rem]">
      <div className={`border-2 border-black/70 ${dye} px-5 pb-5 pt-6 text-center shadow-[4px_4px_0_rgb(0_0_0_/_0.5)]`}>
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border-2 border-black/60 bg-iron text-accent shadow-[inset_2px_2px_0_var(--color-iron-light),inset_-2px_-2px_0_rgb(0_0_0_/_0.55)]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="text-base font-black uppercase tracking-[0.14em] text-parchment">
          {title}
        </h3>
        <span className="mx-auto my-3 block h-0.5 w-12 bg-accent/60" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-parchment-dim">{text}</p>
      </div>

      <div className={`mx-auto h-4 w-[82%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.20)]`} aria-hidden="true" />
      <div className={`mx-auto h-4 w-[56%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.30)]`} aria-hidden="true" />
      <div className={`mx-auto h-3 w-[26%] border-x-2 border-b-2 border-black/70 ${dye} shadow-[inset_0_-2px_0_rgb(0_0_0_/_0.45)]`} aria-hidden="true" />
    </li>
  );
}

// Renders the about section reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden bg-bg px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28"
    >
      <div
        className="pixel-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
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

          <div className="mx-auto mt-5 flex max-w-sm items-center gap-2" aria-hidden="true">
            <span className="h-0.5 flex-1 bg-on-parchment/35" />
            <span className="h-2 w-2 bg-on-parchment/55" />
            <span className="h-0.5 flex-1 bg-on-parchment/35" />
          </div>

          <p className="mx-auto mt-7 max-w-3xl text-center text-lg font-medium leading-relaxed sm:text-xl">
            {ABOUT_CONTENT.lead}
          </p>

          <span className="mx-auto mt-6 block h-0.5 w-24 bg-parchment-dim" aria-hidden="true" />

          <p className="mx-auto mt-6 max-w-[70ch] text-center text-base leading-[1.9] tracking-wide sm:text-lg">
            {ABOUT_CONTENT.body}
          </p>

          <div className="mt-8 flex flex-col items-center" aria-hidden="true">
            <span className="h-1.5 w-6 bg-heraldry-crimson" />
            <span className="h-4 w-9 bg-heraldry-crimson shadow-[inset_2px_2px_0_rgb(255_255_255_/_0.12),inset_-2px_-2px_0_rgb(0_0_0_/_0.35)]" />
            <span className="h-1.5 w-6 bg-heraldry-crimson" />
          </div>
        </Panel>

        <ul className="mt-14 grid gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {PILLARS.map((pillar) => (
            <Shield key={pillar.title} {...pillar} />
          ))}
        </ul>
      </div>
    </section>
  );
}
