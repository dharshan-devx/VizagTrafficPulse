import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRealTimeTraffic } from "@/hooks/use-realtime-traffic";
import { Clock, Wifi, WifiOff, AlertTriangle, MapPin } from "lucide-react";

export default function RealTimeIndicator() {
  const {
    isConnected,
    lastUpdate,
    currentUpdates,
    recentAlerts,
    connectionError,
    getTopCongestionAreas,
    getTotalLiveAccidents
  } = useRealTimeTraffic();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <section className="py-12 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-primary" data-testid="realtime-title">
              🚦 Live Traffic Monitor
            </h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              {isConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-500" />
                  <Badge variant="secondary" className="bg-green-500/20 text-green-600">
                    Live Connected
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <Badge variant="destructive" className="bg-red-500/20 text-red-600">
                    {connectionError || 'Connecting...'}
                  </Badge>
                </>
              )}
              {lastUpdate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Last update: {formatTime(lastUpdate)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Statistics */}
            <Card className="glass-card" data-testid="live-stats-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-secondary">📊 Live Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Monitoring</span>
                    <Badge variant="outline">{currentUpdates.length} Locations</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Live Accidents</span>
                    <Badge variant={getTotalLiveAccidents() > 0 ? "destructive" : "secondary"}>
                      {getTotalLiveAccidents()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">High Congestion Areas</span>
                    <Badge variant="destructive">
                      {getTopCongestionAreas().filter(area => area.congestionLevel.includes('Red')).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Congestion Areas */}
            <Card className="glass-card" data-testid="congestion-areas-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-primary">🔥 Top Congestion Areas</h3>
                <div className="space-y-3">
                  {getTopCongestionAreas().map((area, index) => (
                    <div key={area.location} className="flex items-center justify-between p-2 rounded bg-muted/20">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{area.location}</span>
                      </div>
                      <Badge 
                        variant={area.congestionLevel.includes('Red') ? 'destructive' : 
                                area.congestionLevel.includes('Yellow') ? 'secondary' : 'outline'}
                      >
                        {(area.congestionScore * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
                  {getTopCongestionAreas().length === 0 && (
                    <p className="text-muted-foreground text-center">No live data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="glass-card" data-testid="alerts-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-destructive">🚨 Recent Alerts</h3>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={`${alert.location}-${alert.timestamp}`} className="p-3 rounded bg-muted/20 border-l-2 border-destructive">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.alert}</p>
                          <p className="text-xs text-muted-foreground">{alert.location}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</p>
                        </div>
                        <Badge variant={alert.severity === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentAlerts.length === 0 && (
                    <p className="text-muted-foreground text-center">No recent alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}