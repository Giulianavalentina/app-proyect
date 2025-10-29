// src/services/medicationService.ts
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string[];
  quantity: number;
  alarmsEnabled: boolean;
}

export class MedicationService {
  private static storageKey = 'medications';

  static async saveMedication(medication: Omit<Medication, 'id'>): Promise<boolean> {
    try {
      const medications = await this.getMedications();
      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
      };
      medications.push(newMedication);
      await this.saveToStorage(medications);
      return true;
    } catch (error) {
      console.error('Error saving medication:', error);
      return false;
    }
  }

  static async getMedications(): Promise<Medication[]> {
    try {
      // Por ahora retornamos datos de ejemplo para probar
      return [
        {
          id: '1',
          name: 'Aspirina',
          dosage: '500mg',
          schedule: ['08:00', '20:00'],
          quantity: 30,
          alarmsEnabled: true
        },
        {
          id: '2', 
          name: 'Vitamina C',
          dosage: '1000mg',
          schedule: ['09:00'],
          quantity: 60,
          alarmsEnabled: true
        }
      ];
    } catch (error) {
      console.error('Error getting medications:', error);
      return [];
    }
  }

  static async deleteMedication(id: string): Promise<boolean> {
    try {
      const medications = await this.getMedications();
      const filteredMeds = medications.filter(med => med.id !== id);
      await this.saveToStorage(filteredMeds);
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      return false;
    }
  }

  static async updateMedication(id: string, updates: Partial<Medication>): Promise<boolean> {
    try {
      const medications = await this.getMedications();
      const index = medications.findIndex(med => med.id === id);
      if (index === -1) return false;
      
      medications[index] = { ...medications[index], ...updates };
      await this.saveToStorage(medications);
      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      return false;
    }
  }

  private static async saveToStorage(medications: Medication[]): Promise<void> {
    // Para probar, solo mostramos en consola
    console.log('Medications saved:', medications);
  }

  private static async getFromStorage(): Promise<Medication[]> {
    // Para probar, retornamos array vacío
    return [];
  }
}