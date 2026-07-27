import Image from "next/image";
import Link from "next/link";
import { CLASSES } from "@/lib/data/classes";
import SectionHeading from "@/components/ui/SectionHeading";
import Panel from "@/components/ui/Panel";

/* Rest angles for the dealt-hand layout, left to right. Small on purpose — the
   card has to stay readable before you hover it. */
const FAN_ANGLES = [-9, 3, 12];

/* The landing page pitches the three paths; it does not balance them. Stat lines
   live on /wiki/classes/[id], which reads them from the same class-configs table
   the game creates characters from — so there is one place for numbers to be
   right, and this section has no fetch, no skeleton and no loading state. */
export default function ClassSection() {
  /* No background fill on the section: the body's night sky shows through here.
     Overflow stays visible so a tilted card in the fan isn't clipped. */
  return (
    <section id="classes" className="relative w-full px-5 py-16 md:px-10 lg:px-12 lg:py-24">
      {/* Dungeon-tile texture (shared .pixel-grid utility) */}
      <div className="pixel-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          className="mb-16"
          eyebrow="Pick Your Path"
          title="Choose Your Class"
          subtitle="Wake in the Elf Forest as a Knight, Mage, or Archer — then answer Elder Rowan's call."
        />

        {/* Class Cards — three frames dealt out like a hand of cards (.class-fan):
            overlapped and tilted at rest, straightening and spreading on hover
            or keyboard focus. On touch/narrow screens the utility is inert and
            this is a plain stacked grid, so nothing depends on hovering. */}
        <div className="class-fan grid gap-8 md:grid-cols-3 lg:gap-10">
          {CLASSES.map((c, i) => (
            <Panel
              key={c.id}
              material="wood"
              style={{ "--r": FAN_ANGLES[i] ?? 0 } as React.CSSProperties}
              className="group relative flex flex-col transition-colors hover:border-accent"
            >
              {/* Name plate — the class's heraldic cloth, hung across the top of
                  the frame. Ink is parchment on all three (≥7:1). */}
              <div className={`flex items-center justify-between border-b-2 border-black/60 ${c.accent} px-4 py-2.5`}>
                <span className={`text-sm font-black uppercase tracking-widest ${c.accentText}`}>
                  {c.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                  {c.role}
                </span>
              </div>

              {/* Character portrait, sunk into the frame like a painted panel. */}
              <div className="relative aspect-[3/4] w-full overflow-hidden border-y-2 border-black/50 bg-stone">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="pixelated object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="flex-1 text-sm leading-relaxed text-parchment-dim">
                  {c.description}
                </p>

                <Link
                  href={`/wiki/classes/${c.id}`}
                  className="pixel-press block w-full border-2 border-accent/50 px-4 py-3 text-center text-sm font-black uppercase tracking-widest text-accent shadow-md hover:border-accent hover:bg-accent hover:text-on-accent cursor-pointer"
                >
                  View {c.name} Details
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </section>
  );
}
