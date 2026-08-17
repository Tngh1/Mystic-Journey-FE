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
  cloth: string;
  realm: Realm;
}

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
    content: `Cedric meets you on the snow fields, where farmers hold borrowed spears against ice slimes. Clear their fields and he will trust you with a name before Queen Roselyn Aurora.\n\nThe Queen sends you to Zephyr, a priest who has studied the vanished Seal Books for thirty years. After you break the strange control driving the ice dragons, he reveals his suspicion: the codex was corrupted rather than born evil, and the truth lies in the forbidden north.\n\nBeyond Roland's boundary wait a stone golem and the fairy who never abandoned him. They were not forged as monsters. The golem once protected ordinary people, then imprisoned himself when the darkness twisted him. Defeat the tragic guardians, recover the third Seal Book, and carry their true story back into the world.`,
    Icon: Snowflake,
    cloth: "bg-heraldry-royal",
    realm: "frozen",
  },
  {
    id: 4,
    title: "The Castle of the Dead",
    subtitle: "The final seal",
    location: "Abandoned Castle",
    content: `The trail of the final Seal Book reaches Tide-Knell, where Natalie's father still fights the risen bones of neighbours he could not save.\n\nNatalie's lonely wish opened the old seal beneath the well. Recover her remains and her father's memories, then lay her beneath the ivy tree. Her Mystic Key opens the bridge to the deserted island.\n\nThere the Elf Guard and Brother Cael preserve the truth of King Aderyn: he accepted the curse and imprisoned himself so the wider world would be spared. Free the hero beneath the UnderKing's crown, recover the fourth Seal Book, and take the road home.`,
    Icon: Castle,
    cloth: "bg-heraldry-arcane",
    realm: "castle",
  },
  {
    id: 5,
    title: "The Origin Tree",
    subtitle: "The homecoming",
    location: "Elf Forest",
    content: `All four Seal Books are in your pack, and a portal carries you home — to a forest worse than you left it. Lyra knows the seals can close the wound, but the living tree first needs an uncorrupted memory.\n\nReturn to Elder Rowan and gather three White Flowers from the clearing where your journey began. He brews one last healing draught, joining the lives saved in Chapter One to the four books won across the other realms.\n\nSet the draught and the Seal Books upon the Origin Tree. The curse breaks and the forest wakes green — but Lyra's farewell carries a warning. The codex was corrupted by a master whose presence is still somewhere beyond the woods.`,
    Icon: Sprout,
    cloth: "bg-heraldry-crimson",
    realm: "forest",
  },
];

// Renders the sun view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
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

// Renders the story page view component.
// Key functionality: manages local UI state, pagination, and filter values.
// Returns the JSX element hierarchy for the page view.
export default function StoryPage() {
  const [active, setActive] = useState(0);
  const chapter = CHAPTERS[active];

  return (
    <div className="min-h-dvh pt-[88px] pb-16 md:pt-[112px]">
      <header className="relative px-4 py-10 md:py-14">
        <div className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-[27rem] md:max-w-[34rem]">
          <Sun />

          <div className="absolute inset-x-[19%] inset-y-[29%] flex flex-col items-center justify-center text-center text-on-parchment">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] md:text-xs">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              The Chronicle
            </p>

            <h1 className="mt-1.5 text-lg leading-none font-bold sm:text-2xl md:text-3xl">
              The Tale of Mystic Journey
            </h1>

            <span
              className="my-2 h-0.5 w-16 bg-on-parchment/40 md:my-3 md:w-24"
              aria-hidden="true"
            />

            <p className="max-w-[34ch] text-[11px] leading-snug text-on-parchment/85 sm:text-sm md:text-base md:leading-relaxed">
              You wake with no memory in a cursed forest. Four Seal Books, four realms, one
              dying Origin Tree — this is the road ahead.
            </p>

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

              <div className="mx-auto max-w-[68ch] space-y-4 text-[15px] leading-relaxed">
                {chapter.content.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>

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
