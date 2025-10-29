// app/add-medication.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MedicationService } from '../../src/services/medicationService';

export default function AddMedicationScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [schedule, setSchedule] = useState<string[]>(['08:00']);

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
    if (!name.trim() || !dosage.trim() || !quantity.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un número válido');
      return;
    }

    try {
      const success = await MedicationService.saveMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        schedule: schedule,
        quantity: Number(quantity),
        alarmsEnabled: true
      });

      if (success) {
        Alert.alert('✅', 'Medicamento guardado correctamente');
        router.back();
      } else {
        Alert.alert('❌', 'Error al guardar el medicamento');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el medicamento');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cantidad de Pastillas</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ej: 30"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Horarios de Alarma</Text>
          {schedule.map((time, index) => (
            <View key={index} style={styles.timeSlot}>
              <TextInput
                style={styles.timeInput}
                value={time}
                onChangeText={(text) => updateTimeSlot(index, text)}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />
              {schedule.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeTimeSlot(index)}
                  style={styles.removeTimeButton}
                >
                  <Ionicons name="remove-circle" size={24} color="#FF3B30" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          
          <TouchableOpacity onPress={addTimeSlot} style={styles.addTimeButton}>
            <Ionicons name="add-circle" size={20} color="#007AFF" />
            <Text style={styles.addTimeText}>Agregar otro horario</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar Medicamento</Text>
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
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 8,
  },
  removeTimeButton: {
    padding: 4,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  addTimeText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
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