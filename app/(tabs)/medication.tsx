import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useMedicationService } from '../../src/services/medicationService';

export default function AddOrEditMedicationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();   // <-- Recibe el ID si hay edición
  const medService = useMedicationService();

  const isEditing = Boolean(id);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [schedule, setSchedule] = useState<string[]>(['08:00']);

  // --- CARGAR DATOS SI ES EDICIÓN ---
  useEffect(() => {
    if (isEditing) {
      loadMedication();
    }
  }, [id]);

  const loadMedication = async () => {
    const meds = await medService.getMedications();
    const med = meds.find((m) => m.id === Number(id));

    if (med) {
      setName(med.name);
      setDosage(med.dosage);
      setQuantity("0"); // porque tu schema no tiene quantity aún
      setSchedule(["08:00"]); // placeholder, luego podemos adaptarlo
    }
  };

  const addTimeSlot = () => {
    setSchedule(prev => [...prev, '08:00']);
  };

  const updateTimeSlot = (index: number, time: string) => {
    setSchedule(prev => prev.map((slot, i) => i === index ? time : slot));
  };

  const removeTimeSlot = (index: number) => {
    if (schedule.length > 1) {
      setSchedule(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      if (isEditing) {
        // --- ACTUALIZAR ---
        await medService.updateMedication(Number(id), {
          name: name.trim(),
          dosage: dosage.trim(),
          notes: null,
          startDate: Date.now(),
        });

        Alert.alert('✅', 'Medicamento actualizado');
      } else {
        // --- CREAR ---
        await medService.addMedication({
          name: name.trim(),
          dosage: dosage.trim(),
          notes: null,
          startDate: Date.now(),
        });

        Alert.alert('✅', 'Medicamento guardado correctamente');
      }

      router.back();

    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo guardar el medicamento');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.headerText}>
          {isEditing ? "Editar Medicamento" : "Nuevo Medicamento"}
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Medicamento</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Aspirina, Paracetamol"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dosis</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ej: 500mg, 10ml"
            placeholderTextColor="#999"
          />
        </View>

        {/* El resto de tu UI sigue igual */}
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditing ? "Actualizar" : "Guardar Medicamento"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
