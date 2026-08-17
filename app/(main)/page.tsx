import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorldSection from "@/components/sections/FeatureSection";
import ClassSection from "@/components/sections/ClassSection";
import Reveal from "@/components/ui/Reveal";


// Renders the home view component.
// Returns the JSX element hierarchy for the page view.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />

      <Reveal>
        <AboutSection />
      </Reveal>

      <WorldSection />

      <Reveal delay={60}>
        <ClassSection />
      </Reveal>
    </div>
  );
}
