"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z
    .enum(["active", "completed", "on_hold", "cancelled", "proposed"])
    .optional(),
  piId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  fundingSource: z.string().optional(),
  fundingAmount: z.string().optional(),
  currency: z.string().optional(),
  imageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export async function createProject(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(projectSchema.shape)) {
    raw[key] = formData.get(key);
  }

  const title = (formData.get("title") as string) || "";
  const slug = slugify(title);

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/projects/new?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, fundingAmount, ...rest } = parsed.data;

  await db.insert(projects).values({
    ...rest,
    slug,
    startDate: startDate || null,
    endDate: endDate || null,
    fundingAmount: fundingAmount || null,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin/projects?saved=true");
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(projectSchema.shape)) {
    raw[key] = formData.get(key);
  }

  const title = (formData.get("title") as string) || "";
  const slug = (formData.get("slug") as string) || slugify(title);

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, fundingAmount, ...rest } = parsed.data;

  await db
    .update(projects)
    .set({
      ...rest,
      slug,
      startDate: startDate || null,
      endDate: endDate || null,
      fundingAmount: fundingAmount || null,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  redirect(`/admin/projects/${id}/edit?saved=true`);
}

export async function deleteProject(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(projects).where(eq(projects.id, id));

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projects");
  redirect("/admin/projects?deleted=true");
}
