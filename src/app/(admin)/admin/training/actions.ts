"use server";

import { db } from "@/db";
import { trainingSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const trainingSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  maxParticipants: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schedule: z.string().optional(),
  status: z
    .enum(["draft", "pending_approval", "open", "in_progress", "completed", "cancelled"])
    .optional(),
  published: z.boolean().optional(),
  imageUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  tags: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function createTrainingSession(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(trainingSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.published = formData.get("published") === "on";

  const name = (formData.get("title") as string) || "";
  const slug = slugify(name);

  const parsed = trainingSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/training/new?error=${encodeURIComponent(firstError)}`);
  }

  const { imageUrl, tags, ...rest } = parsed.data;

  await db.insert(trainingSessions).values({
    ...rest,
    slug,
    creatorId: user.id,
    labId: "5826efb9-5ad6-4acb-8420-e32e6b47998c", // LEEC lab ID
    imageUrl: imageUrl || null,
    tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
    schedule: rest.schedule ? [{ description: rest.schedule }] : [],
  });

  revalidatePath("/admin/training");
  revalidatePath("/training");
  redirect("/admin/training?saved=true");
}

export async function updateTrainingSession(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(trainingSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.published = formData.get("published") === "on";

  const slug = formData.get("slug") as string;
  const parsed = trainingSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/training/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { imageUrl, tags, ...rest } = parsed.data;

  await db
    .update(trainingSessions)
    .set({
      ...rest,
      slug: slug || slugify(rest.title || ""),
      imageUrl: imageUrl || null,
      tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
      schedule: rest.schedule ? [{ description: rest.schedule }] : [],
      updatedAt: new Date(),
    })
    .where(eq(trainingSessions.id, id));

  revalidatePath("/admin/training");
  revalidatePath("/training");
  redirect(`/admin/training/${id}/edit?saved=true`);
}

export async function validateTrainingSession(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db
    .update(trainingSessions)
    .set({
      status: "open",
      published: true,
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(trainingSessions.id, id));

  revalidatePath("/admin/training");
  revalidatePath("/training");
  revalidatePath("/admin/training/validation");
}

export async function archiveTrainingSession(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db
    .update(trainingSessions)
    .set({
      status: "completed",
      updatedAt: new Date(),
    })
    .where(eq(trainingSessions.id, id));

  revalidatePath("/admin/training");
  revalidatePath("/training");
}

export async function deleteTrainingSession(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(trainingSessions).where(eq(trainingSessions.id, id));

  revalidatePath("/admin/training");
  revalidatePath("/training");
  redirect("/admin/training?deleted=true");
}
