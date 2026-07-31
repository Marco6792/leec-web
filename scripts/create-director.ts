/**
 * Create LEEC Director User - Professor Pierre Tsafack
 *
 * This script creates a complete admin user for Professor Pierre Tsafack
 * based on the information from the PDF documents.
 */

import { createAdminClient } from "../src/lib/supabase/admin";
import { db } from "../src/db";
import { profiles, labMembers, researchCenters } from "../src/db/schema";
import { eq } from "drizzle-orm";

const DIRECTOR_EMAIL = "pierre.tsafack@ubuea.cm"; // Placeholder email
const DIRECTOR_PASSWORD = "SecurePassword123!"; // Should be changed after first login
const ALTERNATIVE_EMAIL = "director@leec.ubuea.cm"; // Alternative email
const TEMP_EMAIL = `director-${Date.now()}@leec.ubuea.cm`; // Temp email

async function createDirectorUser() {
  console.log("🔧 Creating LEEC Director user for Professor Pierre Tsafack...");

  const adminClient = createAdminClient();
  if (!adminClient) {
    console.error(
      "❌ Admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY."
    );
    process.exit(1);
  }

  try {
    // Step 1: Create Supabase Auth user
    console.log("📧 Creating Supabase Auth user...");
    let userId: string | null;

    // Try with primary email first
    let { data: userData, error: userError } =
      await adminClient.auth.admin.createUser({
        email: DIRECTOR_EMAIL,
        password: DIRECTOR_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: "Professor Pierre Tsafack",
          title: "Full Professor",
          institution: "University of Buea",
        },
      });

    // If email exists, try alternative email
    if (userError?.code === "email_exists") {
      console.log("⚠️  Email already exists, trying alternative email...");
      const result = await adminClient.auth.admin.createUser({
        email: ALTERNATIVE_EMAIL,
        password: DIRECTOR_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: "Professor Pierre Tsafack",
          title: "Full Professor",
          institution: "University of Buea",
        },
      });

      // If alternative email also exists, use temp email
      if (result.error?.code === "email_exists") {
        console.log(
          "⚠️  Alternative email also exists, using temporary email..."
        );
        const tempResult = await adminClient.auth.admin.createUser({
          email: TEMP_EMAIL,
          password: DIRECTOR_PASSWORD,
          email_confirm: true,
          user_metadata: {
            full_name: "Professor Pierre Tsafack",
            title: "Full Professor",
            institution: "University of Buea",
          },
        });

        if (tempResult.error) {
          console.error(
            "❌ Failed to create auth user with temporary email:",
            tempResult.error
          );
          process.exit(1);
        }

        userData = tempResult.data;
        userError = null;
      } else if (result.error) {
        console.error(
          "❌ Failed to create auth user with alternative email:",
          result.error
        );
        process.exit(1);
      } else {
        userData = result.data;
        userError = null;
      }
    }

    if (userError) {
      console.error("❌ Failed to create auth user:", userError);
      process.exit(1);
    }

    console.log("✅ Auth user created:", userData?.user?.id);

    userId = userData?.user?.id ?? null;
    if (!userId) {
      console.error("❌ Failed to get user ID from auth response");
      process.exit(1);
    }

    // Step 2: Create profile (only use columns that exist in database)
    console.log("👤 Creating profile...");
    await db.insert(profiles).values({
      id: userId,
      fullName: "Professor Pierre Tsafack",
      institution: "University of Buea",
      department: "Engineering",
      title: "Full Professor",
      biography:
        "Director of LEEC Research Laboratory. Full Professor of Electronic Engineering at University of Buea, Cameroon. Specializes in electrical energy, power electronics, and control systems.",
      researchInterests: [
        "Electrical Energy",
        "Power Electronics",
        "Control Systems",
        "Energy Harvesting",
        "Smart Agriculture",
      ],
      isPublic: true,
    });
    console.log("✅ Profile created");

    // Step 3: Get LEEC research center
    console.log("🔍 Finding LEEC research center...");
    const [leecCenter] = await db
      .select()
      .from(researchCenters)
      .where(eq(researchCenters.slug, "leec"))
      .limit(1);

    if (!leecCenter) {
      console.error("❌ LEEC research center not found");
      process.exit(1);
    }

    console.log("✅ Found LEEC center:", leecCenter.id);

    // Step 4: Create lab membership
    console.log("🎓 Creating lab director membership...");
    await db.insert(labMembers).values({
      labId: leecCenter.id,
      userId: userId,
      role: "director",
      status: "active",
    });
    console.log("✅ Lab director membership created");

    // Step 5: Update research center director
    console.log("🏢 Updating research center director...");
    await db
      .update(researchCenters)
      .set({ directorId: userId })
      .where(eq(researchCenters.id, leecCenter.id));
    console.log("✅ Research center director updated");

    console.log("\n🎉 LEEC Director user created successfully!");
    console.log("\n📋 Login Details:");
    console.log("Email:", userData.user?.email || DIRECTOR_EMAIL);
    console.log("Password:", DIRECTOR_PASSWORD);
    console.log("User ID:", userId);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log(
      "🔗 Admin URL: https://laboratory-of-electrical-ingineerin.vercel.app/admin"
    );
  } catch (error) {
    console.error("❌ Error creating director user:", error);
    process.exit(1);
  }
}

createDirectorUser();
