import { Swords, Sparkles, TreePine } from "lucide-react";

const ABOUT_CONTENT = {
  eyebrow: "The Legend Begins",
  title: "About Mystic Journey",
  lead:
    "Embark on an epic fantasy adventure — a turn-based RPG where heroes rise to protect a world threatened by shadows.",
  body:
    "Begin your legend in Chapter 1: the Enchanted Forest, where Elder Rowan calls upon brave warriors to investigate the dark corruption spreading through the ancient woods. Choose your class, master your skills, and uncover the secrets of a mystical realm.",
};

const PILLARS = [
  {
    icon: Swords,
    title: "Turn-Based Combat",
    text: "Command your hero with tactical, skill-driven battles against corrupted forest creatures.",
  },
  {
    icon: TreePine,
    title: "A Living World",
    text: "Explore four legendary realms, each with its own monsters, secrets, and stories.",
  },
  {
    icon: Sparkles,
    title: "Rise as a Legend",
    text: "Pick from three distinct classes and grow from a lone warrior into a realm's champion.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative w-full overflow-hidden bg-black px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(90%,720px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Eyebrow */}
        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
          <span className="text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
            {ABOUT_CONTENT.eyebrow}
          </span>
          <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
        </div>

        {/* Title */}
        <h2 className="text-center text-4xl font-bold leading-none tracking-[0.02em] text-white sm:text-5xl lg:text-6xl">
          {ABOUT_CONTENT.title}
        </h2>

        {/* Lead line */}
        <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
          {ABOUT_CONTENT.lead}
        </p>

        {/* Body */}
        <p className="mx-auto mt-4 max-w-3xl px-2 text-center text-base leading-[1.9] tracking-wide text-white/60 sm:text-lg">
          {ABOUT_CONTENT.body}
        </p>

        {/* Feature pillars */}
        <div className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#ffc032]/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc032]/10 text-[#ffc032] transition-colors group-hover:bg-[#ffc032]/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{pillar.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
