import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorldSection from "@/components/sections/FeatureSection";
import ClassSection from "@/components/sections/ClassSection";
import Reveal from "@/components/ui/Reveal";


export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <HeroSection />
      <div className="container mx-auto w-full">
        <Reveal>
          <AboutSection />
        </Reveal>
        <WorldSection />
        <Reveal delay={80}>
          <ClassSection />
        </Reveal>
      </div>
    </div>
  );
}
