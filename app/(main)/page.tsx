import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorldSection from "@/components/sections/FeatureSection";
import ClassSection from "@/components/sections/ClassSection";
import Reveal from "@/components/ui/Reveal";


export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />

      {/* Each section owns its own gutters and max-width, so no shared
          container here — nesting them inside `container mx-auto` double-padded
          the content and shrank the full-bleed section backgrounds. */}
      <Reveal>
        <AboutSection />
      </Reveal>

      {/* Not wrapped in Reveal: its transform/will-change wrapper would become
          the containing block for this section's `lg:sticky` preview column. */}
      <WorldSection />

      <Reveal delay={60}>
        <ClassSection />
      </Reveal>
    </div>
  );
}
