import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center gradient-bg">
      <div className="hero-particles"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-display mb-8 leading-tight text-shadow-glow" data-testid="hero-title">
            <span className="text-gradient-primary text-animated">Vizag</span><br />
            <span className="text-gradient-secondary text-animated">Traffic</span>
            <span className="text-gradient-primary text-animated">Pulse</span>
          </h1>
          <p className="text-2xl md:text-3xl font-heading text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed" data-testid="hero-subtitle">
            Predictive Dashboard for Urban Congestion in Visakhapatnam
          </p>
          <p className="text-lg md:text-xl font-body text-muted-foreground mb-16 max-w-3xl mx-auto" data-testid="hero-description">
            Leveraging machine learning and data analytics to analyze traffic patterns, predict congestion, and support data-driven urban planning decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-2xl mx-auto">
            <div className="modern-button-container">
              <Button
                onClick={() => scrollToSection("results")}
                className="px-10 py-5 modern-button-primary rounded-2xl font-semibold text-lg min-w-[200px] relative z-10 btn-magnetic neon-glow"
                data-testid="button-view-results"
              >
                <span className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                  View Results
                </span>
              </Button>
            </div>
            <div className="modern-button-container">
              <Button
                onClick={() => scrollToSection("about")}
                className="px-10 py-5 modern-button-secondary rounded-2xl font-semibold text-lg min-w-[200px] relative z-10 btn-magnetic neon-glow"
                data-testid="button-learn-more"
              >
                <span className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white rounded-full shadow-lg animate-pulse"></div>
                  Learn More
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
