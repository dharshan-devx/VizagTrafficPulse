import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ProblemSection from "@/components/problem-section";
import MethodologySection from "@/components/methodology-section";
import KeyIndicators from "@/components/key-indicators";
import RealTimeIndicator from "@/components/real-time-indicator";
import ResultsSection from "@/components/results-section";
import ImpactSection from "@/components/impact-section";
import FutureSection from "@/components/future-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProblemSection />
      <MethodologySection />
      <KeyIndicators />
      <RealTimeIndicator />
      <ResultsSection />
      <ImpactSection />
      <FutureSection />
      <Footer />
    </div>
  );
}
