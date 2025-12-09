import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const medications = sqliteTable("medications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  doseMg: integer("dose_mg").notNull(),
});

export const alarms = sqliteTable("alarms", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),

  time: text("time").notNull(), // formato "HH:mm"
  days: text("days"), // ej: "L,M,X,J,V" o null
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});
