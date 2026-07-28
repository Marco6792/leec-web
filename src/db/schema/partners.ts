import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  jsonb,
  pgEnum,
  numeric,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const partnerTypeEnum = pgEnum("partner_type", [
  "university",
  "research_institute",
  "industry",
  "government",
  "ngo",
  "funding_agency",
  "startup",
]);

export const partnerTierEnum = pgEnum("partner_tier", [
  "strategic",
  "collaborative",
  "affiliate",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "approved",
  "rejected",
  "withdrawn",
]);

export const requestTypeEnum = pgEnum("request_type", [
  "collaboration",
  "equipment_access",
  "data_access",
  "visiting_scholar",
  "joint_grant",
  "contract_research",
  "consulting",
]);

export const collaborationProjectStatusEnum = pgEnum(
  "collaboration_project_status",
  ["negotiation", "active", "completed", "terminated"],
);

export const agreementTypeEnum = pgEnum("agreement_type", [
  "mou",
  "contract_research",
  "consulting",
  "sponsored_research",
  "nda",
  "material_transfer",
]);

export const ipStatusEnum = pgEnum("ip_status", [
  "draft",
  "filed",
  "granted",
  "licensed",
  "expired",
]);

export const ipTypeEnum = pgEnum("ip_type", [
  "patent",
  "copyright",
  "know_how",
  "trademark",
  "design",
]);

export const milestoneStatusEnum = pgEnum("milestone_status", [
  "pending",
  "in_progress",
  "completed",
  "delayed",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const partners = pgTable("partners", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  website: text("website"),
  partnerType: partnerTypeEnum("partner_type").notNull(),
  tier: partnerTierEnum("tier").default("affiliate"),
  country: text("country"),
  description: text("description"),
  partnershipStart: date("partnership_start"),
  partnershipEnd: date("partnership_end"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  featured: jsonb("featured").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collaborationRequests = pgTable("collaboration_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: uuid("from_user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  toUserId: uuid("to_user_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  partnerId: uuid("partner_id").references(() => partners.id, {
    onDelete: "set null",
  }),
  projectId: uuid("project_id"),
  message: text("message").notNull(),
  requestType: requestTypeEnum("request_type").notNull(),
  status: requestStatusEnum("status").default("pending"),
  organizationName: text("organization_name"),
  collaborationType: text("collaboration_type"),
  intendedUse: text("intended_use"),
  expectedTimeline: text("expected_timeline"),
  estimatedBudget: text("estimated_budget"),
  ipTermsAgreed: boolean("ip_terms_agreed").default(false),
  ndaRequired: boolean("nda_required").default(false),
  ndaSignedAt: timestamp("nda_signed_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Formal collaboration projects that come from approved requests.
 * Includes public milestones and IP tracking.
 */
export const collaborationProjects = pgTable("collaboration_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").references(() => collaborationRequests.id, {
    onDelete: "set null",
  }),
  labId: uuid("lab_id")
    .notNull()
    .references(() => researchCenters.id, { onDelete: "cascade" }),
  partnerId: uuid("partner_id")
    .notNull()
    .references(() => partners.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  scope: text("scope"),
  agreementType: agreementTypeEnum("agreement_type"),
  agreementDocumentUrl: text("agreement_document_url"),
  status: collaborationProjectStatusEnum("status").default("negotiation"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  fundingAmount: numeric("funding_amount"),
  currency: text("currency").default("XAF"),
  piId: uuid("pi_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  partnerContactName: text("partner_contact_name"),
  partnerContactEmail: text("partner_contact_email"),
  researcherIds: uuid("researcher_ids").array().default([]),
  milestones: jsonb("milestones").default([]),
  ipDisclosures: jsonb("ip_disclosures").default([]),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Individual milestone tracking (normalized form).
 */
export const collaborationMilestones = pgTable("collaboration_milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => collaborationProjects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  completedDate: date("completed_date"),
  status: milestoneStatusEnum("status").default("pending"),
  deliverables: jsonb("deliverables").default([]),
  isPublic: boolean("is_public").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * IP disclosures / patents filed from collaboration projects.
 */
export const collaborationIpDisclosures = pgTable(
  "collaboration_ip_disclosures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => collaborationProjects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    type: ipTypeEnum("type").notNull(),
    filingStatus: ipStatusEnum("filing_status").default("draft"),
    filingDate: date("filing_date"),
    grantDate: date("grant_date"),
    patentNumber: text("patent_number"),
    inventors: uuid("inventors").array().default([]),
    licensee: text("licensee"),
    revenueShare: text("revenue_share"),
    documents: jsonb("documents").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
);
