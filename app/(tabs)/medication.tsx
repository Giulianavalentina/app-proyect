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
  const [doseMg, setDoseMg] = useState(''); // <-- CAMBIADO: de dosage a doseMg
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
      setDoseMg(med.doseMg.toString()); // <-- CAMBIADO
      setQuantity("0");
      setSchedule(["08:00"]);
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
    if (!name.trim() || !doseMg.trim()) { // <-- CAMBIADO
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Convertir doseMg de string a número
    const doseMgValue = parseInt(doseMg.trim()); // <-- CAMBIADO
    if (isNaN(doseMgValue) || doseMgValue <= 0) {
      Alert.alert('Error', 'La dosis debe ser un número válido mayor que 0');
      return;
    }

    try {
      if (isEditing) {
        // --- ACTUALIZAR ---
        await medService.updateMedication(Number(id), {
          name: name.trim(),
          doseMg: doseMgValue,  // <-- CORRECTO: doseMg
          notes: null,
          startDate: Date.now(),
        });

        Alert.alert('✅', 'Medicamento actualizado');
      } else {
        // --- CREAR ---
        await medService.addMedication({
          name: name.trim(),
          doseMg: doseMgValue,  // <-- CORRECTO: doseMg
          notes: null,
          startDate: Date.now(),
        });

        Alert.alert('✅', 'Medicamento guardado correctamente');
      }

      router.back();

    } catch (error) {
      console.error('Error guardando medicamento:', error);
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
          <Text style={styles.label}>Dosis (mg)</Text>
          <TextInput
            style={styles.input}
            value={doseMg} 
            onChangeText={setDoseMg} 
            placeholder="Ej: 500"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.hint}>Ingresa la dosis en miligramos</Text>
        </View>

        {/* Horarios (opcional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horarios de Toma</Text>
          {schedule.map((time, index) => (
            <View key={index} style={styles.timeSlotContainer}>
              <TextInput
                style={[styles.input, styles.timeInput]}
                value={time}
                onChangeText={(text) => updateTimeSlot(index, text)}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
              {schedule.length > 1 && (
                <TouchableOpacity
                  style={styles.removeTimeButton}
                  onPress={() => removeTimeSlot(index)}
                >
                  <Text style={styles.removeTimeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity style={styles.addTimeButton} onPress={addTimeSlot}>
            <Text style={styles.addTimeText}>+ Agregar horario</Text>
          </TouchableOpacity>
        </View>

        {/* Botones */}
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
    color: '#333',
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
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  timeSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  removeTimeButton: {
    backgroundColor: '#FF3B30',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTimeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addTimeButton: {
    backgroundColor: '#E8F4FC',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addTimeText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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