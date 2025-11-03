import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useAlarms } from '../../src/hooks/useAlarms';

export default function AlarmsScreen() {
  const { alarms, loading, deleteAlarm } = useAlarms();

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
        Alarmas Configuradas
      </ThemedText>
      
      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText type="default" style={styles.emptyText}>
            No hay alarmas configuradas
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.emptySubtext}>
            Presiona el botón "+" para agregar una nueva alarma
          </ThemedText>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {alarms.map((alarm) => (
            <ThemedView key={alarm.id} style={styles.alarmCard}>
              <View style={styles.alarmInfo}>
                <ThemedText type="subtitle" style={styles.medicationName}>
                  {alarm.medication}
                </ThemedText>
                <ThemedText type="default">
                  {alarm.dosage} mg - {alarm.time}
                </ThemedText>
                <ThemedText type="defaultSemiBold">
                  Días: {alarm.days.join(', ')}
                </ThemedText>
                <ThemedText type="default">
                  Estado: {alarm.isActive ? 'Activa' : 'Inactiva'}
                </ThemedText>
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.button, styles.editButton]}
                  onPress={() => console.log('Editar:', alarm.id)}
                >
                  <ThemedText style={styles.buttonText}>Editar</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => deleteAlarm(alarm.id)}
                >
                  <ThemedText style={styles.buttonText}>Eliminar</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  alarmCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  alarmInfo: {
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});