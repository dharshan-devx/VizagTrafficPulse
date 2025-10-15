import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
  const objectives = [
    { icon: "🚦", title: "Predict Congestion", color: "primary" },
    { icon: "🚨", title: "Identify Hotspots", color: "secondary" },
    { icon: "📊", title: "Interactive Dashboard", color: "accent" },
    { icon: "🏙", title: "Data-driven Planning", color: "primary" },
  ];

  return (
    <section id="about" className="py-20 modern-gradient-bg-1 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 gradient-text-blue" data-testid="about-title">About the Project</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed" data-testid="about-description">
              The rapid growth of Visakhapatnam has led to increasing numbers of vehicles on the road, creating frequent congestion, delays, and a rise in accidents. Traditional traffic control systems are reactive rather than predictive, making it difficult for commuters and city planners to take timely measures.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Card className="glass-card p-8 rounded-xl border border-primary/20">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-4 gradient-text-primary" data-testid="project-vision-title">Project Vision</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid="project-vision-description">
                    This project leverages Python-based data processing, statistical analysis, visualizations, and machine learning models to generate actionable insights. By consolidating these elements into a single interactive dashboard, the system aims to support data-driven decisions, improve traffic management efficiency, and ultimately reduce congestion and accident risks.
                  </p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {objectives.map((objective, index) => (
                  <Card
                    key={index}
                    className={`glass-card p-6 rounded-lg border border-${objective.color}/20 hover:border-${objective.color}/40 transition-all duration-300 transform hover:scale-105`}
                    data-testid={`objective-card-${index}`}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{objective.icon}</span>
                        <span className={`font-semibold text-${objective.color}`}>{objective.title}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="glass-card p-8 rounded-2xl border border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
                <CardContent className="p-0 relative z-10">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-car text-primary text-2xl animate-pulse"></i>
                    </div>
                    <div className="h-16 bg-secondary/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-traffic-light text-secondary text-2xl animate-pulse"></i>
                    </div>
                    <div className="h-16 bg-accent/20 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chart-line text-accent text-2xl animate-pulse"></i>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold mb-2" data-testid="analytics-title">Smart Traffic Analytics</h4>
                    <p className="text-muted-foreground" data-testid="analytics-description">Real-time data processing and predictive modeling</p>
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
