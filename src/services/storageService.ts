import AsyncStorage from '@react-native-async-storage/async-storage';

const ALARMS_STORAGE_KEY = '@smart_pillbox_alarms';

export interface Alarm {
  id: string;
  medication: string;
  dosage: number; // en mg
  time: string; // formato 24hs
  isActive: boolean;
  days: string[]; // ["LUN", "MAR", "MIE", ...]
}

export const StorageService = {
  
  async saveAlarms(alarms: Alarm[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(alarms);
      await AsyncStorage.setItem(ALARMS_STORAGE_KEY, jsonValue);
      console.log('Alarmas guardadas correctamente');
    } catch (error) {
      console.error('Error guardando alarmas:', error);
      throw error;
    }
  },

  async loadAlarms(): Promise<Alarm[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(ALARMS_STORAGE_KEY);
      
      if (jsonValue == null) {
        console.log('No hay alarmas guardadas, devolviendo lista vacía');
        return [];
      }
      
      const alarms = JSON.parse(jsonValue) as Alarm[];
      console.log('Alarmas cargadas:', alarms.length);
      return alarms;
    } catch (error) {
      console.error('Error cargando alarmas:', error);
      return [];
    }
  },

  async addAlarm(alarmData: Omit<Alarm, 'id'>): Promise<Alarm> {
    try {
      const alarms = await this.loadAlarms();
      const newAlarm: Alarm = {
        ...alarmData,
        id: Date.now().toString(), // ID único basado en timestamp
      };
      
      const updatedAlarms = [...alarms, newAlarm];
      await this.saveAlarms(updatedAlarms);
      return newAlarm;
    } catch (error) {
      console.error('Error agregando alarma:', error);
      throw error;
    }
  },

  async updateAlarm(id: string, updatedAlarm: Omit<Alarm, 'id'>): Promise<void> {
    try {
      const alarms = await this.loadAlarms();
      const updatedAlarms = alarms.map(alarm =>
        alarm.id === id ? { ...updatedAlarm, id } : alarm
      );
      await this.saveAlarms(updatedAlarms);
    } catch (error) {
      console.error('Error actualizando alarma:', error);
      throw error;
    }
  },

  async deleteAlarm(id: string): Promise<void> {
    try {
      const alarms = await this.loadAlarms();
      const updatedAlarms = alarms.filter(alarm => alarm.id !== id);
      await this.saveAlarms(updatedAlarms);
    } catch (error) {
      console.error('Error eliminando alarma:', error);
      throw error;
    }
  },

  async clearAlarms(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ALARMS_STORAGE_KEY);
      console.log('Todas las alarmas eliminadas');
    } catch (error) {
      console.error('Error limpiando alarmas:', error);
      throw error;
    }
  },
};