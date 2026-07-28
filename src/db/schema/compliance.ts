import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { projects } from "./projects";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const complianceTypeEnum = pgEnum("compliance_type", [
  "glp",
  "iso_17025",
  "iso_9001",
  "safety",
  "environmental",
  "data_protection",
]);

export const complianceStatusEnum = pgEnum("compliance_status", [
  "compliant",
  "non_compliant",
  "pending",
  "not_applicable",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "view",
  "export",
  "login",
  "logout",
]);

export const ethicsTypeEnum = pgEnum("ethics_type", [
  "human_studies",
  "animal_welfare",
  "biosafety",
  "radiation",
  "chemical_safety",
  "data_privacy",
]);

export const ethicsStatusEnum = pgEnum("ethics_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "expired",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const complianceRecords = pgTable("compliance_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id")
    .notNull()
    .references(() => researchCenters.id, { onDelete: "cascade" }),
  type: complianceTypeEnum("type").notNull(),
  standard: text("standard").notNull(),
  status: complianceStatusEnum("status").default("pending"),
  checklist: jsonb("checklist").default([]),
  findings: jsonb("findings").default([]),
  correctiveActions: jsonb("corrective_actions").default([]),
  auditedBy: text("audited_by"),
  auditDate: date("audit_date"),
  nextAuditDate: date("next_audit_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Immutable audit log — insert-only via database triggers.
 * Captures all changes to critical tables.
 */
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  action: auditActionEnum("action").notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  userId: uuid("user_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ethicsApprovals = pgTable("ethics_approvals", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  type: ethicsTypeEnum("type").notNull(),
  committee: text("committee").notNull(),
  referenceCode: text("reference_code"),
  status: ethicsStatusEnum("status").default("draft"),
  approvalDate: date("approval_date"),
  expiryDate: date("expiry_date"),
  documents: jsonb("documents").default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
