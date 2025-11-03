import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TarjetaParaCadaMedicamentoProgramado = ({
  nombre,
  dosis,
  horarios,
}: {
  nombre: string;
  dosis: number;
  horarios: Date[];
}) => {
  return (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{nombre}</Text>
        <Text style={styles.medicationDosage}>{dosis}mg</Text>
        <Text style={styles.medicationSchedule}>
          {`Horarios: ${horarios
            .map((hora) =>
              hora.toLocaleTimeString("es-AR", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })
            )
            .join(", ")}`}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  addButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  medicationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  medicationSchedule: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  medicationQuantity: {
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default TarjetaParaCadaMedicamentoProgramado;
