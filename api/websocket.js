// Vercel serverless function for WebSocket simulation
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Generate mock real-time traffic data
    const locations = [
      'MVP Colony', 'Gajuwaka', 'Vizag Junction', 'Beach Road', 'Dwaraka Nagar',
      'Madhurawada', 'Pendurthi', 'Simhachalam', 'Anakapalle', 'Bheemunipatnam'
    ];

    const updates = locations.map(location => {
      const hour = new Date().getHours();
      const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
      
      const baseQueue = isRushHour ? 60 + Math.random() * 40 : 20 + Math.random() * 30;
      const baseStop = isRushHour ? 25 + Math.random() * 20 : 10 + Math.random() * 15;
      const accidents = Math.random() > 0.95 ? 1 : 0;
      const fatalities = accidents && Math.random() > 0.9 ? 1 : 0;
      
      const congestionScore = Math.min(baseQueue / 100, 1);
      let congestionLevel = "Green (Low)";
      if (congestionScore >= 0.66) {
        congestionLevel = "Red (High)";
      } else if (congestionScore >= 0.33) {
        congestionLevel = "Yellow (Medium)";
      }
      
      return {
        location,
        queue: parseFloat(baseQueue.toFixed(1)),
        stopDensity: parseFloat(baseStop.toFixed(1)),
        accidents,
        fatalities,
        congestionScore: parseFloat(congestionScore.toFixed(2)),
        congestionLevel,
        timestamp: new Date().toISOString()
      };
    });

    // Generate random alert
    const alert = Math.random() > 0.7 ? {
      location: locations[Math.floor(Math.random() * locations.length)],
      alert: ['Heavy Traffic', 'Accident Reported', 'Road Block', 'Signal Down'][Math.floor(Math.random() * 4)],
      severity: Math.random() > 0.5 ? 'High' : 'Medium',
      timestamp: new Date().toISOString()
    } : null;

    const response = {
      type: 'traffic_update',
      data: updates,
      alert: alert,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('WebSocket simulation error:', error);
    res.status(500).json({ message: 'Failed to generate traffic data' });
  }
}