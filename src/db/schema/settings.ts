import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactAddress: text("contact_address"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  collaborationText: text("collaboration_text"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
