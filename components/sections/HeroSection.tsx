"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/test.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center space-y-12 max-w-5xl mx-auto">
        {/* Game Logo/Title */}
        <div className="relative w-full max-w-2xl aspect-2/1 mx-auto animate-float">
          <Image
            src="/images/hero-title.png"
            alt="Mystic Journey Title"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Watch Trailer Button */}
        <Button
          variant="hero"
          size="lg"
          className="group relative overflow-hidden"
          onClick={() => {
            console.log("Watch Trailer clicked");
          }}
        >
          <span className="relative z-10 flex items-center gap-3">
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            WATCH TRAILER
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-white to-transparent opacity-20 pointer-events-none" />
    </section>
  );
}
