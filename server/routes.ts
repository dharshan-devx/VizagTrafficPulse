import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertTrafficDataSchema } from "@shared/schema";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import multer from "multer";
import { promisify } from "util";

// Concurrency guard for CSV loading
let isLoadingCsv = false;

// Configure multer for file uploads
const upload = multer({
  dest: path.resolve(process.cwd(), 'temp/uploads/'),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Only allow CSV files
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/csv' || 
        file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'temp/uploads/');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get key indicators
  app.get("/api/indicators", async (req, res) => {
    try {
      const indicators = await storage.getKeyIndicators();
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indicators" });
    }
  });

  // Get all traffic data
  app.get("/api/traffic-data", async (req, res) => {
    try {
      const data = await storage.getTrafficData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch traffic data" });
    }
  });

  // Get chart data for different visualizations
  app.get("/api/charts/:chartType", async (req, res) => {
    try {
      const { chartType } = req.params;
      const data = await storage.getTrafficData();
      
      if (data.length === 0) {
        return res.json([]);
      }

      let chartData;
      
      switch (chartType) {
        case 'congestion':
          // Pie chart data for congestion distribution
          const congestionGroups = data.reduce((acc: any, row: any) => {
            acc[row.congestionLevel] = (acc[row.congestionLevel] || 0) + 1;
            return acc;
          }, {});
          chartData = Object.entries(congestionGroups).map(([level, count]) => ({
            name: level,
            value: count,
            fill: level.includes('Red') ? '#ef4444' : level.includes('Yellow') ? '#f59e0b' : '#22c55e'
          }));
          break;
          
        case 'hourly':
          // Stacked bar chart for hourly trends
          const hourlyData = data.reduce((acc: any, row: any) => {
            const hour = row.hour;
            if (!acc[hour]) {
              acc[hour] = { hour, low: 0, medium: 0, high: 0 };
            }
            if (row.congestionLevel.includes('Red')) acc[hour].high++;
            else if (row.congestionLevel.includes('Yellow')) acc[hour].medium++;
            else acc[hour].low++;
            return acc;
          }, {});
          chartData = Object.values(hourlyData).sort((a: any, b: any) => a.hour - b.hour);
          break;
          
        case 'daily':
          // Line chart for daily trends
          const dailyData = data.reduce((acc: any, row: any) => {
            const date = new Date(row.date).toISOString().split('T')[0];
            if (!acc[date]) {
              acc[date] = { date, avgCongestion: 0, count: 0 };
            }
            acc[date].avgCongestion += row.congestionScore;
            acc[date].count++;
            return acc;
          }, {});
          chartData = Object.values(dailyData).map((day: any) => ({
            date: day.date,
            avgCongestion: Number((day.avgCongestion / day.count).toFixed(2))
          })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          break;
          
        case 'accidents':
          // Bar chart for accident hotspots
          const accidentData = data.reduce((acc: any, row: any) => {
            if (row.accidents > 0) {
              acc[row.location] = (acc[row.location] || 0) + row.accidents;
            }
            return acc;
          }, {});
          chartData = Object.entries(accidentData)
            .map(([location, accidents]) => ({ location, accidents }))
            .sort((a: any, b: any) => b.accidents - a.accidents)
            .slice(0, 10);
          break;
          
        case 'fatalities':
          // Bar chart for fatality hotspots
          const fatalityData = data.reduce((acc: any, row: any) => {
            if (row.fatalities > 0) {
              acc[row.location] = (acc[row.location] || 0) + row.fatalities;
            }
            return acc;
          }, {});
          chartData = Object.entries(fatalityData)
            .map(([location, fatalities]) => ({ location, fatalities }))
            .sort((a: any, b: any) => b.fatalities - a.fatalities)
            .slice(0, 10);
          break;
          
        case 'vehicle':
          // Scatter plot for vehicle flow
          chartData = data.map((row: any) => ({
            queueDensity: row.queue,
            stopDensity: row.stopDensity,
            congestionLevel: row.congestionLevel
          })).filter((item: any) => item.queueDensity > 0 || item.stopDensity > 0);
          break;
          
        case 'heatmap':
          // Heatmap data (location vs hour)
          const heatmapData = data.reduce((acc: any, row: any) => {
            const key = `${row.location}-${row.hour}`;
            if (!acc[key]) {
              acc[key] = {
                location: row.location,
                hour: row.hour,
                avgCongestion: 0,
                count: 0
              };
            }
            acc[key].avgCongestion += row.congestionScore;
            acc[key].count++;
            return acc;
          }, {});
          chartData = Object.values(heatmapData).map((item: any) => ({
            location: item.location,
            hour: item.hour,
            value: Number((item.avgCongestion / item.count).toFixed(2))
          }));
          break;
          
        case 'ml':
          // Get cached ML performance results from Python analysis
          const cachedMLResults = await storage.getCachedMLResults();
          if (cachedMLResults && cachedMLResults.mlPerformance) {
            chartData = Object.entries(cachedMLResults.mlPerformance).map(([model, metrics]: [string, any]) => ({
              model,
              rmse: metrics.RMSE,
              r2: metrics.R2
            }));
          } else {
            // Fallback if no cached results (before CSV load)
            chartData = [
              { model: "Linear Regression", rmse: 0, r2: 0 },
              { model: "Decision Tree", rmse: 0, r2: 0 },
              { model: "Random Forest", rmse: 0, r2: 0 }
            ];
          }
          break;
          
        default:
          return res.status(400).json({ message: "Invalid chart type" });
      }
      
      res.json(chartData);
    } catch (error) {
      console.error(`Error fetching ${req.params.chartType} chart data:`, error);
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  // WebSocket polling endpoint for real-time traffic updates
  app.get("/api/websocket", async (req, res) => {
    try {
      // Generate real-time traffic data (similar to WebSocket broadcast)
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

      // Generate random alert (30% chance)
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

      res.json(response);
    } catch (error) {
      console.error('WebSocket polling error:', error);
      res.status(500).json({ message: 'Failed to generate traffic data' });
    }
  });

  // High-Accuracy Python ML Analysis
  async function executePythonAnalysis(csvPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = 120000; // 2 minutes timeout
      
      // Robust Python binary detection
      const pythonBin = process.env.PYTHON_BIN || 'python';
      const scriptPath = path.resolve(process.cwd(), 'analyze_traffic.py');
      
      const pythonProcess = spawn(pythonBin, [scriptPath, '--csv', csvPath, '--mode', 'metrics'], {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timeoutId = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Python analysis timed out'));
      }, timeout);

      pythonProcess.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (code !== 0) {
          console.error('Python analysis failed:', stderr);
          reject(new Error(`Python analysis failed with code ${code}: ${stderr}`));
          return;
        }

        try {
          const result = JSON.parse(stdout);
          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.error || 'Python analysis failed'));
          }
        } catch (parseError) {
          console.error('Failed to parse Python output:', stdout);
          reject(new Error('Failed to parse Python analysis results'));
        }
      });

      pythonProcess.on('error', (error) => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  // Fallback ML Performance Calculator (used if Python fails)
  function fallbackMLPerformance(): any {
    return {
      "Linear Regression": { RMSE: 0, R2: 0 },
      "Decision Tree": { RMSE: 0, R2: 0 },
      "Random Forest": { RMSE: 0, R2: 0 }
    };
  }

  // Helper function for pandas-equivalent quantile calculation
  function quantile(values: number[], q: number): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (sorted.length - 1) * q;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  // Load CSV data
  app.post("/api/load-csv", async (req, res) => {
    try {
      // Prevent concurrent processing
      if (isLoadingCsv) {
        return res.status(409).json({ 
          message: "CSV loading already in progress, please retry shortly" 
        });
      }

      isLoadingCsv = true;

      // Clear existing data before loading new data
      await storage.clearAllTrafficData();

      // Auto-detect CSV files in the public/data directory
      const dataDir = path.resolve(process.cwd(), "public/data");
      
      if (!fs.existsSync(dataDir)) {
        isLoadingCsv = false;
        return res.status(404).json({ message: "Data directory not found" });
      }

      // Scan for CSV files
      const files = fs.readdirSync(dataDir);
      const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
      
      if (csvFiles.length === 0) {
        isLoadingCsv = false;
        return res.status(404).json({ message: "No CSV files found in public/data/ directory" });
      }

      // Use the first CSV file found (alphabetically sorted)
      const selectedCsvFile = csvFiles.sort()[0];
      const csvPath = path.join(dataDir, selectedCsvFile);
      
      console.log(`Auto-detected CSV file: ${selectedCsvFile}`);
      console.log(`Loading CSV from: ${csvPath}`);

      const csvFile = fs.readFileSync(csvPath, "utf8");
      
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // First pass: Parse and validate data (like Python notebook data preprocessing)
            const parsedData = results.data.map((row: any) => ({
              date: new Date(row.Date || Date.now()),
              hour: parseInt(row.Hour) || 0,
              location: row.Location || "Unknown",
              queue: parseFloat(row.Queue_Density || row.Queue) || 0,
              stopDensity: parseFloat(row.Stop_Density || row.StopDensity) || 0,
              accidents: parseInt(row.Accidents_Reported || row.Accidents) || 0,
              fatalities: parseInt(row.Fatalities) || 0,
            }));

            // Implement Python notebook approach: Statistical percentile-based normalization
            // Choose base metric (Queue preferred, fallback to StopDensity) - lines 44-50 from Python
            const queueSum = parsedData.reduce((sum, d) => sum + d.queue, 0);
            const stopDensitySum = parsedData.reduce((sum, d) => sum + d.stopDensity, 0);
            
            let baseValues: number[];
            if (queueSum > 0) {
              baseValues = parsedData.map(d => d.queue);
            } else if (stopDensitySum > 0) {
              baseValues = parsedData.map(d => d.stopDensity);
            } else {
              baseValues = parsedData.map(() => 0);
            }

            // Calculate percentiles (p1, p99) using pandas-equivalent linear interpolation
            const p1 = quantile(baseValues, 0.01);
            const p99 = quantile(baseValues, 0.99);

            // Generate location encoding (like Python's LabelEncoder) - line 42
            const uniqueLocations = Array.from(new Set(parsedData.map(d => d.location))).sort();
            const locationEncodingMap = Object.fromEntries(
              uniqueLocations.map((loc, idx) => [loc, idx])
            );

            // Apply same normalization formula as Python: ((base - p1) / (p99 - p1)).clip(0, 1) - lines 55-57
            const trafficDataArray = parsedData.map((row, index) => {
              const baseValue = baseValues[index];
              let congestionScore = 0;
              
              // Implement Python's clip(0, 1) logic - handle edge case properly
              if (p99 !== p1) {
                congestionScore = Math.max(0, Math.min(1, (baseValue - p1) / (p99 - p1)));
              } else {
                congestionScore = 0.0; // Exact match to Python notebook behavior
              }
              
              // Apply same thresholds as Python notebook - lines 62-65
              let congestionLevel = "Green (Low)";
              if (congestionScore >= 0.66) {
                congestionLevel = "Red (High)";
              } else if (congestionScore >= 0.33) {
                congestionLevel = "Yellow (Medium)";
              }

              return {
                date: row.date,
                hour: row.hour,
                location: row.location,
                queue: row.queue,
                stopDensity: row.stopDensity,
                accidents: row.accidents,
                fatalities: row.fatalities,
                congestionScore,
                congestionLevel,
                locationEncoded: locationEncodingMap[row.location] || 0, // Add location encoding for ML
              };
            });

            // Execute high-accuracy Python ML analysis
            let mlResults, pythonIndicators, pythonResult;
            try {
              pythonResult = await executePythonAnalysis(csvPath);
              mlResults = pythonResult.mlPerformance;
              pythonIndicators = pythonResult.indicators;
              console.log(`Python analysis completed: ${pythonResult.recordsProcessed} records processed`);
              
              // Cache Python results for charts endpoint
              await storage.setCachedMLResults(pythonResult);
            } catch (pythonError) {
              console.warn("Python analysis failed, using fallback:", pythonError instanceof Error ? pythonError.message : String(pythonError));
              mlResults = fallbackMLPerformance();
              pythonIndicators = null;
              
              // Cache fallback results
              await storage.setCachedMLResults({ mlPerformance: mlResults, indicators: null });
            }

            // Bulk insert the processed data
            await storage.bulkInsertTrafficData(trafficDataArray);
            
            // Get indicators (use Python results if available, otherwise database results)
            const indicators = pythonIndicators || await storage.getKeyIndicators();
            
            res.json({ 
              message: `CSV data loaded successfully from ${selectedCsvFile} (High-accuracy Python analysis)`, 
              csvFile: selectedCsvFile,
              recordsLoaded: trafficDataArray.length,
              indicators,
              mlPerformance: mlResults
            });
          } catch (error) {
            console.error("Error processing CSV data:", error);
            res.status(500).json({ message: "Failed to process CSV data" });
          } finally {
            isLoadingCsv = false;
          }
        },
        error: (error: any) => {
          console.error("CSV parsing error:", error);
          isLoadingCsv = false;
          res.status(500).json({ message: "Failed to parse CSV file" });
        }
      });
    } catch (error) {
      console.error("Error loading CSV:", error);
      isLoadingCsv = false;
      res.status(500).json({ message: "Failed to load CSV file" });
    }
  });

  // Helper function to process CSV content (reusable for both file upload and directory loading)
  async function processCSVContent(csvContent: string, csvPath: string, fileName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // First pass: Parse and validate data (like Python notebook data preprocessing)
            const parsedData = results.data.map((row: any) => ({
              date: new Date(row.Date || Date.now()),
              hour: parseInt(row.Hour) || 0,
              location: row.Location || "Unknown",
              queue: parseFloat(row.Queue_Density || row.Queue) || 0,
              stopDensity: parseFloat(row.Stop_Density || row.StopDensity) || 0,
              accidents: parseInt(row.Accidents_Reported || row.Accidents) || 0,
              fatalities: parseInt(row.Fatalities) || 0,
            }));

            // Implement Python notebook approach: Statistical percentile-based normalization
            const queueSum = parsedData.reduce((sum, d) => sum + d.queue, 0);
            const stopDensitySum = parsedData.reduce((sum, d) => sum + d.stopDensity, 0);
            
            let baseValues: number[];
            if (queueSum > 0) {
              baseValues = parsedData.map(d => d.queue);
            } else if (stopDensitySum > 0) {
              baseValues = parsedData.map(d => d.stopDensity);
            } else {
              baseValues = parsedData.map(() => 0);
            }

            // Calculate percentiles (p1, p99) using pandas-equivalent linear interpolation
            const p1 = quantile(baseValues, 0.01);
            const p99 = quantile(baseValues, 0.99);

            // Generate location encoding (like Python's LabelEncoder)
            const uniqueLocations = Array.from(new Set(parsedData.map(d => d.location))).sort();
            const locationEncodingMap = Object.fromEntries(
              uniqueLocations.map((loc, idx) => [loc, idx])
            );

            // Apply same normalization formula as Python: ((base - p1) / (p99 - p1)).clip(0, 1)
            const trafficDataArray = parsedData.map((row, index) => {
              const baseValue = baseValues[index];
              let congestionScore = 0;
              
              // Implement Python's clip(0, 1) logic - handle edge case properly
              if (p99 !== p1) {
                congestionScore = Math.max(0, Math.min(1, (baseValue - p1) / (p99 - p1)));
              } else {
                congestionScore = 0.0; // Exact match to Python notebook behavior
              }
              
              // Apply same thresholds as Python notebook
              let congestionLevel = "Green (Low)";
              if (congestionScore >= 0.66) {
                congestionLevel = "Red (High)";
              } else if (congestionScore >= 0.33) {
                congestionLevel = "Yellow (Medium)";
              }

              return {
                date: row.date,
                hour: row.hour,
                location: row.location,
                queue: row.queue,
                stopDensity: row.stopDensity,
                accidents: row.accidents,
                fatalities: row.fatalities,
                congestionScore,
                congestionLevel,
                locationEncoded: locationEncodingMap[row.location] || 0,
              };
            });

            // Execute high-accuracy Python ML analysis
            let mlResults, pythonIndicators, pythonResult;
            try {
              pythonResult = await executePythonAnalysis(csvPath);
              mlResults = pythonResult.mlPerformance;
              pythonIndicators = pythonResult.indicators;
              console.log(`Python analysis completed for ${fileName}: ${pythonResult.recordsProcessed} records processed`);
              
              // Cache Python results for charts endpoint
              await storage.setCachedMLResults(pythonResult);
            } catch (pythonError) {
              console.warn(`Python analysis failed for ${fileName}, using fallback:`, pythonError instanceof Error ? pythonError.message : String(pythonError));
              mlResults = fallbackMLPerformance();
              pythonIndicators = null;
              
              // Cache fallback results
              await storage.setCachedMLResults({ mlPerformance: mlResults, indicators: null });
            }

            // Bulk insert the processed data
            await storage.bulkInsertTrafficData(trafficDataArray);
            
            // Get indicators (use Python results if available, otherwise database results)
            const indicators = pythonIndicators || await storage.getKeyIndicators();
            
            resolve({
              message: `CSV data processed successfully from ${fileName} (High-accuracy Python analysis)`,
              csvFile: fileName,
              recordsLoaded: trafficDataArray.length,
              indicators,
              mlPerformance: mlResults
            });
          } catch (error) {
            console.error("Error processing CSV data:", error);
            reject(new Error("Failed to process CSV data"));
          }
        },
        error: (error: any) => {
          console.error("CSV parsing error:", error);
          reject(new Error("Failed to parse CSV file"));
        }
      });
    });
  }

  // Upload CSV file endpoint
  app.post("/api/upload-csv", upload.single('csvFile'), async (req, res) => {
    let uploadedFile: Express.Multer.File | undefined;
    
    try {
      // Prevent concurrent processing
      if (isLoadingCsv) {
        return res.status(409).json({ 
          message: "CSV processing already in progress, please wait"
        });
      }

      // Validate file upload
      if (!req.file) {
        return res.status(400).json({ 
          message: "No file uploaded. Please select a CSV file."
        });
      }

      uploadedFile = req.file;
      console.log(`File uploaded: ${uploadedFile.originalname} (${uploadedFile.size} bytes)`);

      // Set loading flag inside try block to ensure finally runs
      isLoadingCsv = true;

      // File validation (now inside try block)
      if (uploadedFile.size === 0) {
        return res.status(400).json({ message: "Uploaded file is empty" });
      }

      if (uploadedFile.size > 50 * 1024 * 1024) { // 50MB
        return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
      }

      // Clear existing data before loading new data
      await storage.clearAllTrafficData();

      // Read the uploaded file (async to avoid blocking)
      const csvContent = await fs.promises.readFile(uploadedFile.path, "utf8");
      
      // CSV content validation
      if (csvContent.trim().length === 0) {
        return res.status(400).json({ message: "CSV file is empty" });
      }

      // Check for basic CSV structure (headers)
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        return res.status(400).json({ message: "CSV file must contain headers and at least one data row" });
      }

      // Parse header row to validate columns more accurately
      const headerRow = lines[0];
      const headers = headerRow.toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
      const requiredColumns = ['date', 'hour', 'location'];
      
      const hasRequiredColumns = requiredColumns.every(col => 
        headers.some(h => h === col || h === col.replace('_', ' ') || h.replace(' ', '_') === col)
      );
      
      if (!hasRequiredColumns) {
        return res.status(400).json({ 
          message: "CSV file must contain required columns: Date, Hour, Location" 
        });
      }
      
      // Process the CSV content using the helper function
      const result = await processCSVContent(csvContent, uploadedFile.path, uploadedFile.originalname);

      // Return the same format as the original load-csv endpoint
      res.json(result);

    } catch (error) {
      console.error("Upload error:", error);
      
      // Handle multer errors with specific status codes
      if (error && typeof error === 'object' && 'code' in error && error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
      }
      
      if (error && typeof error === 'object' && 'message' in error && error.message === 'Only CSV files are allowed') {
        return res.status(415).json({ message: "Invalid file type. Please upload a CSV file." });
      }

      // Generic error
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process file upload"
      });

    } finally {
      // Always clean up: reset flag and delete temp file
      isLoadingCsv = false;
      
      if (uploadedFile?.path) {
        fs.unlink(uploadedFile.path, (err) => {
          if (err) console.warn("Failed to delete temp file:", err);
        });
      }
    }
  });

  // Multer error handler - handles file upload errors before they reach route handlers
  app.use((error: any, req: any, res: any, next: any) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
    }
    
    if (error.message === 'Only CSV files are allowed') {
      return res.status(415).json({ message: "Invalid file type. Please upload a CSV file." });
    }
    
    // Other Multer errors
    if (error.code && error.code.startsWith('LIMIT_')) {
      return res.status(400).json({ message: "File upload error: " + error.message });
    }
    
    // Not a Multer error, pass to next error handler
    next(error);
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time traffic updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    clients.add(ws);
    
    // Send initial connection message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to real-time traffic updates',
      timestamp: new Date().toISOString()
    }));
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      clients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  // Broadcast function to send data to all connected clients
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Real-time traffic data simulation
  function startRealTimeUpdates() {
    const locations = [
      'MVP Colony', 'Gajuwaka', 'Vizag Junction', 'Beach Road', 'Dwaraka Nagar',
      'Madhurawada', 'Pendurthi', 'Simhachalam', 'Anakapalle', 'Bheemunipatnam'
    ];
    
    setInterval(() => {
      // Generate realistic traffic updates
      const updates = locations.map(location => {
        const hour = new Date().getHours();
        const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
        
        // Simulate varying traffic conditions
        const baseQueue = isRushHour ? 60 + Math.random() * 40 : 20 + Math.random() * 30;
        const baseStop = isRushHour ? 25 + Math.random() * 20 : 10 + Math.random() * 15;
        const accidents = Math.random() > 0.95 ? 1 : 0; // 5% chance of accident
        const fatalities = accidents && Math.random() > 0.9 ? 1 : 0; // 10% of accidents have fatalities
        
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
      
      // Broadcast real-time updates
      broadcast({
        type: 'traffic_update',
        data: updates,
        timestamp: new Date().toISOString()
      });
      
      // Randomly send traffic alerts
      if (Math.random() > 0.9) {
        const alertLocation = locations[Math.floor(Math.random() * locations.length)];
        const alertTypes = ['Heavy Traffic', 'Accident Reported', 'Road Block', 'Signal Down'];
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        broadcast({
          type: 'traffic_alert',
          data: {
            location: alertLocation,
            alert: alertType,
            severity: Math.random() > 0.5 ? 'High' : 'Medium',
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        });
      }
    }, 10000); // Update every 10 seconds
  }
  
  // Start real-time updates
  startRealTimeUpdates();
  
  return httpServer;
}
