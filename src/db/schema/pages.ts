import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Editable site pages (About, Contact, Privacy, Terms, Services, ...).
 * Content is authored in the admin panel and rendered on the public site.
 *
 * `content` supports a light markdown subset:
 *   - `## Heading`  → section heading
 *   - `- item`      → bullet list
 *   - `1. item`     → numbered list
 *   - blank lines   → paragraph breaks
 */
export const sitePages = pgTable("site_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
