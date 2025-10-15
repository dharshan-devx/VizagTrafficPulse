import { useState, useEffect, useRef } from 'react';

interface TrafficUpdate {
  location: string;
  queue: number;
  stopDensity: number;
  accidents: number;
  fatalities: number;
  congestionScore: number;
  congestionLevel: string;
  timestamp: string;
}

interface TrafficAlert {
  location: string;
  alert: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

interface WebSocketMessage {
  type: 'connection' | 'traffic_update' | 'traffic_alert';
  data?: TrafficUpdate[] | TrafficAlert;
  message?: string;
  timestamp: string;
}

export function useRealTimeTraffic() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [currentUpdates, setCurrentUpdates] = useState<TrafficUpdate[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<TrafficAlert[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;
    let reconnectTimeout: NodeJS.Timeout;
    let ws: WebSocket | null = null;
    
    function connectWebSocket() {
      try {
        // Try WebSocket connection first (works on Render)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;
        
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setConnectionError(null);
          
          // Clear any existing polling
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null as any;
          }
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'traffic_update' && Array.isArray(data.data)) {
              setCurrentUpdates(data.data);
              setLastUpdate(data.timestamp);
            }
            
            if (data.alert) {
              setRecentAlerts(prev => {
                const newAlerts = [data.alert, ...prev.slice(0, 4)];
                return newAlerts;
              });
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected, falling back to polling');
          setIsConnected(false);
          ws = null;
          
          // Fall back to polling after a short delay
          reconnectTimeout = setTimeout(() => {
            startPolling();
          }, 2000);
        };
        
        ws.onerror = (error) => {
          console.log('WebSocket error, falling back to polling:', error);
          setConnectionError('WebSocket failed, using polling');
          ws = null;
          
          // Fall back to polling immediately
          startPolling();
        };
        
      } catch (error) {
        console.log('Failed to create WebSocket, using polling:', error);
        startPolling();
      }
    }
    
    function startPolling() {
      try {
        setIsConnected(true);
        setConnectionError(null);
        
        pollInterval = setInterval(async () => {
          try {
            const response = await fetch('/api/websocket', {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              console.log('Response content-type:', contentType);
              
              if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('Received polling data:', data);
                
                if (data.type === 'traffic_update' && Array.isArray(data.data)) {
                  setCurrentUpdates(data.data);
                  setLastUpdate(data.timestamp);
                }
                
                if (data.alert) {
                  setRecentAlerts(prev => {
                    const newAlerts = [data.alert, ...prev.slice(0, 4)];
                    return newAlerts;
                  });
                }
              } else {
                const responseText = await response.text();
                console.error('Invalid response content type. Expected JSON, got:', contentType);
                console.error('Response body (first 200 chars):', responseText.substring(0, 200));
                setConnectionError('Invalid response format');
              }
            } else {
              const responseText = await response.text();
              console.error('Polling request failed:', response.status, response.statusText);
              console.error('Response body:', responseText.substring(0, 200));
              setConnectionError('Polling request failed');
            }
          } catch (error) {
            console.error('Polling error:', error);
            setConnectionError('Connection failed');
            setIsConnected(false);
          }
        }, 10000); // Poll every 10 seconds
        
      } catch (error) {
        console.error('Failed to start polling:', error);
        setConnectionError('Failed to connect');
        setIsConnected(false);
      }
    }

    // Try WebSocket first, fall back to polling if it fails
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  const getTopCongestionAreas = () => {
    return currentUpdates
      .sort((a, b) => b.congestionScore - a.congestionScore)
      .slice(0, 5);
  };

  const getTotalLiveAccidents = () => {
    return currentUpdates.reduce((sum, update) => sum + update.accidents, 0);
  };

  return {
    isConnected,
    lastUpdate,
    currentUpdates,
    recentAlerts,
    connectionError,
    getTopCongestionAreas,
    getTotalLiveAccidents
  };
}