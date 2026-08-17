import Link from "next/link";
import type { ReactNode } from "react";
import { Package, Wand2, Ghost, Users, ArrowRight, Library } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Panel from "@/components/ui/Panel";
import { CLASSES } from "@/lib/data/classes";


const BOOKS = [
  {
    name: "Items",
    href: "/wiki/items",
    Icon: Package,
    hide: "bg-heraldry-royal",
    band: "bg-heraldry-royal/45",
    blurb: "Weapons, armour and consumables.",
    height: "h-56 sm:h-64",
    width: "w-20 sm:w-24",
  },
  {
    name: "Skills",
    href: "/wiki/skills",
    Icon: Wand2,
    hide: "bg-heraldry-arcane",
    band: "bg-heraldry-arcane/45",
    blurb: "Active and passive abilities.",
    height: "h-64 sm:h-72",
    width: "w-16 sm:w-20",
  },
  {
    name: "Monsters",
    href: "/wiki/monsters",
    Icon: Ghost,
    hide: "bg-heraldry-crimson",
    band: "bg-heraldry-crimson/45",
    blurb: "Enemies and the bosses behind them.",
    height: "h-52 sm:h-60",
    width: "w-20 sm:w-24",
  },
];

// Renders the volume view component.
// Returns the JSX element hierarchy for the page view.
function Volume({ book }: { book: (typeof BOOKS)[number] }) {
  const { name, href, Icon, hide, band, height, width } = book;
  return (
    <Link
      href={href}
      aria-label={`${name} — ${book.blurb}`}
      className={`pixel-press group relative flex ${height} ${width} shrink-0 items-stretch self-end shadow-[4px_4px_0_rgb(0_0_0_/_0.55)] transition-transform hover:-translate-y-2 focus-visible:-translate-y-2`}
    >
      <span
        className={`relative flex flex-1 flex-col items-center justify-between border-2 border-black/70 ${hide} py-3`}
      >
        <span
          className="pointer-events-none absolute inset-1.5 border-2 border-accent/25 group-hover:border-accent/70"
          aria-hidden="true"
        />
        <span className={`h-2 w-full ${band} border-y-2 border-black/50`} aria-hidden="true" />

        <span className="[writing-mode:vertical-rl] rotate-180 px-0.5 text-center text-sm font-black uppercase tracking-[0.2em] text-parchment">
          {name}
        </span>

        <span className="flex w-full flex-col items-center gap-2">
          <Icon className="h-5 w-5 text-parchment-dim group-hover:text-accent" aria-hidden="true" />
          <span className={`h-2 w-full ${band} border-y-2 border-black/50`} aria-hidden="true" />
        </span>
      </span>

      <span
        className="book-block w-2 shrink-0 border-y-2 border-r-2 border-black/70 sm:w-2.5"
        aria-hidden="true"
      />
    </Link>
  );
}


// Renders the bloom_size view component.
// Returns the JSX element hierarchy for the page view.
const BLOOM_SIZE = {
  sm: { cell: "h-1 w-1 md:h-1.5 md:w-1.5", stem: "w-1 md:w-1.5", leaf: ["w-2.5", "w-2"] },
  md: { cell: "h-1.5 w-1.5 md:h-2 md:w-2", stem: "w-1.5 md:w-2", leaf: ["w-3.5", "w-3"] },
  lg: { cell: "h-2 w-2 md:h-2.5 md:w-2.5", stem: "w-1.5 md:w-2", leaf: ["w-4", "w-3.5"] },
} as const;

const BLOOMS = [
  { key: "rose-sm", size: "sm", h: "h-8 md:h-12", lean: "-rotate-12", petal: "bg-bloom-rose", leaf: "left" },
  { key: "lilac-md", size: "md", h: "h-14 md:h-20", lean: "-rotate-6", petal: "bg-bloom-lilac", leaf: "right" },
  { key: "coral-lg", size: "lg", h: "h-20 md:h-28", lean: "", petal: "bg-bloom-coral", leaf: "left" },
  { key: "rose-lg", size: "lg", h: "h-16 md:h-24", lean: "rotate-3", petal: "bg-bloom-rose", leaf: "right" },
  { key: "coral-sm", size: "sm", h: "h-10 md:h-14", lean: "rotate-12", petal: "bg-bloom-coral", leaf: "left" },
  { key: "lilac-sm", size: "sm", h: "h-6 md:h-10", lean: "rotate-6", petal: "bg-bloom-lilac", leaf: "right" },
] as const;

const BLOOM_CELLS = [
  0, 1, 1, 1, 0,
  1, 1, 2, 1, 1,
  1, 2, 2, 2, 1,
  1, 1, 2, 1, 1,
  0, 1, 1, 1, 0,
] as const;

