import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

// Datos locales
const initialAlarms = [
  {
    id: 1,
    medication: "Paracetamol",
    dosage: 500,
    time: "08:00",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
    isActive: true,
  },
  {
    id: 2,
    medication: "Ibuprofeno",
    dosage: 400,
    time: "13:30",
    days: ["Lun", "Mié", "Vie"],
    isActive: true,
  },
  {
    id: 3,
    medication: "Vitamina C",
    dosage: 1000,
    time: "20:00",
    days: ["Todos los días"],
    isActive: false,
  },
];

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState(initialAlarms);
  const [loading] = useState(false);

  const deleteAlarm = (id: number, medication: string) => {
    Alert.alert("Eliminar Alarma", `¿Eliminar alarma para ${medication}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
          Alert.alert("✅", "Alarma eliminada");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Cargando alarmas...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        ⏰ Alarmas Configuradas
      </ThemedText>

      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText type="default" style={styles.emptyText}>
            No hay alarmas configuradas
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.emptySubtext}>
            Presiona el botón &quot;+&quot; para agregar una nueva alarma
          </ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {alarms.map((alarm) => (
            <ThemedView key={alarm.id} style={styles.alarmCard}>
              <View style={styles.alarmHeader}>
                <View>
                  <ThemedText type="subtitle" style={styles.medicationName}>
                    💊 {alarm.medication}
                  </ThemedText>
                  <ThemedText type="default">
                    🕐 {alarm.time} - 📏 {alarm.dosage} mg
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: alarm.isActive ? "#2ecc71" : "#e74c3c" },
                  ]}
                >
                  <ThemedText style={styles.statusText}>
                    {alarm.isActive ? "ACTIVA" : "INACTIVA"}
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="defaultSemiBold" style={styles.daysText}>
                📅 Días: {alarm.days.join(", ")}
              </ThemedText>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton]}
                  onPress={() =>
                    Alert.alert("Editar", `Editar alarma ${alarm.id}`)
                  }
                >
                  <ThemedText style={styles.buttonText}>✏️ Editar</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => deleteAlarm(alarm.id, alarm.medication)}
                >
                  <ThemedText style={styles.buttonText}>🗑️ Eliminar</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))}
        </ScrollView>
      )}

      {/* Botón flotante para agregar */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          Alert.alert("Agregar", "Funcionalidad de agregar alarma")
        }
      >
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginTop: 40,
    marginBottom: 24,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
  alarmCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alarmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 18,
    marginBottom: 4,
    color: "#1D1D1F",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  daysText: {
    marginBottom: 12,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    color: "#8E8E93",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    color: "#C7C7CC",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});
