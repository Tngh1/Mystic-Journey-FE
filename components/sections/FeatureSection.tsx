"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";

const WORLDS = [
  {
    id: "elf-forest",
    title: "Elf Forest",
    subtitle: "Chapter I",
    description:
      "Venture into the ancient heartwood where towering trees whisper forgotten magic. The elves have guarded these woods for millennia, but a creeping shadow now threatens their sanctuary. Unravel the mystery before the forest falls to darkness.",
    image: "/images/worlds/latest/elf-forest.png",
    accent: "#4ade80",
    accentDim: "rgba(74,222,128,0.15)",
    tag: "Enchanted Woodland",
    tagBg: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  },
  {
    id: "autumn-pumpkin",
    title: "Autumn Pumpkin",
    subtitle: "Chapter II",
    description:
      "A land draped in eternal autumn, where giant pumpkins glow under twilight skies and mischievous spirits roam the misty paths. Ancient harvest rituals have gone awry - restore balance before the harvest moon rises again.",
    image: "/images/worlds/latest/autumn-pumpkin.png",
    accent: "#fb923c",
    accentDim: "rgba(251,146,60,0.15)",
    tag: "Harvest Twilight",
    tagBg: "bg-orange-950/60 text-orange-300 border-orange-700/50",
  },
  {
    id: "frozen-mountains",
    title: "Frozen Mountains",
    subtitle: "Chapter III",
    description:
      "Scale treacherous glacial peaks where the aurora dances above frozen lakes and ice elementals patrol crystalline caverns. A blizzard of unnatural origin locks the mountain pass - only the bravest heroes can push through.",
    image: "/images/worlds/latest/frozen-mountains.png",
    accent: "#7dd3fc",
    accentDim: "rgba(125,211,252,0.15)",
    tag: "Glacial Tundra",
    tagBg: "bg-sky-950/60 text-sky-300 border-sky-700/50",
  },
  {
    id: "vestige-era",
    title: "Vestige of an Era",
    subtitle: "Chapter IV",
    description:
      "Explore the crumbling remnants of a lost civilization swallowed by time. Ancient machines still hum beneath overgrown temples, and forgotten relics pulse with dormant power. Uncover the truth that brought a golden age to ruin.",
    image: "/images/worlds/latest/vestige-era.png",
    accent: "#c084fc",
    accentDim: "rgba(192,132,252,0.15)",
    tag: "Ancient Ruins",
    tagBg: "bg-purple-950/60 text-purple-300 border-purple-700/50",
  },
];

export default function WorldSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const worldRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      worldRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);

          if (distance < closestDistance && rect.top < viewportHeight && rect.bottom > 0) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveIndex(closestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const active = WORLDS[activeIndex];

  return (
    <section id="game-features" className="w-full  px-5 py-16 text-white md:px-10 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="text-4xl font-black leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            Explore the{" "}
            <span
              className="transition-colors duration-500"
              style={{ color: active.accent }}
            >
              World
            </span>
          </h2>

          <p className="max-w-xl text-base leading-relaxed tracking-wide text-white/50 md:text-lg">
            Four legendary realms await. Each region holds its own secrets, monsters,
            and stories - only the worthy may traverse them all.
          </p>
        </div>

        {/* Main Content - Sticky Layout */}
        <div className="lg:grid lg:grid-cols-[1.15fr_0.45fr_0.65fr] lg:gap-16">
          {/* Left: Sticky Image */}
          <div className="hidden lg:block lg:sticky lg:top-40 lg:h-[calc(100vh-30rem)] lg:self-start">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
              {WORLDS.map((world, index) => (
                <div
                  key={world.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                >
                  <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    sizes="520px"
                    className="object-cover"
                  />
                  {/* Color tint overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ background: `linear-gradient(to top, ${world.accentDim} 0%, transparent 60%)` }}
                  />
                  {/* Chapter badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest backdrop-blur-sm ${world.tagBg}`}>
                      {world.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: World Content */}
          <div className="space-y-32 md:space-y-52 lg:col-span-2">
            {WORLDS.map((world, index) => (
              <div
                key={world.id}
                ref={(el) => { worldRefs.current[index] = el; }}
                className="lg:grid lg:grid-cols-[0.45fr_0.65fr] lg:gap-16"
              >
                {/* Mobile Image */}
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl lg:hidden">
                  <Image
                    src={world.image}
                    alt={world.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${world.tagBg}`}>
                      {world.tag}
                    </span>
                  </div>
                </div>

                {/* Chapter label */}
                <p
                  className={`text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 lg:self-start lg:pt-3 ${
                    index === activeIndex ? "" : "opacity-40"
                  }`}
                  style={{ color: index === activeIndex ? world.accent : "white" }}
                >
                  {world.subtitle}
                </p>

                {/* Title + Description */}
                <div className={`transition-all duration-300 ${index === activeIndex ? "" : "opacity-40"}`}>
                  <h3 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
                    {world.title}
                  </h3>
                  <p className="max-w-sm text-base leading-loose tracking-wide text-white/80 md:text-lg">
                    {world.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 md:mt-28">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1" style={{ backgroundColor: active.accent, opacity: 0.5 }} />
            <div className="h-2 w-2 rounded-full transition-colors duration-500" style={{ backgroundColor: active.accent }} />
            <div className="h-px flex-[2.4] transition-colors duration-500" style={{ backgroundColor: active.accent, opacity: 0.5 }} />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
              Your legend begins in the{" "}
              <span className="transition-colors duration-500" style={{ color: active.accent }}>
                {active.title}
              </span>
              ...
            </h3>

            <Link href="/story" className="self-start md:self-auto">
              <AnimatedButton size="md">EXPLORE LORE</AnimatedButton>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-[2.4]" style={{ backgroundColor: active.accent, opacity: 0.5 }} />
            <div className="h-2 w-2 rounded-full transition-colors duration-500" style={{ backgroundColor: active.accent }} />
            <div className="h-px flex-1" style={{ backgroundColor: active.accent, opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </section>
  );
}
