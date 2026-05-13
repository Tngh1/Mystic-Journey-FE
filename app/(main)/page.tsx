import Header from "@/components/ui/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import GameplayFeatures from "@/components/sections/FeatureSection";
import ClassSection from "@/components/sections/ClassSection";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <HeroSection />
      <AboutSection />
      <GameplayFeatures />
      <ClassSection />
      <Footer />
    </div>
  );
}
