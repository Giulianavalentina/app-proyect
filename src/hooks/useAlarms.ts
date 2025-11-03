import { useEffect, useState } from 'react';

interface Alarm {
  id: string;
  medication: string;
  dosage: number;
  time: string;
  isActive: boolean;
  days: string[];
}

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Datos de prueba para probar
      const testAlarms: Alarm[] = [
        {
          id: '1',
          medication: 'Paracetamol',
          dosage: 500, // mg
          time: '08:00', // formato 24h
          isActive: true,
          days: ['LUN', 'MAR', 'MIE', 'JUE', 'VIE']
        },
        {
          id: '2', 
          medication: 'Ibuprofeno',
          dosage: 400, // mg
          time: '20:00', // formato 24h
          isActive: true,
          days: ['LUN', 'MIE', 'VIE']
        }
      ];
      
      // setAlarms([]); // Para lista vacia
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const deleteAlarm = (id: string) => {
    console.log('Eliminar alarma:', id);
  };

  return {
    alarms,        
    loading,       
    deleteAlarm,   
  };
}