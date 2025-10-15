import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useKeyIndicators, useLoadCSV } from "@/hooks/use-traffic-data";
import { Loader2, RefreshCw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CSVUpload from "./csv-upload";

export default function KeyIndicators() {
  const { data: indicators, isLoading, error } = useKeyIndicators();
  const loadCSVMutation = useLoadCSV();
  const hasAttemptedAutoLoad = useRef(false);
  const [showUpload, setShowUpload] = useState(false);

  // Auto-load CSV data on mount if no data exists (one-shot with guards)
  useEffect(() => {
    // Guard against multiple attempts
    if (hasAttemptedAutoLoad.current) return;

    // Don't auto-load if still loading, mutation pending, or there's an error
    if (isLoading || loadCSVMutation.isPending || error) return;

    // Only auto-load if indicators are truly missing or empty
    if (!indicators || (indicators.totalAccidents === 0 && indicators.totalFatalities === 0)) {
      hasAttemptedAutoLoad.current = true;
      loadCSVMutation.mutate();
    }
  }, [isLoading, indicators, error, loadCSVMutation.isPending]);

  const handleLoadData = () => {
    loadCSVMutation.mutate();
  };

  if (isLoading) {
    return (
      <section id="indicators" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading traffic data...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="indicators" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load traffic indicators</p>
            <Button onClick={handleLoadData} disabled={loadCSVMutation.isPending}>
              {loadCSVMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Retry Loading Data
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Color mapping for proper Tailwind generation
  const colorMap = {
    accent: {
      border: "border-accent/20 hover:border-accent/40",
      bg: "bg-accent/20",
      text: "text-accent"
    },
    primary: {
      border: "border-primary/20 hover:border-primary/40",
      bg: "bg-primary/20",
      text: "text-primary"
    },
    secondary: {
      border: "border-secondary/20 hover:border-secondary/40",
      bg: "bg-secondary/20",
      text: "text-secondary"
    }
  };

  const indicatorCards = [
    {
      icon: "🚨",
      title: "Total Accidents",
      value: indicators?.totalAccidents?.toLocaleString() || "0",
      description: "Reported incidents across all locations and timeframes",
      color: "accent" as keyof typeof colorMap,
    },
    {
      icon: "☠️",
      title: "Total Fatalities",
      value: indicators?.totalFatalities?.toLocaleString() || "0",
      description: "Lives lost due to traffic incidents",
      color: "primary" as keyof typeof colorMap,
    },
    {
      icon: "🚦",
      title: "Avg Congestion Score",
      value: indicators?.avgCongestion?.toFixed(2) || "0.00",
      description: "Normalized congestion level (0-1 scale)",
      color: "secondary" as keyof typeof colorMap,
    },
  ];

  return (
    <section id="indicators" className="py-20 modern-indicators-bg relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6 text-primary" data-testid="indicators-title">Key Indicators</h2>
            <p className="text-xl text-muted-foreground" data-testid="indicators-description">
              Critical traffic statistics computed from comprehensive data analysis
            </p>
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowUpload(!showUpload)}
                  className="modern-action-button-primary px-8 py-3 rounded-xl font-semibold text-lg"
                  data-testid="button-toggle-upload"
                >
                  <Upload className="w-5 h-5 mr-3" />
                  Upload CSV File
                </Button>

                <Button
                  onClick={handleLoadData}
                  disabled={loadCSVMutation.isPending}
                  className="modern-action-button-secondary px-8 py-3 rounded-xl font-semibold text-lg"
                  data-testid="button-load-data"
                >
                  {loadCSVMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      Processing CSV Data...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3" />
                      Load Sample Data
                    </>
                  )}
                </Button>
              </div>

              {/* CSV Upload Component */}
              {showUpload && (
                <div className="mt-8">
                  <CSVUpload />
                </div>
              )}

              {/* Show error message if loading failed */}
              {loadCSVMutation.isError && (
                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm font-medium">
                    ❌ Failed to load CSV: {loadCSVMutation.error instanceof Error ? loadCSVMutation.error.message : "Unknown error"}
                  </p>
                </div>
              )}

              {/* Show success message */}
              {loadCSVMutation.isSuccess && !loadCSVMutation.isPending && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                    ✅ CSV data loaded successfully! Data has been refreshed.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {indicatorCards.map((card, index) => (
              <Card
                key={index}
                className={`modern-indicator-card-${index + 1} p-8 rounded-2xl min-h-[320px] flex flex-col justify-center`}
                data-testid={`indicator-card-${index}`}
              >
                <CardContent className="p-0">
                  <div className="text-center">
                    <div className={`modern-indicator-icon-${index + 1} w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}>
                      <span className="text-4xl">{card.icon}</span>
                    </div>
                    <h3 className={`text-4xl font-black mb-3 ${colorMap[card.color].text} transition-colors duration-300`} data-testid={`indicator-value-${index}`}>
                      {card.value}
                    </h3>
                    <p className={`text-xl font-bold mb-4 ${colorMap[card.color].text} transition-colors duration-300`} data-testid={`indicator-title-${index}`}>
                      {card.title}
                    </p>
                    <p className="text-muted-foreground leading-relaxed" data-testid={`indicator-description-${index}`}>
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
