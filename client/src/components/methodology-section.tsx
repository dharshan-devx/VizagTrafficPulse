import { Card, CardContent } from "@/components/ui/card";
import { Database, Fan, BarChart3, Bot, TrendingUp, Rocket } from "lucide-react";

export default function MethodologySection() {
  const steps = [
    {
      icon: Database,
      title: "Data Collection",
      description: "Synthetic dataset creation based on real traffic patterns and observations",
      color: "primary",
    },
    {
      icon: Fan,
      title: "Preprocessing",
      description: "Data cleaning, missing value handling, and feature engineering",
      color: "secondary",
    },
    {
      icon: BarChart3,
      title: "EDA",
      description: "Exploratory data analysis and pattern identification",
      color: "accent",
    },
    {
      icon: Bot,
      title: "Model Building",
      description: "Machine learning model training and optimization",
      color: "primary",
    },
    {
      icon: TrendingUp,
      title: "Visualization",
      description: "Interactive dashboard and chart creation",
      color: "secondary",
    },
    {
      icon: Rocket,
      title: "Deployment",
      description: "System deployment and stakeholder access",
      color: "accent",
    },
  ];

  return (
    <section id="methodology" className="py-20 modern-section-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 gradient-text-primary" data-testid="methodology-title">Methodology</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="methodology-description">
              Our systematic approach to traffic analysis and prediction using advanced data science techniques.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {steps.map((step, index) => {
                const IconComponent = step.icon;

                return (
                  <div key={index} className="relative">
                    <Card
                      className="modern-methodology-card p-8 rounded-2xl min-h-[280px] flex flex-col justify-center"
                      data-testid={`methodology-step-${index}`}
                    >
                      <CardContent className="p-0">
                        <div className="text-center">
                          <div className={`modern-methodology-icon w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-${step.color}/20 to-${step.color}/10 flex items-center justify-center shadow-lg`}>
                            <IconComponent className={`text-${step.color} text-3xl w-8 h-8`} />
                          </div>
                          <h3 className={`text-xl font-bold mb-4 text-${step.color} transition-colors duration-300`} data-testid={`step-title-${index}`}>
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed" data-testid={`step-description-${index}`}>
                            {step.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                );
              })}
            </div>

            {/* Flow indicator for mobile */}
            <div className="lg:hidden mt-8 text-center">
              <div className="inline-flex items-center space-x-2 text-muted-foreground">
                <span className="text-sm">Process Flow</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
