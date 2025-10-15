import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const trafficData = pgTable("traffic_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  hour: integer("hour").notNull(),
  location: text("location").notNull(),
  queue: real("queue").notNull(),
  stopDensity: real("stop_density").notNull(),
  accidents: integer("accidents").notNull(),
  fatalities: integer("fatalities").notNull(),
  congestionScore: real("congestion_score").notNull(),
  congestionLevel: text("congestion_level").notNull(),
  locationEncoded: integer("location_encoded").notNull().default(0),
});

export const insertTrafficDataSchema = createInsertSchema(trafficData).pick({
  date: true,
  hour: true,
  location: true,
  queue: true,
  stopDensity: true,
  accidents: true,
  fatalities: true,
  congestionScore: true,
  congestionLevel: true,
});

export type InsertTrafficData = z.infer<typeof insertTrafficDataSchema>;
export type TrafficData = typeof trafficData.$inferSelect;

export const keyIndicators = z.object({
  totalAccidents: z.number(),
  totalFatalities: z.number(),
  avgCongestion: z.number(),
});

export type KeyIndicators = z.infer<typeof keyIndicators>;
