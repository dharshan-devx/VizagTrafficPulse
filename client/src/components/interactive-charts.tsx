import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

interface ChartProps {
  data: any[];
  chartType: string;
}

export function CongestionPieChart({ data }: ChartProps) {
  const chartConfig = {
    value: {
      label: "Count",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]" data-testid="chart-congestion-pie">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  );
}

export function HourlyTrendsChart({ data }: ChartProps) {
  const chartConfig = {
    low: {
      label: "Low Congestion",
      color: "#10B981", // New Emerald green
    },
    medium: {
      label: "Medium Congestion", 
      color: "#F59E0B", // New Amber yellow  
    },
    high: {
      label: "High Congestion",
      color: "#EF4444", // New Rose red
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]" data-testid="chart-hourly-trends">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="low" stackId="a" fill="#10B981" />
        <Bar dataKey="medium" stackId="a" fill="#F59E0B" />
        <Bar dataKey="high" stackId="a" fill="#EF4444" />
      </BarChart>
    </ChartContainer>
  );
}

export function DailyTrendsChart({ data }: ChartProps) {
  const chartConfig = {
    avgCongestion: {
      label: "Average Congestion",
      color: "#0EA5E9", // New Ocean blue from chart colors
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]" data-testid="chart-daily-trends">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line 
          type="monotone" 
          dataKey="avgCongestion" 
          stroke="#0EA5E9" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function AccidentHotspotsChart({ data }: ChartProps) {
  const chartConfig = {
    accidents: {
      label: "Accidents",
      color: "#EF4444", // New Rose red
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]" data-testid="chart-accident-hotspots">
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 'dataMax']} allowDecimals={false} />
        <YAxis 
          dataKey="location" 
          type="category" 
          width={150}
          tick={{ fontSize: 12 }}
          interval={0}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="accidents" fill="#EF4444" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export function FatalityHotspotsChart({ data }: ChartProps) {
  const chartConfig = {
    fatalities: {
      label: "Fatalities",
      color: "#DC2626", // Darker red for fatalities
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]" data-testid="chart-fatality-hotspots">
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 'dataMax']} allowDecimals={false} />
        <YAxis 
          dataKey="location" 
          type="category" 
          width={150}
          tick={{ fontSize: 12 }}
          interval={0}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="fatalities" fill="#DC2626" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export function VehicleFlowChart({ data }: ChartProps) {
  const chartConfig = {
    queueDensity: {
      label: "Queue Density",
      color: "#8B5CF6", // New Purple from chart colors
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <ScatterChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="queueDensity" name="Queue Density" />
        <YAxis dataKey="stopDensity" name="Stop Density" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Scatter 
          data={data} 
          fill="#8B5CF6"
        />
      </ScatterChart>
    </ChartContainer>
  );
}

export function HeatmapChart({ data }: ChartProps) {
  // For heatmap, we'll use a simplified grid representation
  const locations = Array.from(new Set(data.map(d => d.location)));
  const hours = Array.from(new Set(data.map(d => d.hour))).sort((a, b) => a - b);
  
  const chartConfig = {
    value: {
      label: "Congestion Level",
      color: "#EF4444", // New Rose red
    },
  };

  // Convert data to grid format for better visualization
  const gridData = hours.map(hour => {
    const hourData: any = { hour };
    locations.forEach(location => {
      const point = data.find(d => d.location === location && d.hour === hour);
      hourData[location] = point ? parseFloat(point.value) : 0;
    });
    return hourData;
  });

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <BarChart data={gridData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        {locations.slice(0, 5).map((location, index) => (
          <Bar 
            key={location}
            dataKey={location} 
            fill={`hsl(${index * 60}, 70%, 50%)`}
            stackId="heatmap"
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

export function MLPerformanceChart({ data }: ChartProps) {
  const chartConfig = {
    rmse: {
      label: "RMSE",
      color: "#EF4444", // New Rose red
    },
    r2: {
      label: "R² Score",
      color: "#10B981", // New Emerald green
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="model" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="rmse" fill="#EF4444" />
        <Bar dataKey="r2" fill="#10B981" />
      </BarChart>
    </ChartContainer>
  );
}