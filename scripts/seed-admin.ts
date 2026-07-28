/**
 * Seed script: create LEEC research center + lab director membership.
 *
 * Run:  cd leec-web && bun run scripts/seed-admin.ts
 *
 * Requires DATABASE_URL in .env.local (already configured).
 */

import { db } from "../src/db";
import {
  researchCenters,
  labMembers,
} from "../src/db/schema";
import { eq } from "drizzle-orm";

const LEEC_SLUG = "leec";
const USER_ID = "59d8b957-c69f-44fe-af1f-d5ffd94f5717";

async function seed() {
  console.log("🔍 Checking if LEEC research center exists...");

  // Upsert the LEEC research center
  const [existingCenter] = await db
    .select()
    .from(researchCenters)
    .where(eq(researchCenters.slug, LEEC_SLUG))
    .limit(1);

  let leecId: string;

  if (existingCenter) {
    leecId = existingCenter.id;
    console.log(`✅ Found existing LEEC research center: ${leecId}`);
  } else {
    console.log("📦 Creating LEEC research center...");
    const [created] = await db
      .insert(researchCenters)
      .values({
        name: "Laboratory of Electrical Engineering and Computing",
        slug: LEEC_SLUG,
        acronym: "LEEC",
        description:
          "A world-class research laboratory at the University of Buea, Cameroon, " +
          "specializing in power electronics, energy harvesting, IoT systems, " +
          "and electromagnetic NDT. A partnership between the University of Buea " +
          "and INSA Lyon.",
        directorId: USER_ID,
        isActive: true,
      })
      .returning({ id: researchCenters.id });

    leecId = created.id;
    console.log(`✅ Created LEEC with ID: ${leecId}`);
  }

  // Check if the user is already a lab member
  const [existingMember] = await db
    .select()
    .from(labMembers)
    .where(eq(labMembers.userId, USER_ID))
    .limit(1);

  if (existingMember) {
    console.log(`ℹ️  User already has lab membership (role: ${existingMember.role}, status: ${existingMember.status})`);

    // Upgrade to director if they're something else
    if (existingMember.role !== "director") {
      await db
        .update(labMembers)
        .set({ role: "director", status: "active" })
        .where(eq(labMembers.userId, USER_ID));
      console.log("⬆️  Upgraded user role to director");
    }
  } else {
    console.log("📦 Creating lab director membership...");
    await db.insert(labMembers).values({
      labId: leecId,
      userId: USER_ID,
      role: "director",
      status: "active",
    });
    console.log("✅ Lab director membership created");
  }

  console.log("\n🎉 Done! You can now access /admin.");
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .then(() => process.exit(0));
