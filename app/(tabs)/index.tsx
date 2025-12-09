import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useMedicationService } from '../../src/services/medicationService';

type MedicationItem = {
  id: number;
  name: string;
  doseMg?: number;
  // schedule, quantity, alarmsEnabled no están en el schema actual;
  // si los agregás al schema, podés descomentarlos abajo:
  // schedule?: string[];
  // quantity?: number;
  // alarmsEnabled?: boolean;
};

export default function HomeScreen() {
  const router = useRouter();
  const { getMedications, deleteMedication } = useMedicationService();

  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // --------------------------------------------------------------------
  // Cargar medicamentos desde SQLite (Drizzle)
  // --------------------------------------------------------------------
  const loadMedications = async () => {
    try {
      const meds = await getMedications();
      // Asegurarse de mapear campos si vienen diferentes
      const mapped = (meds || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        doseMg: m.doseMg ?? m.dosage ?? undefined,
        // schedule: m.schedule ? JSON.parse(m.schedule) : undefined,
        // quantity: m.quantity,
        // alarmsEnabled: m.alarmsEnabled === 1 ? true : false,
      }));
      setMedications(mapped);
    } catch (error) {
      console.error('Error loading medications:', error);
      setMedications([]);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedications();
    setRefreshing(false);
  };

  // --------------------------------------------------------------------
  // Eliminar medicamento
  // --------------------------------------------------------------------
  const handleDelete = (medication: MedicationItem) => {
    Alert.alert(
      'Eliminar Medicamento',
      `¿Estás seguro de que quieres eliminar ${medication.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(medication.id);
              await loadMedications();
              Alert.alert('✅ Eliminado', 'Medicamento eliminado correctamente');
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('❌ Error', 'No se pudo eliminar el medicamento');
            }
          },
        },
      ]
    );
  };

  // --------------------------------------------------------------------
  // Render de cada medicamento
  // --------------------------------------------------------------------
  const renderMedication = ({ item }: { item: MedicationItem }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>
          {item.doseMg != null ? `${item.doseMg} mg` : 'Dosis no especificada'}
        </Text>

        {/* Si tienes schedule en el schema, descomenta */}
        {/* {item.schedule && (
          <Text style={styles.medicationSchedule}>
            Horarios: {item.schedule.join(', ')}
          </Text>
        )} */}

        {/* {item.quantity && (
          <Text style={styles.medicationQuantity}>
            Cantidad: {item.quantity} pastillas
          </Text>
        )} */}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
onPress={() => router.push({ pathname: "/medication", params: { id: item.id } })}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // --------------------------------------------------------------------
  // Render principal
  // --------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mis Medicamentos</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/medication')}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista o mensaje vacío */}
      {medications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="medical" size={64} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No hay medicamentos</Text>
          <Text style={styles.emptyStateSubtext}>
            Presiona "Agregar" para añadir tu primer medicamento
          </Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          renderItem={renderMedication}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
        />
      )}
    </View>
  );
}

// --------------------------------------------------------------------
// Estilos
// --------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  medicationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  medicationSchedule: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  medicationQuantity: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    // `gap` no está ampliamente soportado en RN; usar margen/padding en botones
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
