// Servicio simple para medicamentos
import * as SQLite from "expo-sqlite";

// Tipos
export interface Medication {
  id?: number;
  name: string;
  doseMg: number;
  notes?: string | null;
  startDate?: number;
}

export interface Alarm {
  id?: number;
  medicationId: number;
  time: string;
  days?: string | null;
  active?: boolean;
}

// Abrir base de datos
const db = SQLite.openDatabaseSync("pastillero.db");

export function useMedicationService() {
  return {
    // Crear medicamento
    addMedication: async (data: Medication) => {
      const result = db.runSync(
        "INSERT INTO medications (name, dose_mg, notes, start_date) VALUES (?, ?, ?, ?)",
        [
          data.name,
          data.doseMg,
          data.notes || null,
          data.startDate || Date.now(),
        ]
      );
      return result.lastInsertRowId;
    },

    // Obtener medicamentos
    getMedications: async (): Promise<Medication[]> => {
      const rows = db.getAllSync("SELECT * FROM medications ORDER BY id DESC");
      return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        doseMg: row.dose_mg,
        notes: row.notes,
        startDate: row.start_date,
      }));
    },

    // Eliminar medicamento
    deleteMedication: async (id: number) => {
      db.runSync("DELETE FROM medications WHERE id = ?", [id]);
    },

    // Actualizar medicamento
    updateMedication: async (id: number, data: Partial<Medication>) => {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        updates.push("name = ?");
        values.push(data.name);
      }
      if (data.doseMg !== undefined) {
        updates.push("dose_mg = ?");
        values.push(data.doseMg);
      }
      if (data.notes !== undefined) {
        updates.push("notes = ?");
        values.push(data.notes);
      }

      if (updates.length > 0) {
        values.push(id);
        db.runSync(
          `UPDATE medications SET ${updates.join(", ")} WHERE id = ?`,
          values
        );
      }
    },

    // Alarmas
    addAlarm: async (data: Alarm) => {
      const result = db.runSync(
        "INSERT INTO alarms (medication_id, time, days, active) VALUES (?, ?, ?, ?)",
        [data.medicationId, data.time, data.days || null, data.active ? 1 : 0]
      );
      return result.lastInsertRowId;
    },

    getAlarms: async (): Promise<Alarm[]> => {
      const rows = db.getAllSync("SELECT * FROM alarms");
      return rows.map((row: any) => ({
        id: row.id,
        medicationId: row.medication_id,
        time: row.time,
        days: row.days,
        active: row.active === 1,
      }));
    },
  };
}
