import { Card, CardContent } from "@/components/ui/card";
import { Satellite, CloudRain, Globe, Building, Route, Smartphone } from "lucide-react";

export default function FutureSection() {
  const enhancements = [
    {
      icon: Satellite,
      title: "Real-time Integration", 
      description: "Integrate real-time traffic feeds and IoT sensors for live data processing and instant predictions.",
      color: "primary",
    },
    {
      icon: CloudRain,
      title: "Weather Integration",
      description: "Incorporate weather and event data to improve prediction accuracy and account for external factors.",
      color: "secondary",
    },
    {
      icon: Globe,
      title: "Public Web App",
      description: "Deploy the dashboard as a live web application accessible to the public for real-time traffic insights.",
      color: "accent",
    },
    {
      icon: Building,
      title: "Multi-City Expansion",
      description: "Extend the system to other cities and create a comprehensive national traffic management network.",
      color: "primary",
    },
    {
      icon: Route,
      title: "Route Suggestions",
      description: "Add alternate route suggestions and live alerts for commuters to optimize their daily travel.",
      color: "secondary",
    },
    {
      icon: Smartphone,
      title: "Mobile Application",
      description: "Develop native mobile applications for Android and iOS with push notifications and offline features.",
      color: "accent",
    },
  ];

  return (
    <section id="future" className="py-20 modern-future-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 text-primary" data-testid="future-title">Future Enhancements</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="future-description">
              Planned improvements and expansions to enhance the traffic prediction system's capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enhancements.map((enhancement, index) => {
              const IconComponent = enhancement.icon;
              return (
                <Card
                  key={index}
                  className="modern-future-card p-8 rounded-2xl min-h-[280px] flex flex-col justify-center"
                  data-testid={`enhancement-card-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-${enhancement.color}/20 to-${enhancement.color}/10 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110`}>
                        <IconComponent className={`text-${enhancement.color} text-3xl w-8 h-8`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-4 text-${enhancement.color} transition-colors duration-300`} data-testid={`enhancement-title-${index}`}>
                        {enhancement.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`enhancement-description-${index}`}>
                        {enhancement.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
