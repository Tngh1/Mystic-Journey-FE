"use client";

import { useState, useEffect } from "react";
import { BookOpen, ChevronRight, Sparkles, Shield, Swords, Crown, Ghost, Scroll, Star } from "lucide-react";

interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  icon: React.ReactNode;
  bgGradient: string;
}

export default function StoryPage() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isVisible, setIsVisible] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(0);
    const timer = setTimeout(() => setIsVisible(null), 100);
    return () => clearTimeout(timer);
  }, []);

  const chapters: StoryChapter[] = [
    {
      id: 1,
      title: "The Beginning",
      subtitle: "Where it all started",
      content: `In the ancient realm of Eldoria, a devastating war tore the world apart. The Great Cataclysm, as it came to be known, shattered the continent into floating islands, leaving behind remnants of a once-great civilization.\n\nFrom the ashes of the old world, a new era emerged. Survivors gathered in small communities, struggling to rebuild what was lost. But deep within the fractured lands, ancient powers stirred, waiting to be discovered by those brave enough to seek them.`,
      icon: <Scroll className="w-8 h-8" />,
      bgGradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      id: 2,
      title: "The Mystic Forces",
      subtitle: "Power awakens",
      content: `The Cataclysm did more than destroy - it awakened the Mystic Forces that lay dormant beneath the earth's surface. These ethereal energies manifested as crystals scattered across Eldoria, granting extraordinary abilities to those who could harness them.\n\nAdventurers began to appear, individuals with unique talents drawn to the crystals' power. They formed guilds, explored ruins, and battled creatures twisted by the unstable energies. The age of Mystics had begun, bringing both hope and danger to the fractured world.`,
      icon: <Sparkles className="w-8 h-8" />,
      bgGradient: "from-purple-500/20 to-violet-500/20",
    },
    {
      id: 3,
      title: "The Ancient Guardians",
      subtitle: "Protectors of balance",
      content: `Long before the Cataclysm, the Ancient Guardians were created to maintain balance between the physical and mystical realms. These legendary beings, part spirit and part construct, slumber deep within sacred temples scattered across Eldoria.\n\nNow, as darkness rises and corrupt forces threaten to consume the world, the Guardians stir once more. To awaken them fully, brave souls must prove their worth by collecting the scattered Guardian Fragments - pieces of their ancient power hidden throughout the land.`,
      icon: <Shield className="w-8 h-8" />,
      bgGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      id: 4,
      title: "The Dark Invasion",
      subtitle: "Shadows emerge",
      content: `The Void Realm, a dimension of endless darkness, has long been sealed away from Eldoria. But the Cataclysm weakened the barriers between worlds, allowing sinister entities to slip through.\n\nThe Voidborn - creatures born of pure darkness - have begun their invasion. They corrupt everything they touch, transforming land into barren wasteland and creatures into twisted monstrosities. The Mystics and Guardians must unite or face total annihilation.`,
      icon: <Ghost className="w-8 h-8" />,
      bgGradient: "from-red-500/20 to-rose-500/20",
    },
    {
      id: 5,
      title: "The Chosen Hero",
      subtitle: "Destiny awaits",
      content: `Prophecy speaks of a chosen one who will rise in the darkest hour. An adventurer of extraordinary potential, marked by fate to wield the combined power of the Mystic Crystals and Guardian Fragments.\n\nThis hero will journey through treacherous dungeons, battle fearsome monsters, and forge alliances with powerful factions. Their quest: to seal the Void Portal, defeat the Void Lord, and restore peace to Eldoria once more.\n\nThe question remains: Will you answer the call and become the hero of legend?`,
      icon: <Crown className="w-8 h-8" />,
      bgGradient: "from-yellow-500/20 to-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffc032]/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/patterns/mystical.svg')] opacity-5"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ffc032]/20 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-[#ffc032]" />
              <span className="text-[#ffc032] font-medium">Epic Tale</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              The Chronicles of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc032] to-[#ca831f]">
                Eldoria
              </span>
            </h1>
            
            <p className="text-white/70 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the epic tale of a fractured world, ancient guardians, and the heroes who rise against the encroaching darkness
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveChapter(0)}
                className="flex items-center gap-2 px-6 py-3 bg-[#ffc032] text-black font-semibold rounded-xl hover:bg-[#ffc032]/90 transition-all duration-300 shadow-lg shadow-[#ffc032]/20 cursor-pointer"
              >
                <BookOpen className="w-5 h-5" />
                Begin the Journey
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("chapters");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 cursor-pointer"
              >
                <Scroll className="w-5 h-5" />
                Read Chapters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Navigation */}
      <div id="chapters" className="container mx-auto px-4 py-8">
        {/* Chapter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => setActiveChapter(index)}
              className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                activeChapter === index
                  ? "bg-[#ffc032] text-black shadow-lg shadow-[#ffc032]/20"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              <span className={`${activeChapter === index ? "" : "text-[#ffc032]"}`}>
                {chapter.icon}
              </span>
              <span className="hidden sm:inline">{chapter.title}</span>
              <span className="sm:hidden">Ch. {chapter.id}</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Background Decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#ffc032]/5 to-transparent blur-2xl"></div>
            
            {/* Chapter Card */}
            <div className={`relative bg-gradient-to-br ${chapters[activeChapter].bgGradient} border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm transition-all duration-500`}>
              {/* Chapter Number */}
              <div className="absolute -top-6 left-8">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-xl">
                  <span className="text-[#ffc032] font-bold text-sm">CHAPTER</span>
                  <span className="text-3xl font-bold text-white">{chapters[activeChapter].id}</span>
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Previous Chapter
                </button>

                <div className="flex items-center gap-2">
                  {chapters.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChapter(idx)}
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#ffc032] hover:bg-[#ffc032]/90 text-black font-medium rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next Chapter
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Your Adventure Awaits</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Embark on an unforgettable journey through the world of Eldoria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Swords className="w-8 h-8" />}
            title="Epic Battles"
            description="Engage in thrilling combat with diverse enemies and bosses across challenging dungeons"
            gradient="from-red-500/20 to-orange-500/20"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Guardian Alliance"
            description="Unite with legendary guardians to unlock powerful abilities and protect the realm"
            gradient="from-blue-500/20 to-cyan-500/20"
          />
          <FeatureCard
            icon={<Star className="w-8 h-8" />}
            title="Mystic Power"
            description="Harness the ancient mystic forces and become the hero of legend"
            gradient="from-purple-500/20 to-pink-500/20"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#ffc032]/20 via-[#ffc032]/10 to-[#ffc032]/20 border border-[#ffc032]/30 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/patterns/stars.svg')] opacity-10"></div>
          <div className="relative z-10">
            <Crown className="w-16 h-16 text-[#ffc032] mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Legend?</h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              The world of Eldoria awaits its hero. Will you answer the call and write your own chapter in this epic tale?
            </p>
            <button className="px-8 py-4 bg-[#ffc032] text-black font-bold text-lg rounded-xl hover:bg-[#ffc032]/90 transition-all duration-300 shadow-lg shadow-[#ffc032]/20 cursor-pointer">
              Start Your Journey Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className={`group bg-gradient-to-br ${gradient} border border-white/10 rounded-2xl p-6 hover:border-[#ffc032]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#ffc032]/5`}>
      <div className="text-[#ffc032] mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
