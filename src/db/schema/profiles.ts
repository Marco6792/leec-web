import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Extends Supabase Auth's auth.users.
 *
 * The FK constraint to auth.users is created manually via raw SQL:
 *   ALTER TABLE profiles
 *   ADD CONSTRAINT fk_profiles_auth_users
 *   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
 *
 * A Supabase database trigger creates a profile row automatically
 * when a new user signs up (handle_auth_user_created).
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  researcherType: text("researcher_type"),
  institution: text("institution"),
  department: text("department"),
  title: text("title"),
  organization: text("organization"),
  speciality: text("speciality"),
  biography: text("biography"),
  researchInterests: text("research_interests").array().default([]),
  orcid: text("orcid"),
  googleScholar: text("google_scholar"),
  researchGate: text("research_gate"),
  linkedIn: text("linked_in"),
  website: text("website"),
  phone: text("phone"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
