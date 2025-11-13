import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import * as schema from './schema'; // Importa el esquema que acabas de modificar

/**
 * Hook personalizado para obtener la instancia de Drizzle DB.
 * Este hook debe usarse DENTRO del componente SQLiteProvider.
 * * @returns Instancia de Drizzle ORM conectada a la base de datos de Expo SQLite.
 */
export function useDrizzleDB() {
  const db = useSQLiteContext();
  
  // Inicializa Drizzle con la instancia de Expo SQLite y el esquema.
  const drizzleDb = drizzle(db, { schema });
  
  return drizzleDb;
}

// Exporta los tipos de datos para facilitar su uso
export type Medication = typeof schema.medications.$inferSelect;
export type NewMedication = typeof schema.medications.$inferInsert;
export type Alarm = typeof schema.alarms.$inferSelect;
export type NewAlarm = typeof schema.alarms.$inferInsert;