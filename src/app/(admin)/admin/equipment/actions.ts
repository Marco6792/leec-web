"use server";

import { db } from "@/db";
import { equipment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const equipmentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().optional(),
  description: z.string().optional(),
  category: z
    .enum(["instrument", "sensor", "computer", "network", "mechanical", "chemical", "safety", "office", "other"])
    .optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  specifications: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  status: z
    .enum(["operational", "maintenance", "repair", "calibration", "retired"])
    .optional(),
  acquiredDate: z.string().optional(),
  value: z.string().optional(),
  currency: z.string().optional(),
  isPublic: z.boolean().optional(),
  availableForTesting: z.boolean().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function createEquipment(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(equipmentSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.isPublic = formData.get("isPublic") === "on";
  raw.availableForTesting = formData.get("availableForTesting") === "on";

  const name = (formData.get("name") as string) || "";
  const slug = slugify(name);

  const parsed = equipmentSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
    redirect(`/admin/equipment/new?error=${encodeURIComponent(firstError)}`);
  }

  const { imageUrl, acquiredDate, value, ...rest } = parsed.data;

  await db.insert(equipment).values({
    ...rest,
    slug,
    imageUrl: imageUrl || null,
    acquiredDate: acquiredDate || null,
    value: value || null,
  });

  revalidatePath("/admin/equipment");
  redirect("/admin/equipment?saved=true");
}

export async function updateEquipment(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(equipmentSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.isPublic = formData.get("isPublic") === "on";
  raw.availableForTesting = formData.get("availableForTesting") === "on";

  const name = (formData.get("name") as string) || "";
  const slug = formData.get("slug") as string || slugify(name);

  const parsed = equipmentSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
    redirect(`/admin/equipment/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { imageUrl, acquiredDate, value, ...rest } = parsed.data;

  await db
    .update(equipment)
    .set({
      ...rest,
      slug,
      imageUrl: imageUrl || null,
      acquiredDate: acquiredDate || null,
      value: value || null,
      updatedAt: new Date(),
    })
    .where(eq(equipment.id, id));

  revalidatePath("/admin/equipment");
  redirect(`/admin/equipment/${id}/edit?saved=true`);
}
