import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("medicamentos.db");

// Crear tabla si no existe
export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        dosis TEXT,
        hora TEXT
      );`
    );
  });
};

// Agregar un medicamento
export const agregarMedicamento = (
  nombre: string,
  dosis: string,
  hora: string
) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO medicamentos (nombre, dosis, hora) VALUES (?, ?, ?);",
      [nombre, dosis, hora]
    );
  });
};

// Obtener todos los medicamentos
export const obtenerMedicamentos = (callback: (meds: any[]) => void) => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM medicamentos;", [], (_, { rows }) => {
      callback(rows._array);
    });
  });
};

// Borrar un medicamento
export const borrarMedicamento = (id: number) => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM medicamentos WHERE id = ?;", [id]);
  });
};
