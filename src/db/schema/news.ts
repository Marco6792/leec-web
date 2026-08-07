import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { researchCenters } from "./institution";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const eventTypeEnum = pgEnum("event_type", [
  "seminar",
  "workshop",
  "conference",
  "defense",
  "meeting",
  "social",
  "other",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const news = pgTable("news", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  authorId: uuid("author_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  pinned: boolean("pinned").default(false),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  labId: uuid("lab_id").references(() => researchCenters.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").default("other"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location"),
  isOnline: boolean("is_online").default(false),
  meetingUrl: text("meeting_url"),
  organizerId: uuid("organizer_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  published: boolean("published").default(false),
  registrationUrl: text("registration_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
