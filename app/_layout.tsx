// app/(tabs)/_layout.tsx
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React, { Suspense } from "react";
import { StyleSheet, Text, View } from "react-native";

// Inicialización de base de datos
async function initializeDatabase(db: any) {
  try {
    // Tabla medications
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dose_mg INTEGER NOT NULL,
        notes TEXT,
        start_date INTEGER
      );
    `);

    // Tabla alarms
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS alarms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medication_id INTEGER NOT NULL,
        time TEXT NOT NULL,
        days TEXT,
        active INTEGER DEFAULT 1
      );
    `);

    console.log("✅ Base de datos lista");
  } catch (error) {
    console.error("Error inicializando BD:", error);
  }
}

// Componente de carga
function DatabaseLoadingFallback() {
  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>Cargando aplicación...</Text>
    </View>
  );
}

// Layout principal con TABS
export default function TabLayout() {
  return (
    <Suspense fallback={<DatabaseLoadingFallback />}>
      <SQLiteProvider
        databaseName="pastillero.db"
        onInit={initializeDatabase}
        useSuspense
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#2ecc71",
            tabBarInactiveTintColor: "#95a5a6",
            tabBarStyle: {
              backgroundColor: "#ffffff",
              borderTopWidth: 1,
              borderTopColor: "#ecf0f1",
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
          }}
        >
          {/* Pantalla de Inicio */}
          <Tabs.Screen
            name="index"
            options={{
              title: "Inicio",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="home" size={size} color={color} />
              ),
            }}
          />

          {/* Pantalla del Pastillero (WIFI) */}
          <Tabs.Screen
            name="pasilliero"
            options={{
              title: "Pastillero",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons
                  name="medical-services"
                  size={size}
                  color={color}
                />
              ),
            }}
          />

          {/* Pantalla de Alarmas */}
          <Tabs.Screen
            name="alarms"
            options={{
              title: "Alarmas",
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="bell" size={size} color={color} />
              ),
            }}
          />

          {/* Pantalla de Medicamentos */}
          <Tabs.Screen
            name="medication"
            options={{
              title: "Medicamentos",
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="medication" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  fallbackText: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "600",
  },
});
