"use client";

import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Trees, Leaf, Snowflake, Skull, MapPin, Crown, Star } from "lucide-react";

interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  location: string;
  level: string;
  content: string;
  icon: React.ReactNode;
  bgGradient: string;
}

export default function StoryPage() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isVisible, setIsVisible] = useState<number | null>(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(null), 100);
    return () => clearTimeout(timer);
  }, []);

  const chapters: StoryChapter[] = [
    {
      id: 1,
      title: "Whispers of the Elf Forest",
      subtitle: "Where the journey begins",
      location: "Elf Forest",
      level: "Lv. 1–20",
      content: `Long before the first adventurer set foot in Eldoria, the ancient trees of the Elf Forest stood watch over a hidden civilization. For centuries, the elves lived in harmony with the woodland spirits, tending to groves that hummed with quiet magic.\n\nBut a creeping corruption has begun to seep through the roots. Shadow Sprouts multiply in the undergrowth, twisting the land from within. Elder Rowan, keeper of the forest's memory, calls upon outsiders to aid the elves before the corruption devours everything they have built.\n\nYou begin your journey here — armed with nothing but a blade, a promise, and the will to listen to what the forest has to say.`,
      icon: <Trees className="w-8 h-8" />,
      bgGradient: "from-emerald-500/20 to-green-500/20",
    },
    {
      id: 2,
      title: "The Eternal Harvest",
      subtitle: "Autumn never ends",
      location: "Autumn Pumpkin",
      level: "Lv. 20–40",
      content: `Past the treeline lies a land caught in an endless autumn. Giant pumpkins swell beneath a Harvest Moon that refuses to set, and scarecrow golems patrol the sacred fields where ancient rituals once brought the harvest home.\n\nWhen those rituals were abandoned, the spirits they were meant to honor grew restless. Now they wander the Twilight Cemetery in silence, and a great Witch has taken the Pumpkin Citadel as her seat of power.\n\nYour road leads you into this cursed season — to lift the lantern maze's curse, appease the spirits, and confront the Witch before the eternal harvest swallows another traveler whole.`,
      icon: <Leaf className="w-8 h-8" />,
      bgGradient: "from-orange-500/20 to-amber-500/20",
    },
    {
      id: 3,
      title: "The Glacial Tundra",
      subtitle: "Where the cold remembers",
      location: "Frozen Mountains",
      level: "Lv. 40–60",
      content: `Northward, beyond the autumn haze, jagged peaks rise into a sky choked by unnatural blizzards. The Frozen Mountains have sealed their passes for generations, guarded by a creature of pure frost that cannot be reasoned with — only faced.\n\nLegends speak of a Glacier Titan dormant beneath the ice lake, and of an entire civilization frozen mid-stride, preserved in crystal-clear ice as if time itself had held its breath.\n\nTo push the story forward, you must brave Blizzard Pass, awaken the Aurora Shrine, and put an end to the cold that has imprisoned these peaks for far too long.`,
      icon: <Snowflake className="w-8 h-8" />,
      bgGradient: "from-sky-500/20 to-cyan-500/20",
    },
    {
      id: 4,
      title: "Vestige of an Era",
      subtitle: "The final chapter",
      location: "Vestige of an Era",
      level: "Lv. 60–80",
      content: `At the edge of the known world stand the crumbling remnants of a civilization consumed by time. Vine-covered plazas, toppled colossi, and automaton sentinels still patrol the ruins as if their makers might one day return.\n\nSomewhere deep within these ruins, the Nexus Core — a relic of impossible engineering — still ticks. It is said to be the heart of a golden age, and the answer to a single question: what catastrophe erased an entire era from history?\n\nThis is where your story reaches its final page. Awaken the Memory Hall, claim the Sky Platform, and breach the Nexus Core. Only then will the chronicle of Mystic Journey find its ending.`,
      icon: <Skull className="w-8 h-8" />,
      bgGradient: "from-violet-500/20 to-fuchsia-500/20",
    },
  ];

  return (
    <div className="min-h-screen pt-[88px] md:pt-[112px] pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(85%,680px)] -translate-x-1/2 rounded-full bg-[#ffc032]/10 blur-[130px]" />

        <div className="max-w-[1200px] mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-linear-to-r from-transparent to-[#ffc032]/60" />
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#ffc032]">
                <BookOpen className="w-3.5 h-3.5" />
                The Chronicle
              </span>
              <span className="h-px w-10 bg-linear-to-l from-transparent to-[#ffc032]/60" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              The Tale of{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ffc032] to-[#ca831f]">
                Mystic Journey
              </span>
            </h1>

            <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Four chapters, four realms. Follow the journey from the enchanted Elf Forest to the
              ancient ruins of a forgotten era.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveChapter(0)}
                className="flex items-center gap-2 px-6 py-3 bg-[#ffc032] text-[#111] font-semibold rounded-xl hover:bg-[#ffd04c] transition-all duration-300 shadow-lg shadow-[#ffc032]/20 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                Begin the Journey
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("chapters");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#111111] text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 cursor-pointer"
              >
                <MapPin className="w-5 h-5" />
                Read Chapters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div id="chapters" className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Chapter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(index)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                activeChapter === index
                  ? "bg-[#ffc032] text-[#111] shadow-lg shadow-[#ffc032]/20"
                  : "bg-[#111111] text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              <span className={`${activeChapter === index ? "" : "text-[#ffc032]"}`}>
                {chapter.icon}
              </span>
              <span className="hidden sm:inline">{chapter.location}</span>
              <span className="sm:hidden">Ch. {chapter.id}</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Background Decoration */}
            <div className="absolute -inset-4 bg-linear-to-r from-transparent via-[#ffc032]/5 to-transparent blur-2xl"></div>

            {/* Chapter Card */}
            <div className={`relative bg-linear-to-br ${chapters[activeChapter].bgGradient} border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm transition-all duration-500`}>
              {/* Chapter Number */}
              <div className="absolute -top-6 left-8">
                <div className="bg-[#111111] border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-xl">
                  <span className="text-[#ffc032] font-bold text-sm">CHAPTER</span>
                  <span className="text-3xl font-bold text-white">{chapters[activeChapter].id}</span>
                </div>
              </div>

              {/* Location badge */}
              <div className="absolute -top-6 right-8">
                <div className="bg-[#111111] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl">
                  <MapPin className="w-4 h-4 text-[#ffc032]" />
                  <span className="text-sm font-semibold text-white">{chapters[activeChapter].location}</span>
                </div>
              </div>

              {/* Chapter Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-xl">
                  <div className="text-[#ffc032]">
                    {chapters[activeChapter].icon}
                  </div>
                </div>
              </div>

              {/* Chapter Title */}
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {chapters[activeChapter].title}
                </h2>
                <p className="text-[#ffc032] text-lg">
                  {chapters[activeChapter].subtitle}
                </p>
              </div>

              {/* Chapter Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="text-white/80 leading-relaxed text-center">
                  {chapters[activeChapter].content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-6 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
                <button
                  onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                  disabled={activeChapter === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-white/10"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Previous Chapter
                </button>

                <div className="flex items-center gap-2">
                  {chapters.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChapter(idx)}
                      aria-label={`Go to chapter ${c.id}: ${c.location}`}
                      aria-current={activeChapter === idx ? "step" : undefined}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        activeChapter === idx
                          ? "bg-[#ffc032] w-8"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                  disabled={activeChapter === chapters.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffc032] hover:bg-[#ffd04c] text-[#111] font-medium rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next Chapter
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-[#ffc032]/20 via-[#ffc032]/10 to-[#ffc032]/20 border border-[#ffc032]/30 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
            <Crown className="w-16 h-16 text-[#ffc032] mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Every Map Tells a Story</h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Four chapters. Four realms. One chronicle. Step into each map to live the
              tale as it unfolds.
            </p>
            <a
              href="/wiki/maps"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ffc032] text-[#111] font-bold text-lg rounded-xl hover:bg-[#ffd04c] transition-all duration-300 shadow-lg shadow-[#ffc032]/20 cursor-pointer"
            >
              <MapPin className="w-5 h-5" />
              Explore the Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}