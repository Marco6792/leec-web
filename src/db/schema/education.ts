import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const education = pgTable("education", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  degree: text("degree").notNull(),
  institution: text("institution").notNull(),
  field: text("field"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  grade: text("grade"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
