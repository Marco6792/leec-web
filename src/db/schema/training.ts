import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  jsonb,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";
import { equipment } from "./equipment";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const trainingSessionStatusEnum = pgEnum("training_session_status", [
  "draft",
  "pending_approval",
  "open",
  "in_progress",
  "completed",
  "cancelled",
]);

export const trainingLevelEnum = pgEnum("training_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
  "dropped",
]);

export const assessmentTypeEnum = pgEnum("assessment_type", [
  "quiz",
  "practical",
  "project",
  "certification",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

/**
 * Training sessions created by lab supervisors.
 * Status flows: draft → pending_approval → open → in_progress → completed/cancelled
 */
export const trainingSessions = pgTable("training_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id")
    .notNull()
    .references(() => researchCenters.id, { onDelete: "cascade" }),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  level: trainingLevelEnum("level").default("beginner"),
  prerequisites: jsonb("prerequisites").default([]),
  /** Direct link to equipment this training covers */
  linkedEquipmentIds: uuid("linked_equipment_ids").array().default([]),
  curriculum: jsonb("curriculum").default([]),
  maxParticipants: integer("max_participants"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  schedule: jsonb("schedule").default([]),
  status: trainingSessionStatusEnum("status").default("draft"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Links scholars to training sessions.
 */
export const trainingEnrollments = pgTable("training_enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => trainingSessions.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  status: enrollmentStatusEnum("status").default("pending"),
  invitedBy: uuid("invited_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  eligibilityNotes: text("eligibility_notes"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  completedAt: timestamp("completed_at"),
});

/**
 * Assessments / exams within a training session.
 */
export const trainingAssessments = pgTable("training_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => trainingSessions.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: assessmentTypeEnum("type").default("quiz"),
  maxScore: integer("max_score"),
  passingScore: integer("passing_score"),
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Individual results for each scholar on each assessment.
 */
export const trainingResults = pgTable("training_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => trainingAssessments.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  score: integer("score"),
  passed: boolean("passed"),
  submittedAt: timestamp("submitted_at"),
  gradedAt: timestamp("graded_at"),
  graderId: uuid("grader_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
