import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import WorldSection from "@/components/sections/FeatureSection";
import ClassSection from "@/components/sections/ClassSection";


export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <HeroSection />
      <AboutSection />
      <WorldSection />
      <ClassSection />
    </div>
  );
}
