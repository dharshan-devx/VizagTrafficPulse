import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChartModal from "@/components/chart-modal";

export default function ResultsSection() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const charts = [
    {
      id: "congestion",
      title: "📊 Congestion Distribution",
      description: "Citywide congestion level breakdown",
      color: "primary",
      modalDescription: "This pie chart visualization shows the overall distribution of congestion levels across Visakhapatnam. The analysis reveals traffic patterns categorized into Low (Green), Medium (Yellow), and High (Red) congestion zones. This breakdown helps identify the proportion of city areas experiencing different levels of traffic intensity, enabling targeted resource allocation and infrastructure planning.",
    },
    {
      id: "hourly",
      title: "⏰ Hourly Trends", 
      description: "Peak hour traffic patterns",
      color: "secondary",
      modalDescription: "This stacked bar chart demonstrates traffic congestion patterns throughout a 24-hour cycle. Peak hours typically occur during morning (8-10 AM) and evening (6-8 PM) rush periods, showing maximum red zone congestion. The visualization helps identify optimal travel times and supports traffic signal optimization strategies for different hours of the day.",
    },
    {
      id: "daily",
      title: "📈 Daily Trends",
      description: "Day-wise congestion analysis", 
      color: "accent",
      modalDescription: "The daily trend analysis shows average congestion scores across different days, revealing patterns in weekday versus weekend traffic. Typically, weekdays show higher congestion due to commuter traffic, while weekends may have different patterns based on recreational activities. This data supports long-term planning and resource scheduling.",
    },
    {
      id: "heatmap",
      title: "🔥 Heatmap",
      description: "Location-based intensity visualization",
      color: "primary", 
      modalDescription: "This heatmap visualization displays congestion intensity across different locations and hours, providing a comprehensive view of when and where traffic congestion peaks. Darker areas indicate higher congestion levels, helping identify critical intersection points and time-location combinations that require immediate attention from traffic management authorities.",
    },
    {
      id: "accidents",
      title: "🚨 Accident Hotspots",
      description: "High-risk accident locations",
      color: "secondary",
      modalDescription: "This bar chart identifies the top 10 accident-prone locations in Visakhapatnam, ranked by total number of reported incidents. These hotspots require immediate safety interventions such as improved signage, speed bumps, better lighting, or traffic signal optimization. The data guides priority setting for safety infrastructure investments.",
    },
    {
      id: "fatalities",
      title: "☠️ Fatality Hotspots",
      description: "Critical safety concern areas",
      color: "accent",
      modalDescription: "This critical analysis highlights locations with the highest fatality rates, representing the most dangerous areas requiring urgent safety measures. These locations demand comprehensive safety audits, emergency response system improvements, and potentially major infrastructure redesigns to prevent future casualties and protect public safety.",
    },
    {
      id: "vehicle",
      title: "🚗 Vehicle Flow",
      description: "Traffic flow pattern analysis",
      color: "primary",
      modalDescription: "This scatter plot analysis examines the relationship between queue density (vehicles waiting) and stop density (vehicles stopped) across different congestion levels. The visualization helps understand traffic flow dynamics and identifies patterns that indicate efficient versus problematic traffic conditions, supporting optimization of traffic signal timing.",
    },
    {
      id: "ml", 
      title: "🤖 ML Performance",
      description: "Machine learning model evaluation",
      color: "secondary",
      modalDescription: "This comparison chart evaluates the performance of three machine learning models: Linear Regression, Decision Tree, and Random Forest. Metrics include RMSE (Root Mean Square Error) and R² scores to determine prediction accuracy. Random Forest typically shows the best performance for traffic prediction due to its ability to handle complex patterns and feature interactions.",
      insights: [
        "Random Forest: Highest accuracy for congestion prediction",
        "Decision Tree: Good interpretability for policy makers", 
        "Linear Regression: Baseline model for comparison"
      ]
    },
  ];

  const selectedChartData = charts.find(chart => chart.id === selectedChart);

  return (
    <section id="results" className="py-20 modern-results-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 gradient-text-purple" data-testid="results-title">Results Showcase</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="results-description">
              Comprehensive analysis results from our traffic prediction dashboard with interactive visualizations and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {charts.map((chart, index) => (
              <Card
                key={chart.id}
                className="modern-results-card p-6 rounded-2xl cursor-pointer min-h-[280px] flex flex-col justify-between"
                onClick={() => setSelectedChart(chart.id)}
                data-testid={`chart-card-${chart.id}`}
              >
                <CardContent className="p-0">
                  <div className={`aspect-video bg-gradient-to-br from-${chart.color}/10 to-${chart.color}/5 rounded-xl mb-6 flex items-center justify-center shadow-lg`}>
                    <div className="text-center">
                      <span className={`text-${chart.color} text-5xl mb-3 block transition-transform duration-300 hover:scale-110`}>
                        {chart.title.split(' ')[0]}
                      </span>
                      <p className="text-sm text-muted-foreground font-medium">{chart.title.substring(2)}</p>
                    </div>
                  </div>
                  <h3 className={`text-xl font-bold mb-3 text-${chart.color} transition-colors duration-300`} data-testid={`chart-title-${chart.id}`}>
                    {chart.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed" data-testid={`chart-description-${chart.id}`}>
                    {chart.description}
                  </p>
                  <Button
                    variant="link"
                    className={`text-${chart.color} hover:text-${chart.color}/80 text-sm font-semibold p-0 transition-all duration-300 hover:translate-x-1`}
                    data-testid={`chart-read-more-${chart.id}`}
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {selectedChartData && (
        <ChartModal
          isOpen={selectedChart !== null}
          onClose={() => setSelectedChart(null)}
          title={selectedChartData.title}
          icon={selectedChartData.title.split(' ')[0]}
          chartId={selectedChartData.id}
          description={selectedChartData.modalDescription}
          insights={selectedChartData.insights}
        />
      )}
    </section>
  );
}
