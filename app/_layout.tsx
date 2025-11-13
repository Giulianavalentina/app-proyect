import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// --- Funciones de Configuración de la Base de Datos ---

// 1. Inicialización: Crea las tablas si no existen.
async function initializeDatabase(db: SQLiteProvider['db']) {
  // 1. Habilitar claves foráneas (IMPORTANTE para la tabla 'alarms')
  await db.execAsync('PRAGMA foreign_keys = ON;');
  
  // 2. SQL para crear la tabla MEDICATIONS
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS medications (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      notes TEXT,
      start_date INTEGER NOT NULL
    );
  `);

  // 3. SQL para crear la tabla ALARMS con clave foránea
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS alarms (
      id INTEGER PRIMARY KEY NOT NULL,
      medication_id INTEGER NOT NULL,
      time TEXT NOT NULL,
      days TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (medication_id) REFERENCES medications(id) ON DELETE CASCADE
    );
  `);
  
  console.log("Base de datos de Medicamentos y Alarmas inicializada correctamente.");
}

// 2. Fallback de Carga
function DatabaseLoadingFallback() {
  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Cargando datos. Por favor, espera...</Text>
    </View>
  );
}

// --- Componente Principal ---

export default function RootLayout() {
  return (
    <Suspense fallback={<DatabaseLoadingFallback />}>
      <SQLiteProvider
        databaseName="app-db.db" // Nombre del archivo de tu BD
        onInit={initializeDatabase}
        useSuspense
      >
        {/* Slot renderiza el resto de la aplicación (incluyendo las pestañas) */}
        <Slot />
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  fallbackText: {
    fontSize: 18,
    color: '#333',
  }
});