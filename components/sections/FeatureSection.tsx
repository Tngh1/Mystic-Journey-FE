"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trees, Leaf, Snowflake, Landmark, MapPin, Swords, Milestone } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import SectionHeading from "@/components/ui/SectionHeading";
import Banner from "@/components/ui/Banner";
import OrnateDivider from "@/components/ui/OrnateDivider";

const WORLDS = [
  {
    id: "elf-forest",
    title: "Elf Forest",
    subtitle: "Chapter I",
    description:
      "Venture into the ancient heartwood where towering trees whisper forgotten magic. The elves have guarded these woods for millennia, but a creeping shadow now threatens their sanctuary. Unravel the mystery before the forest falls to darkness.",
    image: "/images/worlds/latest/elf-forest.webp",
    tag: "Enchanted Woodland",
    tone: "pine" as const,
    Icon: Trees,
    cloth: "bg-heraldry-pine",
    quarry: ["Swamp Slime", "Swamp Demon"],
  },
  {
    id: "autumn-pumpkin",
    title: "Autumn Pumpkin",
    subtitle: "Chapter II",
    description:
      "A land draped in eternal autumn, where giant pumpkins glow under twilight skies and mischievous spirits roam the misty paths. Ancient harvest rituals have gone awry - restore balance before the harvest moon rises again.",
    image: "/images/worlds/latest/autumn-pumpkin.webp",
    tag: "Harvest Twilight",
    tone: "ember" as const,
    Icon: Leaf,
    cloth: "bg-heraldry-ember",
    quarry: ["Pumpkin Spirit", "Ruin Dragon"],
  },
  {
    id: "frozen-mountains",
    title: "Frozen Mountains",
    subtitle: "Chapter III",
    description:
      "Scale treacherous glacial peaks where the aurora dances above frozen lakes and ice elementals patrol crystalline caverns. A blizzard of unnatural origin locks the mountain pass - only the bravest heroes can push through.",
    image: "/images/worlds/latest/frozen-mountains.webp",
    tag: "Glacial Tundra",
    tone: "royal" as const,
    Icon: Snowflake,
    cloth: "bg-heraldry-royal",
    quarry: ["Ice Slime", "Ice Dragon", "Stone Golem"],
  },
  {
    id: "vestige-era",
    title: "Vestige of an Era",
    subtitle: "Chapter IV",
    description:
      "Explore the crumbling remnants of a lost civilization swallowed by time. Ancient machines still hum beneath overgrown temples, and forgotten relics pulse with dormant power. Uncover the truth that brought a golden age to ruin.",
    image: "/images/worlds/latest/vestige-era.webp",
    tag: "Ancient Ruins",
    tone: "arcane" as const,
    Icon: Landmark,
    cloth: "bg-heraldry-arcane",
    quarry: ["Skeleton Guard", "UnderKing"],
  },
];

const NUMERALS = ["I", "II", "III", "IV"];

