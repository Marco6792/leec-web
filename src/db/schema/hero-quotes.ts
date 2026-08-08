import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Rotating subtitle quotes shown on the public hero. Authored and managed
 * from the admin panel; the hero crossfades between published quotes.
 */
export const heroQuotes = pgTable("hero_quotes", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
