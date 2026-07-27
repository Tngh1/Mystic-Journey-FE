"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, Trees, Leaf, Snowflake, Castle, Sprout, MapPin, Crown } from "lucide-react";
import Panel from "@/components/ui/Panel";
import ChapterFrame, { type Realm } from "@/components/ui/ChapterFrame";

interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  content: string;
  Icon: typeof Trees;
  /** The realm's heraldic cloth for the chapter plate. Ink on all five is
   *  parchment, so the plate never carries meaning by colour alone — the
   *  location name sits on it. */
  cloth: string;
  /** Which realm the chapter's whole enclosure is built from — see ChapterFrame. */
  realm: Realm;
}

/* Story summaries follow the main-quest seed in the game database
   (Quests 1–31, MysticJourneyDbContext) — introduction only, no spoilers
   beyond what the quest log itself reveals. */
const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: "The Forest That Called You",
    subtitle: "Where the journey begins",
    location: "Elf Forest",
    content: `You wake at the edge of the Elf Forest with no memory of how you arrived. Elder Rowan is waiting by the great roots — he needs your hands and your courage, and he starts small: white flowers for a healing draught, a first skill, slimes creeping out of the marsh.\n\nBut the slimes were only fleeing something worse. Deep in the woods a Swamp Demon guards a Seal Book — the first of four. When you carry it to the guardian Lyra at the Origin Tree, she tells you the truth: a curse is rotting the tree's roots, and all four seals are needed to lift it.\n\nThen a cloaked figure who has watched you since you woke steps into a portal at the forest's edge. You follow.`,
    Icon: Trees,
    cloth: "bg-heraldry-pine",
    realm: "forest",
  },
  {
    id: 2,
    title: "The Silent City",
    subtitle: "An autumn that never ends",
    location: "Autumn Pumpkin",
    content: `The portal spits you onto a cold beach under an autumn sky, with no coin and no name anyone knows. You work Farmer Fa's pumpkin fields for your supper and carry his harvest to the city gate — where the guard Tristan lets you through into silence. The city beyond is full of the dead.\n\nOnly one man ever held these ruins: the silver knight Arthur. You find him wounded, his power sealed, unable to fight for his own city. So he makes you strong enough to fight in his place — a training dungeon, a dark technique, his Silver Necklace.\n\nWhat broke the city was a dragon, nesting in the ruins. End it, and Arthur tells you where the cursed codex that started all of this went: north, to a kingdom it froze solid.`,
    Icon: Leaf,
    cloth: "bg-heraldry-ember",
    realm: "pumpkin",
  },
  {
    id: 3,
    title: "The Frozen Kingdom",
    subtitle: "Where the codex left its mark",
    location: "Frozen Mountain",
    content: `Queen Roselyn Aurora receives you in a hall of ice. Her kingdom still stands, but barely — ice slimes overrun the snow fields, and ice dragons circle the mountain shrine where the priest Zephyr keeps his rites.\n\nEarn the Queen's trust and Zephyr will tell you what the kingdom buried: the codex's mark lies inside the forbidden zone, behind boundary stones only the warden Roland may open.\n\nRoland's secret is heavier still. The kingdom hid the codex itself here, and forged a stone golem to guard it. Destroy the guardian, and the second Seal Book is yours.`,
    Icon: Snowflake,
    cloth: "bg-heraldry-royal",
    realm: "frozen",
  },
  {
    id: 4,
    title: "The Castle of the Dead",
    subtitle: "Two seals remain",
    location: "Abandoned Castle",
    content: `The trail of the seals ends at a ruined castle where skeletons still keep watch, held back by a single Valiant Warrior fighting alone in the valley.\n\nIn the drowned village of Tide-Knell, a girl named Natalie asks a strange favour: dig beside the old well and lift out the skull buried there. The skull is hers. Lay her to rest beneath the ivy tree, and she gives you the key she died holding.\n\nThat key opens the way to a deserted island where one elf guard still stands his post over a sealed crypt. Below waits the UnderKing — and the last two Seal Books are his.`,
    Icon: Castle,
    cloth: "bg-heraldry-arcane",
    realm: "castle",
  },
  {
    id: 5,
    title: "The Origin Tree",
    subtitle: "The homecoming",
    location: "Elf Forest",
    content: `All four Seal Books are in your pack, and a portal carries you home — to a forest worse than you left it.\n\nLyra opens the rite at the Origin Tree and steps back: the seals must be set by the one who won them. Place the four books on the tree, break the curse, and watch the forest wake green around you.\n\nBut when you speak with Lyra one last time, she leaves you with a warning instead of a farewell. The codex had a master. And that story is not finished.`,
    Icon: Sprout,
    cloth: "bg-heraldry-crimson",
    realm: "forest",
  },
];