// Renders the bloom view component.
// Returns the JSX element hierarchy for the page view.
function Bloom({ bloom }: { bloom: (typeof BLOOMS)[number] }) {
  const size = BLOOM_SIZE[bloom.size];
  return (
    <span className={`flex origin-bottom flex-col items-center ${bloom.lean}`}>
      <span className="grid grid-cols-5">
        {BLOOM_CELLS.map((cell, i) => (
          <span
            key={i}
            className={`${size.cell} ${
              cell === 0 ? "" : cell === 1 ? bloom.petal : "bg-parchment"
            }`}
          />
        ))}
      </span>

      <span className={`relative ${bloom.h} ${size.stem} bg-grass`}>
        <span
          className={`absolute top-[18%] h-1.5 ${size.leaf[0]} bg-grass-lit ${
            bloom.leaf === "left" ? "right-full" : "left-full"
          }`}
        />
        <span
          className={`absolute top-[52%] h-1.5 ${size.leaf[1]} bg-grass ${
            bloom.leaf === "left" ? "left-full" : "right-full"
          }`}
        />
      </span>
    </span>
  );
}

// Renders the planter view component.
// Returns the JSX element hierarchy for the page view.
function Planter({
  eyebrow,
  icon: Icon,
  title,
  children,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="relative mx-auto w-full max-w-[21rem] md:max-w-[25rem]">
      <div className="flex items-end justify-center gap-1.5 md:gap-2.5" aria-hidden="true">
        {BLOOMS.map((b) => (
          <Bloom key={b.key} bloom={b} />
        ))}
      </div>

      <div className="mx-auto w-[88%] border-x-2 border-t-2 border-black/70 bg-soil-dark px-1.5 pt-1.5">
        <div className="h-2 w-full bg-soil" aria-hidden="true" />
      </div>

      <div className="h-5 w-full border-2 border-black/70 bg-clay-light shadow-[inset_0_3px_0_rgb(255_255_255_/_0.16),inset_0_-3px_0_rgb(0_0_0_/_0.30)]" />

      <div className="mx-auto w-[94%] border-x-2 border-b-2 border-black/70 bg-clay px-4 py-4 text-center shadow-[inset_3px_0_0_rgb(255_255_255_/_0.10),inset_-4px_0_0_rgb(0_0_0_/_0.28)] md:px-5 md:py-5">
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-parchment-dim md:text-xs">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-lg leading-none font-bold text-parchment md:text-2xl">
          {title}
        </h1>
        <span className="mx-auto my-2.5 block h-0.5 w-16 bg-accent/60 md:w-24" aria-hidden="true" />
        <p className="mx-auto max-w-[38ch] text-[11px] leading-snug text-parchment-dim sm:text-sm md:leading-relaxed">
          {children}
        </p>
      </div>

      <div className="mx-auto h-2.5 w-[86%] border-x-2 border-b-2 border-black/70 bg-clay-dark shadow-[inset_-4px_0_0_rgb(0_0_0_/_0.25)]" />
      <div className="mx-auto h-2.5 w-[76%] border-x-2 border-b-2 border-black/70 bg-wood-dark" />
    </header>
  );
}

// Renders the wiki page view component.
// Returns the JSX element hierarchy for the page view.
export default function WikiPage() {
  return (
    <div className="flex min-h-dvh flex-col pt-[88px] md:pt-[112px]">
      <div className="mx-auto mt-auto w-full max-w-[1200px] px-4 pt-12 md:pt-16">
        <Planter eyebrow="The Archive" icon={Library} title="Mystic Journey Wiki">
          Take a volume down from the case: items, skills and the monsters that stand between
          you and the four Seal Books.
        </Planter>

        <Panel
          material="wood"
          as="section"
          aria-labelledby="case-heading"
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 border-b-4 border-black/60 bg-wood-light px-4 py-2.5 shadow-[inset_0_2px_0_rgb(255_255_255_/_0.10)]">
            <h2
              id="case-heading"
              className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-parchment"
            >
              <Library className="h-4 w-4 text-accent" aria-hidden="true" />
              The Case
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
              {BOOKS.length} Codices
            </span>
          </div>

          <div className="bookcase-back border-x-8 border-wood px-3 pt-8 sm:px-5">
            <div className="flex items-end justify-center gap-3 sm:gap-5">
              {BOOKS.map((b) => (
                <Volume key={b.name} book={b} />
              ))}
            </div>
            <div className="shelf-board mb-8 h-3 w-full" aria-hidden="true" />

            <div className="pt-2">
              <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                Orders
              </p>
              <ul className="space-y-1.5">
                {CLASSES.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/wiki/classes/${c.id}`}
                      className={`pixel-press group flex min-h-11 items-center gap-3 border-2 border-black/70 border-b-parchment-dim ${c.accent} px-3 py-2 shadow-[2px_2px_0_rgb(0_0_0_/_0.5)] transition-transform hover:-translate-x-1`}
                    >
                      <span className="h-4 w-1 shrink-0 bg-accent/40 group-hover:bg-accent" aria-hidden="true" />
                      <span className={`flex-1 text-sm font-black uppercase tracking-widest ${c.accentText}`}>
                        {c.name}
                      </span>
                      <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim sm:block">
                        {c.role}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-parchment-dim group-hover:text-accent" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shelf-board mt-6 mb-4 h-3 w-full" aria-hidden="true" />
          </div>

          <div className="h-4 border-t-4 border-black/60 bg-wood-dark" aria-hidden="true" />
        </Panel>
      </div>
    </div>
  );
}
