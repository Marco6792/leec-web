import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

// ─── Enums ─────────────────────────────────────────────────────────────────

export const publicationTypeEnum = pgEnum("publication_type", [
  "journal",
  "conference",
  "book",
  "chapter",
  "report",
  "dataset",
  "thesis",
  "patent",
  "software",
  "preprint",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const publications = pgTable("publications", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: publicationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  year: integer("year").notNull(),
  doi: text("doi").unique(),
  journal: text("journal"),
  conference: text("conference"),
  publisher: text("publisher").array().default([]),
  volume: text("volume"),
  issue: text("issue"),
  pages: text("pages"),
  isbn: text("isbn"),
  issn: text("issn"),
  patentNumber: text("patent_number"),
  repository: text("repository"),
  imageUrl: text("image_url"),
  citationCount: integer("citation_count").default(0),
  altmetricScore: integer("altmetric_score").default(0),
  viewCount: integer("view_count").default(0),
  pdfUrl: text("pdf_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  documents: jsonb("documents").$type<string[]>().default([]),
  sourceDataUrl: text("source_data_url"),
  codeUrl: text("code_url"),
  keywords: text("keywords").array().default([]),
  researchDomains: text("research_domains").array().default([]),
  language: text("language").default("en"),
  license: text("license"),
  openAccess: boolean("open_access").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Junction table: many-to-many between publications and profiles.
 */
export const publicationAuthors = pgTable(
  "publication_authors",
  {
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    authorOrder: integer("author_order").notNull(),
    corresponding: boolean("corresponding").default(false),
    affiliation: text("affiliation"),
  },
  (table) => [
    primaryKey({ columns: [table.publicationId, table.profileId] }),
  ],
);
