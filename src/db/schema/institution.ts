import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// ─── Tables ─────────────────────────────────────────────────────────────────

export const faculties = pgTable("faculties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  description: text("description"),
  deanId: uuid("dean_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  website: text("website"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  facultyId: uuid("faculty_id")
    .notNull()
    .references(() => faculties.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  description: text("description"),
  hodId: uuid("hod_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  website: text("website"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Research centers / labs (LEEC is one of these).
 * This is the core tenant for multi-tenancy — all lab-scoped data
 * references research_centers.id as lab_id.
 */
export const researchCenters = pgTable("research_centers", {
  id: uuid("id").defaultRandom().primaryKey(),
  departmentId: uuid("department_id").references(() => departments.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  acronym: text("acronym").notNull(),
  description: text("description"),
  directorId: uuid("director_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  website: text("website"),
  email: text("email"),
  address: text("address"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
