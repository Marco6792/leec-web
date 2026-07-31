import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  date,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const equipmentCategoryEnum = pgEnum("equipment_category", [
  "instrument",
  "sensor",
  "computer",
  "network",
  "mechanical",
  "chemical",
  "safety",
  "office",
  "other",
]);

export const equipmentStatusEnum = pgEnum("equipment_status", [
  "operational",
  "maintenance",
  "repair",
  "calibration",
  "retired",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "approved",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
]);

export const maintenanceTypeEnum = pgEnum("maintenance_type", [
  "preventive",
  "corrective",
  "calibration",
  "upgrade",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const equipment = pgTable("equipment", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: equipmentCategoryEnum("category").default("instrument"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  serialNumber: text("serial_number"),
  specifications: text("specifications"),
  specificationsJson: jsonb("specifications_json").default({}),
  usage: text("usage"),
  location: text("location"),
  imageUrl: text("image_url"),
  status: equipmentStatusEnum("status").default("operational"),
  acquiredDate: date("acquired_date"),
  value: numeric("value"),
  currency: text("currency").default("XAF"),
  custodianId: uuid("custodian_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  isPublic: boolean("is_public").default(false),
  availableForTesting: boolean("available_for_testing").default(false),
  depreciationSchedule: jsonb("depreciation_schedule").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const equipmentBookings = pgTable("equipment_bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  equipmentId: uuid("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  purpose: text("purpose"),
  status: bookingStatusEnum("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  equipmentId: uuid("equipment_id")
    .notNull()
    .references(() => equipment.id, { onDelete: "cascade" }),
  type: maintenanceTypeEnum("type").notNull(),
  description: text("description").notNull(),
  technicianId: uuid("technician_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  date: timestamp("date").defaultNow().notNull(),
  cost: numeric("cost"),
  partsUsed: jsonb("parts_used").default([]),
  nextDueDate: date("next_due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
