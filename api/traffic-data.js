// Import the data store from load-csv
let trafficDataStore = [];

// Try to import from load-csv if available
try {
  const loadCsvModule = require('./load-csv.js');
  if (loadCsvModule.trafficDataStore) {
    trafficDataStore = loadCsvModule.trafficDataStore;
  }
} catch (e) {
  // Module not available, use empty store
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return stored traffic data or sample data
    if (trafficDataStore && trafficDataStore.length > 0) {
      res.status(200).json(trafficDataStore);
    } else {
      // Return sample data if no data is loaded
      const sampleData = [
        {
          id: '1',
          date: new Date(),
          hour: 8,
          location: 'Visakhapatnam Junction',
          queue: 0.75,
          stopDensity: 0.65,
          accidents: 2,
          fatalities: 0,
          congestionScore: 0.7,
          congestionLevel: 'Yellow (Medium)',
          locationEncoded: 1
        }
      ];
      res.status(200).json(sampleData);
    }
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    res.status(500).json({ message: 'Failed to fetch traffic data' });
  }
}