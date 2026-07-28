import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { publications } from "./publications";

// ─── Publication Likes ──────────────────────────────────────────────────────

export const publicationLikes = pgTable(
  "publication_likes",
  {
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.publicationId, table.userId] })],
);

// ─── Publication Comments ───────────────────────────────────────────────────

export const publicationComments = pgTable("publication_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicationId: uuid("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Publication Ratings ────────────────────────────────────────────────────

export const publicationRatings = pgTable(
  "publication_ratings",
  {
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.publicationId, table.userId] })],
);

// ─── Publication Reviews ────────────────────────────────────────────────────

export const publicationReviews = pgTable("publication_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  publicationId: uuid("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title"),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  pros: text("pros"),
  cons: text("cons"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
