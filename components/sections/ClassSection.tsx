import Image from "next/image";
import Link from "next/link";
import { CLASSES } from "@/lib/data/classes";
import SectionHeading from "@/components/ui/SectionHeading";
import Panel from "@/components/ui/Panel";

const FAN_ANGLES = [-9, 3, 12];

// Renders the class section reusable UI component.
// Features: applies customizable style variants and responsive CSS classes.
// Returns the styled JSX element.
export default function ClassSection() {
  return (
    <section id="classes" className="relative w-full px-5 py-16 md:px-10 lg:px-12 lg:py-24">
      <div className="pixel-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          className="mb-16"
          eyebrow="Pick Your Path"
          title="Choose Your Class"
          subtitle="Wake in the Elf Forest as a Knight, Mage, or Archer — then answer Elder Rowan's call."
        />

        <div className="class-fan grid gap-8 md:grid-cols-3 lg:gap-10">
          {CLASSES.map((c, i) => (
            <Panel
              key={c.id}
              material="wood"
              style={{ "--r": FAN_ANGLES[i] ?? 0 } as React.CSSProperties}
              className="group relative flex flex-col transition-colors hover:border-accent"
            >
              <div className={`flex items-center justify-between border-b-2 border-black/60 ${c.accent} px-4 py-2.5`}>
                <span className={`text-sm font-black uppercase tracking-widest ${c.accentText}`}>
                  {c.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-parchment-dim">
                  {c.role}
                </span>
              </div>

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
