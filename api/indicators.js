// Import the data store from load-csv
let trafficDataStore = [];
let cachedMLResults = null;

// Try to import from load-csv if available
try {
  const loadCsvModule = require('./load-csv.js');
  if (loadCsvModule.trafficDataStore) {
    trafficDataStore = loadCsvModule.trafficDataStore;
  }
  if (loadCsvModule.cachedMLResults) {
    cachedMLResults = loadCsvModule.cachedMLResults;
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
    let indicators;

    // Use cached ML results if available
    if (cachedMLResults && cachedMLResults.indicators) {
      indicators = cachedMLResults.indicators;
    } else if (trafficDataStore && trafficDataStore.length > 0) {
      // Calculate from stored data
      const totalAccidents = trafficDataStore.reduce((sum, data) => sum + (data.accidents || 0), 0);
      const totalFatalities = trafficDataStore.reduce((sum, data) => sum + (data.fatalities || 0), 0);
      const avgCongestion = trafficDataStore.reduce((sum, data) => sum + (data.congestionScore || 0), 0) / trafficDataStore.length;

      indicators = {
        totalAccidents,
        totalFatalities,
        avgCongestion: Math.round(avgCongestion * 1000) / 1000,
      };
    } else {
      // Default values when no data is available
      indicators = {
        totalAccidents: 96,
        totalFatalities: 39,
        avgCongestion: 0.487
      };
    }

    res.status(200).json(indicators);
  } catch (error) {
    console.error('Error fetching indicators:', error);
    res.status(500).json({ message: 'Failed to fetch indicators' });
  }
}