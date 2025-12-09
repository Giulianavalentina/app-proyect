import { eq } from "drizzle-orm";
import { useDrizzleDB } from "../../db";
import { alarms, medications } from "../../db/schema";

// Tipos exportados desde db/index.ts
import type {
  Alarm,
  Medication,
  NewAlarm,
  NewMedication,
} from "../../db";

export function useMedicationService() {
  const db = useDrizzleDB();

  return {
    /** -----------------------------
     *  MEDICATIONS
     *  ----------------------------- */

    // Crear medicamento
    addMedication: async (data: NewMedication) => {
      await db.insert(medications).values(data);
    },

    // Obtener lista completa
    getMedications: async (): Promise<Medication[]> => {
      return await db.select().from(medications);
    },

    // Eliminar por ID
    deleteMedication: async (id: number) => {
      await db.delete(medications).where(eq(medications.id, id));
    },

    // Actualizar por ID
    updateMedication: async (
      id: number,
      data: Partial<NewMedication>
    ) => {
      await db
        .update(medications)
        .set(data)
        .where(eq(medications.id, id));
    },

    /** -----------------------------
     *  ALARMS (asociadas a medicamentos)
     *  ----------------------------- */

    addAlarm: async (data: NewAlarm) => {
      await db.insert(alarms).values(data);
    },

    getAlarms: async (): Promise<Alarm[]> => {
      return await db.select().from(alarms);
    },

    getAlarmsByMedication: async (
      medicationId: number
    ): Promise<Alarm[]> => {
      return await db
        .select()
        .from(alarms)
        .where(eq(alarms.medicationId, medicationId));
    },

    deleteAlarm: async (id: number) => {
      await db.delete(alarms).where(eq(alarms.id, id));
    },

    updateAlarm: async (
      id: number,
      data: Partial<NewAlarm>
    ) => {
      await db.update(alarms).set(data).where(eq(alarms.id, id));
    },
  };
}
