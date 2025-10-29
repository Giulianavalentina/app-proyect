// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Medicamentos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alarms-screen"
        options={{
          title: 'Alarmas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
// DEBUG: Este archivo se está ejecutando
console.log('=== APP _LAYOUT CARGADO ===');
