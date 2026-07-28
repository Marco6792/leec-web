"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

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

  const researchInterests = researchInterestsRaw
    ? researchInterestsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db
    .insert(profiles)
    .values({
      id: user.id,
      fullName: fullName || "Unknown",
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
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: {
        fullName: fullName || "Unknown",
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
        updatedAt: new Date(),
      },
    });

  revalidatePath("/", "layout");
  redirect("/");
}
