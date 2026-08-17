"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const WORDMARK_SHADOW =
  "[text-shadow:0_4px_0_var(--color-accent-deep),4px_4px_0_var(--color-wood-dark),8px_8px_0_rgb(0_0_0_/_0.55)]";

const STARS = [
  { top: "4%", left: "6%", size: "h-2 w-2" },
  { top: "-2%", left: "48%", size: "h-1.5 w-1.5" },
  { top: "10%", left: "92%", size: "h-2.5 w-2.5" },
  { top: "72%", left: "2%", size: "h-1.5 w-1.5" },
  { top: "88%", left: "72%", size: "h-2 w-2" },
];

// Renders the mystic title reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
const MysticTitle = () => (
  <div className="relative mx-auto w-full max-w-[36rem] select-none">
    <span aria-hidden="true">
      {STARS.map((s) => (
        <span
          key={`${s.top}${s.left}`}
          className={`pointer-events-none absolute bg-accent shadow-2xs ${s.size}`}
          style={{ top: s.top, left: s.left }}
        />
      ))}
    </span>

    <h1
      className={`relative flex flex-col items-center leading-[0.85] text-accent ${WORDMARK_SHADOW}`}
    >
      <span className="text-5xl font-bold uppercase tracking-[0.06em] sm:text-6xl md:text-7xl">
        Mystic
      </span>
      <span className="mt-2 text-4xl font-bold uppercase tracking-[0.18em] sm:text-5xl md:text-6xl">
        Journey
      </span>
    </h1>
  </div>
);

// Renders the hero section reusable UI component.
// Features: applies customizable style variants and responsive CSS classes; binds user interaction event listeners.
// Returns the styled JSX element.
export default function HeroSection() {
  return (
    <section className="relative w-full min-h-dvh flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/ui/hero-banner.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/images/ui/hero-banner.webp"
          className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        >
          <source src="/videos/Banner.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/75" />
        <div className="pixel-scanlines absolute inset-0 opacity-40 mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full pt-16">

        <div className="mb-6 flex items-center gap-3" aria-hidden="true">
          <span className="h-0.5 w-6 bg-accent" />
          <span className="h-0.5 w-2 bg-accent" />
          <span className="text-xs font-bold uppercase tracking-[0.34em] text-accent">
            Pixel-Art Dark Fantasy MMORPG
          </span>
          <span className="h-0.5 w-2 bg-accent" />
          <span className="h-0.5 w-6 bg-accent" />
        </div>

        <MysticTitle />

        <p className="mt-6 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
          Wake with no memory in a cursed forest. Hunt the four Seal Books
          across four realms, and heal the Origin Tree before the curse
          devours it.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/download"
            className="pixel-press inline-flex items-center gap-2 border-2 border-accent bg-accent px-8 py-3.5 text-sm font-black uppercase tracking-widest text-on-accent shadow-lg hover:bg-accent-hover cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            Play Now
          </Link>
          <AnimatedButton
            size="lg"
            onClick={() => window.open("/videos/Banner.mp4", "_blank", "noopener,noreferrer")}
          >
            WATCH TRAILER
          </AnimatedButton>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 hover:text-accent transition-colors cursor-pointer motion-safe:animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="w-5 h-5" aria-hidden="true" />
      </a>

      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
