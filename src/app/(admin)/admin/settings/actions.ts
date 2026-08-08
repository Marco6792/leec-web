"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const { user } = await requireAdmin();

  const fullName = formData.get("fullName") as string;
  const title = formData.get("title") as string;
  const institution = formData.get("institution") as string;
  const department = formData.get("department") as string;
  const biography = formData.get("biography") as string;
  const researchInterestsRaw = formData.get("researchInterests") as string;
  const orcid = formData.get("orcid") as string;
  const googleScholar = formData.get("googleScholar") as string;
  const researchGate = formData.get("researchGate") as string;
  const linkedIn = formData.get("linkedIn") as string;
  const website = formData.get("website") as string;
  const phone = formData.get("phone") as string;
  const isPublic = formData.get("isPublic") === "true";

  if (!fullName?.trim()) {
    redirect("/admin/settings?error=Full+name+is+required.");
  }

  const researchInterests = researchInterestsRaw
    ? researchInterestsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db
    .update(profiles)
    .set({
      fullName: fullName.trim(),
      title: title || null,
      institution: institution || null,
      department: department || null,
      biography: biography || null,
      researchInterests,
      orcid: orcid || null,
      googleScholar: googleScholar || null,
      researchGate: researchGate || null,
      linkedIn: linkedIn || null,
      website: website || null,
      phone: phone || null,
      isPublic,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, user.id));

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=true");
}
