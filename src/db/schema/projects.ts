import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  jsonb,
  integer,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "completed",
  "on_hold",
  "cancelled",
  "proposed",
]);

export const grantStatusEnum = pgEnum("grant_status", [
  "draft",
  "submitted",
  "active",
  "completed",
  "rejected",
  "closed",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const researchDomains = pgTable("research_domains", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  leadResearcherId: uuid("lead_researcher_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  featuredImageUrl: text("featured_image_url"),
  tags: text("tags").array().default([]),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("active"),
  piId: uuid("pi_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  fundingSource: text("funding_source"),
  fundingAmount: numeric("funding_amount"),
  currency: text("currency").default("XAF"),
  milestones: jsonb("milestones").default([]),
  deliverables: jsonb("deliverables").default([]),
  partners: jsonb("partners").default([]),
  researcherIds: uuid("researcher_ids").array().default([]),
  researchDomains: text("research_domains").array().default([]),
  outputs: jsonb("outputs").default([]),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grants = pgTable("grants", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "set null",
  }),
  agency: text("agency").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("EUR"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  status: grantStatusEnum("status").default("draft"),
  referenceCode: text("reference_code"),
  reportingSchedule: jsonb("reporting_schedule").default([]),
  budgetLines: jsonb("budget_lines").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const grantReports = pgTable("grant_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  grantId: uuid("grant_id")
    .notNull()
    .references(() => grants.id, { onDelete: "cascade" }),
  period: text("period").notNull(),
  progress: text("progress"),
  financials: jsonb("financials").default({}),
  submittedAt: timestamp("submitted_at"),
  approvedAt: timestamp("approved_at"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
