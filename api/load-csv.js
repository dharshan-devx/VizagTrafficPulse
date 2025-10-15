import fs from 'fs';
import path from 'path';

// In-memory storage for Vercel
let trafficDataStore = [];
let cachedMLResults = null;

// Helper function for quantile calculation
function quantile(values, q) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Mock Python ML analysis
function mockMLAnalysis(data) {
  const models = {
    'Linear Regression': { 
      RMSE: 0.15 + Math.random() * 0.05, 
      R2: 0.75 + Math.random() * 0.1 
    },
    'Decision Tree': { 
      RMSE: 0.12 + Math.random() * 0.04, 
      R2: 0.82 + Math.random() * 0.08 
    },
    'Random Forest': { 
      RMSE: 0.08 + Math.random() * 0.03, 
      R2: 0.90 + Math.random() * 0.05 
    }
  };

  Object.keys(models).forEach(model => {
    models[model].RMSE = Math.round(models[model].RMSE * 1000) / 1000;
    models[model].R2 = Math.round(models[model].R2 * 1000) / 1000;
  });

  const totalAccidents = data.reduce((sum, row) => sum + (row.accidents || 0), 0);
  const totalFatalities = data.reduce((sum, row) => sum + (row.fatalities || 0), 0);
  const avgCongestion = data.length > 0 ? 
    data.reduce((sum, row) => sum + (row.congestionScore || 0), 0) / data.length : 0;

  return {
    success: true,
    mlPerformance: models,
    indicators: {
      totalAccidents,
      totalFatalities,
      avgCongestion: Math.round(avgCongestion * 1000) / 1000
    },
    recordsProcessed: data.length
  };
}

// Sample traffic data for demonstration
function generateSampleData() {
  const locations = [
    'MVP Colony', 'Gajuwaka', 'Vizag Junction', 'Beach Road', 'Dwaraka Nagar',
    'Madhurawada', 'Pendurthi', 'Simhachalam', 'Anakapalle', 'Bheemunipatnam'
  ];

  const sampleData = [];
  const now = new Date();
  
  // Generate 40 sample records
  for (let i = 0; i < 40; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // Past 40 days
    const hour = Math.floor(Math.random() * 24);
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
    const queue = isRushHour ? 60 + Math.random() * 40 : 20 + Math.random() * 30;
    const stopDensity = isRushHour ? 25 + Math.random() * 20 : 10 + Math.random() * 15;
    const accidents = Math.random() > 0.9 ? Math.floor(Math.random() * 3) + 1 : 0;
    const fatalities = accidents > 0 && Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0;
    
    const congestionScore = Math.min(queue / 100, 1);
    let congestionLevel = "Green (Low)";
    if (congestionScore >= 0.66) {
      congestionLevel = "Red (High)";
    } else if (congestionScore >= 0.33) {
      congestionLevel = "Yellow (Medium)";
    }

    sampleData.push({
      id: Math.random().toString(36).substr(2, 9),
      date,
      hour,
      location,
      queue: parseFloat(queue.toFixed(1)),
      stopDensity: parseFloat(stopDensity.toFixed(1)),
      accidents,
      fatalities,
      congestionScore: parseFloat(congestionScore.toFixed(2)),
      congestionLevel,
      locationEncoded: locations.indexOf(location)
    });
  }

  return sampleData;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Generate sample data
    const sampleData = generateSampleData();
    
    // Store in memory
    trafficDataStore = sampleData;
    
    // Run mock ML analysis
    const mlResults = mockMLAnalysis(sampleData);
    cachedMLResults = mlResults;

    res.status(200).json({
      message: 'Sample traffic data loaded successfully',
      csvFile: 'sample_traffic_data.csv',
      recordsLoaded: sampleData.length,
      indicators: mlResults.indicators,
      mlPerformance: mlResults.mlPerformance
    });

  } catch (error) {
    console.error('Load CSV error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to load sample data' 
    });
  }
}

// Export the data store for other API routes
export { trafficDataStore, cachedMLResults };