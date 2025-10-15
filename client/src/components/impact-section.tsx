import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Shield, Route, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ImpactSection() {
  const impacts = [
    {
      icon: MapPin,
      title: "Resource Optimization",
      description: "Identifies congestion-prone areas and times, helping authorities deploy resources efficiently and reduce response times.",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Safety Improvements", 
      description: "Highlights accident and fatality hotspots to guide safety improvements and infrastructure development priorities.",
      color: "secondary",
    },
    {
      icon: Route,
      title: "Commuter Assistance",
      description: "Assists commuters in planning their routes to avoid heavy traffic and reduce travel time effectively.",
      color: "accent",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Policy",
      description: "Supports data-driven policy making for infrastructure development and urban planning decisions.",
      color: "primary",
    },
  ];

  const metrics = [
    { label: "Traffic Efficiency", value: 35, color: "primary" },
    { label: "Accident Prediction", value: 78, color: "secondary" },
    { label: "Resource Utilization", value: 52, color: "accent" },
  ];

  return (
    <section id="impact" className="py-20 modern-impact-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 text-accent" data-testid="impact-title">Project Impact</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="impact-description">
              Demonstrating the real-world benefits and applications of our traffic prediction system.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              {impacts.map((impact, index) => {
                const IconComponent = impact.icon;
                return (
                  <Card key={index} className="modern-impact-card p-6 rounded-2xl" data-testid={`impact-card-${index}`}>
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-${impact.color}/20 to-${impact.color}/10 flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 hover:scale-110`}>
                          <IconComponent className={`text-${impact.color} w-7 h-7`} />
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-3 text-${impact.color} transition-colors duration-300`} data-testid={`impact-title-${index}`}>
                            {impact.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed" data-testid={`impact-description-${index}`}>
                            {impact.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="relative">
              <Card className="modern-metrics-card p-8 rounded-2xl relative overflow-hidden">
                <CardContent className="p-0 relative z-10">
                  <h3 className="text-2xl font-bold mb-8 text-center text-primary" data-testid="metrics-title">Impact Metrics</h3>
                  <div className="space-y-8">
                    {metrics.map((metric, index) => (
                      <div key={index} data-testid={`metric-${index}`} className="transition-all duration-300 hover:scale-105">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-muted-foreground font-medium" data-testid={`metric-label-${index}`}>{metric.label}</span>
                          <span className={`text-${metric.color} font-bold text-lg`} data-testid={`metric-value-${index}`}>+{metric.value}%</span>
                        </div>
                        <Progress 
                          value={metric.value} 
                          className="w-full h-3 rounded-full"
                          data-testid={`metric-progress-${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
