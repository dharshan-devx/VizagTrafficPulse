import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useChartData } from "@/hooks/use-traffic-data";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CongestionPieChart,
  HourlyTrendsChart,
  DailyTrendsChart,
  AccidentHotspotsChart,
  FatalityHotspotsChart,
  VehicleFlowChart,
  HeatmapChart,
  MLPerformanceChart
} from "@/components/interactive-charts";

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  chartId: string;
  description: string;
  insights?: string[];
}

function getChartComponent(chartId: string, data: any[]) {
  const chartProps = { data, chartType: chartId };

  switch (chartId) {
    case 'congestion':
      return <CongestionPieChart {...chartProps} />;
    case 'hourly':
      return <HourlyTrendsChart {...chartProps} />;
    case 'daily':
      return <DailyTrendsChart {...chartProps} />;
    case 'accidents':
      return <AccidentHotspotsChart {...chartProps} />;
    case 'fatalities':
      return <FatalityHotspotsChart {...chartProps} />;
    case 'vehicle':
      return <VehicleFlowChart {...chartProps} />;
    case 'heatmap':
      return <HeatmapChart {...chartProps} />;
    case 'ml':
      return <MLPerformanceChart {...chartProps} />;
    default:
      return (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          <p>Chart type not supported: {chartId}</p>
        </div>
      );
  }
}

export default function ChartModal({
  isOpen,
  onClose,
  title,
  icon,
  chartId,
  description,
  insights = []
}: ChartModalProps) {
  const { data: chartData, isLoading, error } = useChartData(chartId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modern-chart-modal max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="modern-chart-header flex justify-between items-center">
          <DialogTitle className="modern-chart-title flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Interactive chart showing {title.toLowerCase()} data visualization
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-white/20 rounded-full"
            data-testid="modal-close-button"
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>

        <div className="modern-chart-content space-y-6">
          <div className="bg-white rounded-lg p-6 border border-white/20 shadow-lg">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ) : error ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <p>Failed to load chart data. Please try again.</p>
              </div>
            ) : chartData && Array.isArray(chartData) && chartData.length > 0 ? (
              getChartComponent(chartId, chartData)
            ) : (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                <p>No data available for this chart</p>
              </div>
            )}
          </div>

          <div className="modern-chart-description">
            <p>{description}</p>
          </div>

          {insights.length > 0 && (
            <div className="modern-chart-insights">
              <h4>Key Insights:</h4>
              <ul>
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
