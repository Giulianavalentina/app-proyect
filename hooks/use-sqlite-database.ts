import { useEffect, useState } from 'react';
// Importamos el servicio que tiene la lógica SQL
import { MedicationService } from '../src/services/medicationService';

// Definición de la estructura de datos que manejará el hook
interface Medication {
  id: number;
  name: string;
  dosage: string;
  quantity: number;
  schedule: string[]; 
  alarmsEnabled: boolean;
}

// Hook personalizado para gestionar el estado de los medicamentos
export const useSQLiteDatabase = () => {
  const [medicamentos, setMedicamentos] = useState<Medication[]>([]);
  const [isDBReady, setIsDBReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Función para cargar los datos desde el servicio ---
  const loadMedicamentos = async () => {
    setIsLoading(true);
    try {
      // Llamamos a la función de obtención del servicio
      const data = await MedicationService.getMedications();
      setMedicamentos(data as Medication[]);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      setMedicamentos([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Inicialización y carga inicial ---
  useEffect(() => {
    // 1. Asegurar que la tabla exista y marcar la DB como lista
    MedicationService.createTable().then(success => {
      if (success) {
        setIsDBReady(true);
        loadMedicamentos(); // 2. Cargar datos iniciales
      }
    });
  }, []);

  // Función para forzar la recarga de la lista
  const refetchMedicamentos = () => {
      if (isDBReady) {
          loadMedicamentos();
      }
  }

  return { 
    medicamentos, 
    isDBReady, 
    isLoading,
    refetchMedicamentos // Función para recargar los datos
  };
};