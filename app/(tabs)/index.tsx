// app/(tabs)/index.tsx
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
  View
} from 'react-native';
import { MedicationService } from '../../src/services/medicationService';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  quantity: number;
  alarmsEnabled: boolean;
}

export default function HomeScreen() {
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadMedications = async () => {
    try {
      // Esto depende de cómo tengas implementado MedicationService
      const meds = await MedicationService.getMedications();
      setMedications(meds || []);
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

  const handleDelete = (medication: Medication) => {
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
              await MedicationService.deleteMedication(medication.id);
              await loadMedications(); // Recargar la lista
              Alert.alert('✅', 'Medicamento eliminado correctamente');
            } catch (error) {
              Alert.alert('❌', 'Error al eliminar el medicamento');
            }
          },
        },
      ]
    );
  };

  const handleEdit = (medication: Medication) => {
    // Navegar a pantalla de edición
    // router.push(`/medication/${medication.id}`);
  };

  const renderMedication = ({ item }: { item: Medication }) => (
    <View style={styles.medicationCard}>
      <View style={styles.medicationInfo}>
        <Text style={styles.medicationName}>{item.name}</Text>
        <Text style={styles.medicationDosage}>{item.dosage}</Text>
        <Text style={styles.medicationSchedule}>
          Horarios: {item.schedule.join(', ')}
        </Text>
        <Text style={styles.medicationQuantity}>
          Cantidad: {item.quantity} pastillas
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => handleEdit(item)}
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

  return (
    <View style={styles.container}>
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
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
        />
      )}
    </View>
  );
}

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
    shadowColor: '#000',
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