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

// ─── Enums ─────────────────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum("notification_type", [
  "booking_confirmed",
  "booking_cancelled",
  "maintenance_due",
  "calibration_due",
  "inventory_low",
  "collaboration_request",
  "experiment_shared",
  "publication_added",
  "grant_deadline",
  "system_alert",
  "message",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "sms",
  "push",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  link: text("link"),
  metadata: jsonb("metadata").default({}),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique(),
  emailEnabled: boolean("email_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  pushEnabled: boolean("push_enabled").default(false),
  inAppEnabled: boolean("in_app_enabled").default(true),
  digestFrequency: text("digest_frequency").default("instant"),
  quietHoursStart: text("quiet_hours_start"),
  quietHoursEnd: text("quiet_hours_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
