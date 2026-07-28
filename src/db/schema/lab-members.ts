import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const labRoleEnum = pgEnum("lab_role", [
  "director",
  "pi",
  "researcher",
  "phd_student",
  "master_student",
  "technician",
  "visitor",
  "external",
  "client",
]);

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "inactive",
  "alumni",
]);

// ─── Auth users reference (virtual) ────────────────────────────────────────

/**
 * Virtual reference to Supabase Auth's auth.users table (auth schema).
 * Used for type inference only — the actual FK constraint is created via raw SQL:
 *   ALTER TABLE profiles ADD CONSTRAINT fk_profiles_auth_users
 *   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
 *
 * Drizzle does NOT create this table in migrations because profiles.id
 * does not use .references(() => authUsers.id) — the FK is SQL-managed.
 */
export const authUsers = pgTable("auth_users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
});

// ─── Tables ─────────────────────────────────────────────────────────────────

/**
 * Links users to labs/research centers with a specific role.
 * This is the core multi-tenancy junction table.
 *
 * Both FKs reference public schema tables — safe for Drizzle migrations.
 */
export const labMembers = pgTable(
  "lab_members",
  {
    labId: uuid("lab_id")
      .notNull()
      .references(() => researchCenters.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role: labRoleEnum("role").notNull(),
    status: memberStatusEnum("status").default("active"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
  },
  (table) => [primaryKey({ columns: [table.labId, table.userId] })],
);