/* The sun IS the hero. The stone wall, its tile lattice and the carved board are
   gone: the chronicle's title now sits inside one large pixel disc, the way a
   game's title card sits inside a sprite rather than on a UI panel.

   The disc is one 32x32 SVG under a kilobyte, rasterised from a real circle so
   the silhouette reads as round; a coarser grid turned it into an octagon. At
   this size each cell is ~20px, so the edge still steps.

   Ink is `on-parchment` brown, not gold — gold on gold is invisible, and brown
   on the accent body is about 7:1. No flicker: this is a static plate carrying
   body copy, and pulsing the text's own background is the one place the
   torch-flicker cycle actively hurts legibility. */
function Sun() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/ui/sun.svg"
      alt=""
      aria-hidden="true"
      className="pixelated pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export default function StoryPage() {
  const [active, setActive] = useState(0);
  const chapter = CHAPTERS[active];

  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      {/* Hero — the chronicle read in daylight: a pixel sun overhead, then a gilt
          banner nailed above a carved board. It used to be centred text floating
          on a bare dark band, which read as a web page header rather than
          anything from the game; everything here is a material the rest of the
          system already uses (stone ground, wood board, gilt cloth, gold ink).
          The sun is the only motion and it animates opacity only, so it costs no
          layout and vanishes under prefers-reduced-motion. */}
      <header className="relative px-4 py-10 md:py-14">
        {/* The disc, square so the sun stays round, and capped so the text band
            inside it never gets wider than a readable measure. The cap used to
            be 40rem, which filled the viewport and read as a splash screen
            rather than a page header. The sun stays a step larger than
            MoonHeader's 30rem because it carries two more rows — the rule and
            the five seal marks. */}
        <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[27rem] md:max-w-[34rem]">
          <Sun />

          {/* The text sits in the disc's flat middle band — cells y=6..14 of the
              20-cell grid, i.e. 30%–70% — inset horizontally by a fifth so it
              clears the stepped left and right edges. Percentages, not padding,
              so the field scales with the sun at every breakpoint. */}
          <div className="absolute inset-x-[19%] inset-y-[29%] flex flex-col items-center justify-center text-center text-on-parchment">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] md:text-xs">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              The Chronicle
            </p>

            <h1 className="mt-1.5 text-lg leading-none font-bold sm:text-2xl md:text-3xl">
              The Tale of Mystic Journey
            </h1>

            {/* Brown rule rather than OrnateDivider: the divider is gold, and
                gold on the gold disc is invisible. */}
            <span
              className="my-2 h-0.5 w-16 bg-on-parchment/40 md:my-3 md:w-24"
              aria-hidden="true"
            />

            <p className="max-w-[34ch] text-[11px] leading-snug text-on-parchment/85 sm:text-sm md:text-base md:leading-relaxed">
              You wake with no memory in a cursed forest. Four Seal Books, four realms, one
              dying Origin Tree — this is the road ahead.
            </p>

            {/* The five chapters as seal marks, so the length of the road is
                visible before you start reading it. Decorative duplicate of the
                chapter rail below, hence aria-hidden. */}
            <div className="mt-2.5 flex items-center gap-1.5 md:mt-4 md:gap-2" aria-hidden="true">
              {CHAPTERS.map((c) => (
                <span
                  key={c.id}
                  className={`flex h-5 w-5 items-center justify-center border-2 border-black/60 shadow-md md:h-7 md:w-7 ${c.cloth}`}
                >
                  <c.Icon className="h-2.5 w-2.5 text-parchment md:h-3.5 md:w-3.5" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1000px] px-4 py-12 md:px-6 md:py-16">
        {/* Chapter rail. Each realm is a heraldic plate; the open one takes the
            gold frame and aria-current, so the state is never colour-only. */}
        <nav aria-label="Chapters" className="mb-8 flex flex-wrap justify-center gap-2">
          {CHAPTERS.map((c, i) => {
            const isActive = active === i;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(i)}
                aria-current={isActive ? "step" : undefined}
                className={`pixel-press flex min-h-11 cursor-pointer items-center gap-2 border-2 px-4 text-xs font-black uppercase tracking-widest shadow-md transition-colors ${
                  isActive
                    ? `border-accent ${c.cloth} text-parchment`
                    : "border-black/60 bg-wood text-parchment-dim hover:border-accent hover:text-parchment"
                }`}
              >
                <c.Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{c.location}</span>
                <span className="sm:hidden">Ch. {c.id}</span>
              </button>
            );
          })}
        </nav>

        {/* The open chapter, on parchment: this is the one place in the system
            that is long-form reading, and ink on paper is what it wants. The
            enclosure around it is the realm itself — canopy and bark for the Elf
            Forest, gourd rind for Autumn Pumpkin, an ice pillar for Frozen
            Mountain, a curtain wall for the Abandoned Castle. See
            components/ui/ChapterFrame; the whole frame changes, not a trim. */}
        <ChapterFrame realm={chapter.realm} aria-labelledby="chapter-title">
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/60 ${chapter.cloth} px-4 py-2.5`}>
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-parchment">
              <chapter.Icon className="h-4 w-4" aria-hidden="true" />
              Chapter {chapter.id}
            </span>
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-parchment-dim">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {chapter.location}
            </span>
          </div>

          <div className="p-3 md:p-4">
            <div className="parchment border-2 border-wood-dark p-6 shadow-[inset_0_0_0_2px_rgb(0_0_0_/_0.12)] md:p-10">
              <header className="mb-6 border-b-2 border-on-parchment/20 pb-4 text-center">
                <h2 id="chapter-title" className="text-2xl font-bold md:text-3xl">
                  {chapter.title}
                </h2>
                <p className="mt-1 text-sm italic text-on-parchment/70">{chapter.subtitle}</p>
              </header>

              {/* max-w-[68ch] keeps the measure inside the readable line-length
                  band; centred body copy is hard to track, so this is left-set. */}
              <div className="mx-auto max-w-[68ch] space-y-4 text-[15px] leading-relaxed">
                {chapter.content.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Pager, on the realm's own frame rather than the page — no fill of
              its own, so it sits on ice in the mountain and on stone in the
              castle instead of carrying oak into both. */}
          <div className="flex items-center justify-between gap-3 border-t-2 border-black/60 px-3 py-3 md:px-4">
            <button
              type="button"
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="pixel-press flex min-h-11 cursor-pointer items-center gap-2 border-2 border-black/60 bg-wood px-3 text-xs font-bold uppercase tracking-widest text-parchment hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4 rotate-180" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <p className="text-[11px] font-bold uppercase tracking-widest text-parchment-dim tabular-nums">
              {chapter.id} / {CHAPTERS.length}
            </p>

            <button
              type="button"
              onClick={() => setActive(Math.min(CHAPTERS.length - 1, active + 1))}
              disabled={active === CHAPTERS.length - 1}
              className="pixel-press flex min-h-11 cursor-pointer items-center gap-2 border-2 border-accent bg-accent px-3 text-xs font-black uppercase tracking-widest text-on-accent hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </ChapterFrame>

        {/* Closing call — the one gold panel on the page. */}
        <Panel material="wood" as="section" aria-labelledby="closing" className="mt-8 p-8 text-center md:p-10">
          <Crown className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
          <h2 id="closing" className="mb-3 text-xl font-bold text-parchment md:text-2xl">
            The Codex Had a Master
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-parchment-dim">
            Five chapters. Four Seal Books. One healed Origin Tree — and a story that is not
            finished. Step into the world and live it yourself.
          </p>
          <Link
            href="/download"
            className="pixel-press inline-flex min-h-11 items-center gap-2 border-2 border-accent bg-accent px-8 text-sm font-black uppercase tracking-widest text-on-accent shadow-md hover:bg-accent-hover"
          >
            Play Now
          </Link>
        </Panel>
      </div>
    </div>
  );
}
