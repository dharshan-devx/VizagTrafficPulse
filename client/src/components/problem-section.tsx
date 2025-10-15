import { Card, CardContent } from "@/components/ui/card";
import { Clock, ServerCrash, Haze, Search } from "lucide-react";

export default function ProblemSection() {
  const challenges = [
    {
      icon: Clock,
      title: "Travel Delays",
      description: "Significant delays for commuters and logistics operations affecting productivity and quality of life.",
      color: "accent",
    },
    {
      icon: ServerCrash,
      title: "Accidents & Fatalities",
      description: "Increased accident rates and road fatalities due to congested traffic conditions and poor visibility.",
      color: "primary",
    },
    {
      icon: Haze,
      title: "Environmental Impact",
      description: "Higher pollution levels from vehicle idling and increased fuel consumption during traffic jams.",
      color: "secondary",
    },
    {
      icon: Search,
      title: "Lack of Prediction",
      description: "No predictive systems to forecast traffic congestion or visualize it in real time for proactive measures.",
      color: "accent",
    },
  ];

  return (
    <section id="problem" className="py-20 modern-section-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 gradient-text-cyan" data-testid="problem-title">Traffic Challenges</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="problem-description">
              Visakhapatnam faces severe traffic congestion due to rapid urbanization, leading to multiple critical issues that need immediate attention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {challenges.map((challenge, index) => {
              const IconComponent = challenge.icon;
              return (
                <Card
                  key={index}
                  className="modern-challenge-card p-8 rounded-2xl"
                  data-testid={`challenge-card-${index}`}
                >
                  <CardContent className="p-0">
                    <div className="text-center">
                      <div className={`modern-icon-container w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-${challenge.color}/20 to-${challenge.color}/10 flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`text-${challenge.color} text-3xl w-8 h-8`} />
                      </div>
                      <h3 className={`text-xl font-bold mb-4 text-${challenge.color} transition-colors duration-300`} data-testid={`challenge-title-${index}`}>
                        {challenge.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed" data-testid={`challenge-description-${index}`}>
                        {challenge.description}
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
