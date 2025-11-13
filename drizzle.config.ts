import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from './schema';

/**
 * Hook personalizado para obtener la instancia de Drizzle DB.
 */
export function useDrizzleDB() {
  const db = useSQLiteContext();
  
  // Inicializa Drizzle con la instancia de Expo SQLite y el esquema.
  const drizzleDb = drizzle(db, { schema });
  
  return drizzleDb;
}

// Exporta tipos para facilitar el tipado en los componentes
export type Medication = typeof schema.medications.$inferSelect;
export type NewMedication = typeof schema.medications.$inferInsert;
export type Alarm = typeof schema.alarms.$inferSelect;
export type NewAlarm = typeof schema.alarms.$inferInsert;