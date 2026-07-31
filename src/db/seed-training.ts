/**
 * Seed script: Inserts the 6 demo training sessions from _demo-data.ts
 * into the Supabase database so the public /training page shows real data.
 *
 * Also creates the `training_sessions` table if it doesn't exist (since
 * drizzle-kit has trouble with the Supabase pooler on some environments).
 *
 * Usage:
 *   bun run src/db/seed-training.ts
 *
 * Idempotent — skips sessions whose slug already exists in the DB.
 */

import { db } from "./index";
import { researchCenters, profiles } from "./schema";
import { eq, sql } from "drizzle-orm";
import { demoSessions } from "../app/training/_demo-data";

// ─── Config ───────────────────────────────────────────────────────────────

const LEEC_LAB_ID = "5826efb9-5ad6-4acb-8420-e32e6b47998c";

// ─── Helpers ──────────────────────────────────────────────────────────────

async function ensureTableExists(): Promise<boolean> {
  try {
    // Check if the table exists by querying information_schema
    const [result] = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'training_sessions'
      ) as exists
    `);
    const exists = result?.exists ?? false;
    if (exists) return true;

    console.log("  Creating training_sessions table...");

    // Create the enum types first (if they don't exist)
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."training_session_status" AS ENUM('draft', 'pending_approval', 'open', 'in_progress', 'completed', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "public"."training_level" AS ENUM('beginner', 'intermediate', 'advanced');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create the training_sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "training_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "lab_id" uuid NOT NULL,
        "creator_id" uuid NOT NULL,
        "slug" text NOT NULL,
        "title" text NOT NULL,
        "description" text,
        "level" "training_level" DEFAULT 'beginner',
        "prerequisites" jsonb DEFAULT '[]'::jsonb,
        "linked_equipment_ids" uuid[] DEFAULT '{}',
        "curriculum" jsonb DEFAULT '[]'::jsonb,
        "max_participants" integer,
        "start_date" date,
        "end_date" date,
        "schedule" jsonb DEFAULT '[]'::jsonb,
        "status" "training_session_status" DEFAULT 'draft',
        "published" boolean DEFAULT false,
        "published_at" timestamp,
        "image_url" text,
        "tags" text[] DEFAULT '{}',
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "training_sessions_slug_unique" UNIQUE("slug")
      );
    `);

    console.log("  ✅ training_sessions table created.\n");
    return true;
  } catch (err) {
    // If table creation fails (e.g. no permissions), try inserting anyway
    // since the table might exist from a previous migration attempt
    console.log("  ⚠️  Could not auto-create table, will attempt insert directly.");
    return false;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding training sessions...\n");

  // ─── 0. Ensure training_sessions table exists ───────────────────────
  const tableReady = await ensureTableExists();
  if (!tableReady) {
    console.log("  Attempting insert anyway (table may already exist)...\n");
  }

  // ─── 1. Ensure the LEEC lab exists ──────────────────────────────────
  const [lab] = await db
    .select({ id: researchCenters.id })
    .from(researchCenters)
    .where(eq(researchCenters.id, LEEC_LAB_ID))
    .limit(1);

  if (!lab) {
    console.log("  Creating LEEC research center...");
    await db.insert(researchCenters).values({
      id: LEEC_LAB_ID,
      name: "Laboratory of Electrical Engineering and Computing",
      slug: "leec",
      acronym: "LEEC",
      description:
        "The Laboratory of Electrical Engineering and Computing (LEEC) at the University of Buea, Cameroon, focuses on power electronics, energy harvesting, and IoT systems for sustainable development in Africa.",
      isActive: true,
    });
    console.log("  ✅ LEEC lab created.\n");
  } else {
    console.log("  ✅ LEEC lab already exists.\n");
  }

  // ─── 2. Find the first non-null profile to use as creator ──────────
  const [creator] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .limit(1);

  if (!creator) {
    console.error(
      "  ❌ No profiles found in the database. Create a user first via signup, then re-run this seed."
    );
    process.exit(1);
  }
  console.log(`  Using profile ${creator.id} as session creator.\n`);

  // ─── 3. Insert demo sessions (skip existing slugs) ──────────────────
  let created = 0;
  let skipped = 0;

  for (const demo of demoSessions) {
    // Check if slug already exists using raw SQL (table-independent check)
    const [existing] = await db.execute(sql`
      SELECT id FROM training_sessions WHERE slug = ${demo.slug} LIMIT 1
    `) as unknown as [{ id: string }] | [];

    if (existing) {
      console.log(`  ⏭️  Skipping "${demo.title}" (slug already exists)`);
      skipped++;
      continue;
    }

    // Convert demo curriculum (string[]) to curriculum JSON objects
    const curriculum = demo.curriculum.map((entry: string, i: number) => ({
      week: i + 1,
      topic: entry,
      materials: [] as string[],
    }));

    // Set published status based on demo status
    const isPublished = demo.status === "open" || demo.status === "in_progress";

    // Build tags as a raw Postgres array string to avoid postgres.js parameter expansion
    const tagsStr = `{${demo.tags.map((t: string) => `"${t.replace(/"/g, '\\"')}"`).join(",")}}`;

    await db.execute(sql`
      INSERT INTO training_sessions (
        lab_id, creator_id, slug, title, description,
        level, status, max_participants, start_date, end_date,
        schedule, image_url, tags, curriculum, published, published_at,
        prerequisites, linked_equipment_ids
      ) VALUES (
        ${LEEC_LAB_ID}, ${creator.id}, ${demo.slug}, ${demo.title}, ${demo.description},
        ${demo.level}::training_level, ${demo.status}::training_session_status, ${demo.maxParticipants},
        ${demo.startDate}, ${demo.endDate},
        ${JSON.stringify([{ description: demo.schedule }])}::jsonb,
        ${demo.image}, ${tagsStr}::text[], ${JSON.stringify(curriculum)}::jsonb,
        ${isPublished}, ${isPublished ? sql`now()` : null},
        '[]'::jsonb, '{}'::uuid[]
      )
    `);

    console.log(`  ✅ Created "${demo.title}"`);
    created++;
  }

  console.log(`\n🎉 Done! ${created} created, ${skipped} skipped.`);

  // ─── Summary ────────────────────────────────────────────────────────
  const [summary] = await db.execute(sql`
    SELECT count(*) as count FROM training_sessions
  `) as unknown as [{ count: number }];

  console.log(`   Total sessions in DB: ${summary?.count ?? 0}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
