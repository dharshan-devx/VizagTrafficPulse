import { type TrafficData, type InsertTrafficData, type KeyIndicators } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTrafficData(): Promise<TrafficData[]>;
  createTrafficData(data: InsertTrafficData): Promise<TrafficData>;
  getKeyIndicators(): Promise<KeyIndicators>;
  bulkInsertTrafficData(data: InsertTrafficData[]): Promise<TrafficData[]>;
  clearAllTrafficData(): Promise<void>;
  setCachedMLResults(results: any): Promise<void>;
  getCachedMLResults(): Promise<any>;
}

export class MemStorage implements IStorage {
  private trafficData: Map<string, TrafficData>;
  private cachedMLResults: any;

  constructor() {
    this.trafficData = new Map();
    this.cachedMLResults = null;
  }

  async getTrafficData(): Promise<TrafficData[]> {
    return Array.from(this.trafficData.values());
  }

  async createTrafficData(insertData: InsertTrafficData): Promise<TrafficData> {
    const id = randomUUID();
    const data: TrafficData = { 
      ...insertData, 
      id,
      locationEncoded: (insertData as any).locationEncoded || 0
    };
    this.trafficData.set(id, data);
    return data;
  }

  async bulkInsertTrafficData(dataArray: InsertTrafficData[]): Promise<TrafficData[]> {
    const results: TrafficData[] = [];
    for (const insertData of dataArray) {
      const result = await this.createTrafficData(insertData);
      results.push(result);
    }
    return results;
  }

  async clearAllTrafficData(): Promise<void> {
    this.trafficData.clear();
  }

  async getKeyIndicators(): Promise<KeyIndicators> {
    const allData = Array.from(this.trafficData.values());
    
    if (allData.length === 0) {
      return {
        totalAccidents: 0,
        totalFatalities: 0,
        avgCongestion: 0,
      };
    }

    const totalAccidents = allData.reduce((sum, data) => sum + data.accidents, 0);
    const totalFatalities = allData.reduce((sum, data) => sum + data.fatalities, 0);
    const avgCongestion = allData.reduce((sum, data) => sum + data.congestionScore, 0) / allData.length;

    return {
      totalAccidents,
      totalFatalities,
      avgCongestion: Math.round(avgCongestion * 100) / 100,
    };
  }

  async setCachedMLResults(results: any): Promise<void> {
    this.cachedMLResults = results;
  }

  async getCachedMLResults(): Promise<any> {
    return this.cachedMLResults;
  }
}

export const storage = new MemStorage();
