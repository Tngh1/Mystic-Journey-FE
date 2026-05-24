"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const FEATURES = [
  {
    title: "Farming",
    description:
      "Find rare seeds to start your own farm in the valley. Grow crops with help from your Chumbi including the 8 types of Chumberries.",
    image: "/images/test.jpg",
  },
  {
    title: "Breeding",
    description:
      "Visit the Primordial Tree to breed your Chumbi NFTs. All Chumbi are made up of type, coat, ears, eyes, mouth and pattern. Breed them together to create new combinations.",
    image: "/images/test.jpg",
  },
  {
    title: "Crafting",
    description:
      "Use your farm grown crops and other items to craft rare NFT items that can be used in-game or traded for rewards.",
    image: "/images/test.jpg",
  },
  {
    title: "Exploration",
    description:
      "Chumbi Valley is made up of many interesting and unique regions, each with their own secrets. Explore to find all the hidden areas and quests.",
    image: "/images/test.jpg",
  },
];

export default function FeatureSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      featureRefs.current.forEach((ref, index) => {
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="w-full bg-black px-5 py-16 text-white md:px-10 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="text-4xl font-black leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            Gameplay
            <br />
            Features
          </h2>

          <p className="max-w-4xl text-base leading-relaxed tracking-wide text-[#ffc032] md:text-lg">
            Discover all that Chumbi Valley has to offer with your Chumbi
            companions by your side.
          </p>
        </div>

        {/* Main Content - Sticky Layout */}
        <div className="lg:grid lg:grid-cols-[1.15fr_0.45fr_0.65fr] lg:gap-16">
          {/* Left: Sticky Image */}
          <div className="hidden lg:block lg:sticky lg:top-40 lg:h-[calc(100vh-30rem)] lg:self-start">
            <div className="relative h-full w-full overflow-hidden">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${index === activeIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                    }`}
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="520px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Content */}
          <div className="space-y-32 md:space-y-52 lg:col-span-2">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                ref={(el) => {
                  featureRefs.current[index] = el;
                }}
                className="lg:grid lg:grid-cols-[0.45fr_0.65fr] lg:gap-16"
              >
                {/* Mobile Image */}
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden lg:hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 0px"
                    className="object-cover"
                  />
                </div>

                {/* Title */}
                <h3
                  className={`text-3xl font-black leading-tight tracking-tight text-white transition-all duration-300 md:text-4xl lg:self-start lg:pt-3 ${index === activeIndex ? "" : "opacity-40"
                    }`}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className={`max-w-sm text-base leading-loose tracking-wide text-white/90 transition-all duration-300 md:text-lg lg:self-start ${index === activeIndex ? "" : "opacity-40"
                    }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 md:mt-28">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ca831f]" />
            <div className="h-2 w-2 rounded-full bg-[#ca831f]" />
            <div className="h-px flex-[2.4] bg-[#ca831f]" />
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <h3 className="text-3xl font-black leading-tight md:text-4xl lg:text-5xl">
              A magical journey awaits...
            </h3>

            <Button variant="outline" size="md">CHUMBI LORE</Button>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px flex-[2.4] bg-[#ca831f]" />
            <div className="h-2 w-2 rounded-full bg-[#ca831f]" />
            <div className="h-px flex-1 bg-[#ca831f]" />
          </div>
        </div>
      </div>
    </section>
  );
}