// Renders the world section reusable UI component.
// Returns the styled JSX element.
export default function WorldSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const worldRefs = useRef<(HTMLElement | null)[]>([]);

  // Load bounding client rect when the dependencies change, update active index, and ignore stale callbacks after unmount.
  useEffect(() => {
    let frame = 0;

    // Helper function executing measure.
    // Processes input parameters and returns the calculated result.
    const measure = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      worldRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < closestDistance && rect.top < viewportHeight && rect.bottom > 0) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    // Event handler for handle scroll.
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    measure();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Helper function executing travel to.
  const travelTo = (index: number) =>
    worldRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });

  return (
    <section id="game-features" className="w-full px-5 py-16 text-white md:px-10 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-6 lg:grid-cols-2 lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Four Realms"
            title={
              <>
                Explore the <span className="text-accent">World</span>
              </>
            }
          />

          <p className="max-w-xl text-base leading-relaxed tracking-wide text-fg-muted md:text-lg">
            Four legendary realms await. Each region holds its own secrets, monsters,
            and stories — only the worthy may traverse them all.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12">
          <nav
            aria-label="Realms of Mystic Journey"
            className="hidden lg:block lg:sticky lg:top-40 lg:max-h-[calc(100dvh-14rem)] lg:self-start"
          >
            <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-fg-subtle">
              <Milestone className="h-3.5 w-3.5" aria-hidden="true" />
              The Road
            </p>

            <ol className="relative">
              <span
                className="absolute top-5 bottom-5 left-[1.375rem] w-0.5 bg-iron-light"
                aria-hidden="true"
              />

              {WORLDS.map((world, index) => {
                const active = index === activeIndex;
                return (
                  <li key={world.id} className="relative">
                    <button
                      type="button"
                      onClick={() => travelTo(index)}
                      aria-current={active ? "true" : undefined}
                      className={`flex min-h-11 w-full cursor-pointer items-center gap-3 py-1.5 text-left transition-colors duration-300 ${
                        active ? "text-accent" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 text-sm font-black tabular-nums shadow-md transition-colors duration-300 ${
                          active
                            ? `border-accent ${world.cloth} text-parchment`
                            : "border-black/60 bg-iron text-parchment-dim"
                        }`}
                      >
                        {NUMERALS[index]}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold">{world.title}</span>
                        <span className="block truncate text-[11px] font-bold uppercase tracking-widest text-fg-subtle">
                          {world.tag}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="space-y-12 md:space-y-16">
            {WORLDS.map((world, index) => (
              <article
                key={world.id}
                id={world.id}
                ref={(el) => { worldRefs.current[index] = el; }}
                aria-labelledby={`${world.id}-title`}
                className={`border-2 shadow-[6px_6px_0_rgb(0_0_0_/_0.55)] transition-colors duration-300 ${
                  index === activeIndex ? "border-accent" : "border-black/60"
                }`}
              >
                <div
                  className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-2 border-black/60 ${world.cloth} px-4 py-3`}
                >
                  <h3
                    id={`${world.id}-title`}
                    className="flex items-center gap-2.5 text-lg font-black uppercase tracking-[0.14em] text-parchment md:text-xl"
                  >
                    <world.Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {world.title}
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-parchment-dim">
                    {world.subtitle}
                  </p>
                </div>

                <div className="relative aspect-16/9 w-full overflow-hidden border-b-2 border-black/60 md:aspect-21/9">
                  <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 860px"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="pixelated object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="pixel-scanlines absolute inset-0 opacity-25" aria-hidden="true" />
                  <div className="absolute top-0 left-4">
                    <Banner tone={world.tone}>{world.tag}</Banner>
                  </div>
                </div>

                <div className="parchment p-4 md:p-6">
                  <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
                    <p className="max-w-[64ch] text-[15px] leading-relaxed text-on-parchment">
                      {world.description}
                    </p>

                    <dl className="space-y-3 border-t-2 border-on-parchment/20 pt-4 md:border-t-0 md:border-l-2 md:border-on-parchment/20 md:pt-0 md:pl-5">
                      <div>
                        <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-on-parchment/60">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          Terrain
                        </dt>
                        <dd className="mt-1 text-sm font-bold text-on-parchment">{world.tag}</dd>
                      </div>

                      <div>
                        <dt className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-on-parchment/60">
                          <Swords className="h-3.5 w-3.5" aria-hidden="true" />
                          Quarry
                        </dt>
                        <dd className="mt-1.5 flex flex-wrap gap-1.5">
                          {world.quarry.map((q) => (
                            <span
                              key={q}
                              className="border-2 border-black/60 bg-wood px-2 py-0.5 text-[11px] font-bold text-parchment shadow-xs"
                            >
                              {q}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-24 md:mt-28">
          <OrnateDivider weight="right" />

          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="text-3xl font-bold leading-tight text-fg md:text-4xl lg:text-5xl">
              Step Into the World of{" "}
              <span className="text-accent">Mystic Journey</span>
            </h3>

            <Link href="/story" className="self-start md:self-auto">
              <AnimatedButton size="md">EXPLORE LORE</AnimatedButton>
            </Link>
          </div>

          <OrnateDivider weight="left" className="mt-10" />
        </div>
      </div>
    </section>
  );
}
