"use client";

import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const MysticTitle = () => (
  <div className="relative w-full max-w-[580px] mx-auto select-none">
    <svg
      viewBox="0 0 640 255"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      aria-label="Mystic Journey"
    >
      <defs>
        {/* Sunset gradient: pale gold → orange → crimson */}
        <linearGradient id="titleFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#fff1b8" />
          <stop offset="30%"  stopColor="#ffb347" />
          <stop offset="70%"  stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Glossy top-shine overlay */}
        <linearGradient id="titleShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.80" />
          <stop offset="28%"  stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="40%"  stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Outer glow filter */}
        <filter id="titleGlow" x="-15%" y="-15%" width="130%" height="150%">
          <feDropShadow dx="0" dy="5"  stdDeviation="5" floodColor="#f97316" floodOpacity="0.6" />
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Sparkle blur */}
        <filter id="sparkle">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sparkles — warm golden */}
      <g filter="url(#sparkle)" fill="#fde68a">
        <circle cx="60"  cy="60"  r="5"/>
        <circle cx="540" cy="50"  r="7"/>
        <circle cx="40"  cy="165" r="3.5"/>
        <circle cx="565" cy="180" r="4"/>
        <circle cx="300" cy="18"  r="3.5"/>
        <circle cx="130" cy="210" r="3"/>
        <circle cx="460" cy="218" r="3.5"/>
      </g>

      {/* ── Slight tilt on the whole logo group ── */}
      <g transform="rotate(-2, 300, 120)">
        {/* ─── MYSTIC ─── */}
        {/* Layer 1: thick dark stroke / outline */}
        <text x="300" y="105"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="115" fontWeight="900"
          fill="#4a1500" stroke="#4a1500" strokeWidth="22"
          strokeLinejoin="round" strokeLinecap="round"
          paintOrder="stroke"
        >Mystic</text>
        {/* Layer 2: gradient fill + glow */}
        <text x="300" y="105"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="115" fontWeight="900"
          fill="url(#titleFill)"
          filter="url(#titleGlow)"
        >Mystic</text>
        {/* Layer 3: gloss */}
        <text x="300" y="105"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="115" fontWeight="900"
          fill="url(#titleShine)"
        >Mystic</text>

        {/* ─── JOURNEY ─── */}
        <text x="300" y="205"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="95" fontWeight="900"
          fill="#4a1500" stroke="#4a1500" strokeWidth="20"
          strokeLinejoin="round" strokeLinecap="round"
          paintOrder="stroke"
        >Journey</text>
        <text x="300" y="205"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="95" fontWeight="900"
          fill="url(#titleFill)"
          filter="url(#titleGlow)"
        >Journey</text>
        <text x="300" y="205"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'PatrickHandSC', cursive"
          fontSize="95" fontWeight="900"
          fill="url(#titleShine)"
        >Journey</text>
      </g>
    </svg>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Banner Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
          poster="/images/ui/hero-banner.png"
        >
          <source src="/videos/Banner.mp4" type="video/mp4" />
        </video>
        {/* Layered scrims for text legibility (skill: dark bg for focus) */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full pt-16">

        {/* Eyebrow */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-linear-to-r from-transparent to-[#ffc032]/60" />
          <span className="text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
            Dark Fantasy MMORPG
          </span>
          <span className="h-px w-8 bg-linear-to-l from-transparent to-[#ffc032]/60" />
        </div>

        {/* ── Artistic Bouncy Title ── */}
        <MysticTitle />

        {/* Tagline */}
        <p className="mt-6 max-w-xl text-base md:text-lg text-white/75 leading-relaxed">
          Rise as a hero against the shadow. Master your class, explore four
          legendary realms, and uncover the corruption spreading through the world.
        </p>

        {/* CTAs — primary action + secondary trailer */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/download"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ffc032] text-[#111] font-black tracking-widest uppercase text-sm transition-all hover:bg-[#ffd04c] hover:scale-105 shadow-lg shadow-[#ffc032]/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Play Now
          </Link>
          <AnimatedButton
            size="lg"
            onClick={() => { console.log("Watch Trailer"); }}
          >
            WATCH TRAILER
          </AnimatedButton>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-[#ffc032] transition-colors cursor-pointer motion-safe:animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </a>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
