"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

const CLASSES = [
  {
    id: "knight",
    name: "Knight",
    role: "Frontline Defender",
    description:
      "A sturdy sword fighter built for close combat. Knights protect the party, absorb hits from Shadow Sprouts, and hold the line while exploring the Enchanted Forest.",
    image: "/images/classes/knight.png",
    badgeColor: "bg-red-600",
    cardBorder: "border-red-600/30",
    buttonBg: "bg-red-600 hover:bg-red-700",
  },
  {
    id: "mage",
    name: "Mage",
    role: "Arcane Damage",
    description:
      "A ranged spellcaster who channels elemental magic from a safe distance. Mages control groups of enemies and burst down corrupted forest creatures.",
    image: "/images/classes/mage.png",
    badgeColor: "bg-purple-600",
    cardBorder: "border-purple-600/30",
    buttonBg: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "archer",
    name: "Archer",
    role: "Precision Ranged",
    description:
      "A nimble bow user focused on speed, positioning, and precise shots. Archers thin out threats before they can reach the hero.",
    image: "/images/classes/archer.png",
    badgeColor: "bg-green-600",
    cardBorder: "border-green-600/30",
    buttonBg: "bg-green-600 hover:bg-green-700",
  },
];

export default function ClassSection() {
  return (
    <section id="classes" className="relative w-full overflow-hidden bg-black px-5 py-16 md:px-10 lg:px-12 lg:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
            Choose Your Class
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 md:text-lg">
            Start Chapter 1 as a Knight, Mage, or Archer before answering Elder Rowan&apos;s call.
          </p>
        </div>

        {/* Class Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
          {CLASSES.map((classData) => (
            <div
              key={classData.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 ${classData.cardBorder} bg-gradient-to-b from-white/5 to-transparent p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl`}
            >
              {/* Character Image */}
              <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={classData.image}
                  alt={classData.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Class Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block rounded-full ${classData.badgeColor} px-4 py-1.5 text-sm font-black tracking-wide text-white`}
                >
                  {classData.name.toUpperCase()}
                </span>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-white/35">
                  {classData.role}
                </p>
              </div>

              {/* Class Name (Mobile) */}
              <h3 className="mb-3 text-2xl font-black tracking-tight text-white md:hidden">
                {classData.name}
              </h3>

              {/* Description */}
              <p className="mb-6 flex-1 text-base leading-relaxed text-white/70">
                {classData.description}
              </p>

              {/* Choose Button */}
              <Button
                variant="custom"
                rounded="xl"
                fullWidth
                className={`${classData.buttonBg} tracking-wide`}
              >
                Start as {classData.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
