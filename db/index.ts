import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "./schema";

export function useDrizzleDB() {
  const db = useSQLiteContext();
  return drizzle(db, { schema });
}

export type Medication = typeof schema.medications.$inferSelect;
export type NewMedication = typeof schema.medications.$inferInsert;
export type Alarm = typeof schema.alarms.$inferSelect;
export type NewAlarm = typeof schema.alarms.$inferInsert;
