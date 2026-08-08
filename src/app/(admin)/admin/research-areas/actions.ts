"use server";

import { db } from "@/db";
import { researchDomains } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const researchAreaSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  tags: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function parseTags(tagsInput: string | undefined): string[] {
  if (!tagsInput) return [];
  return tagsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createResearchArea(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(researchAreaSchema.shape)) {
    raw[key] = formData.get(key);
  }

  const name = (formData.get("name") as string) || "";
  const slug = (formData.get("slug") as string) || slugify(name);

  const parsed = researchAreaSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/research-areas/new?error=${encodeURIComponent(firstError)}`);
  }

  await db.insert(researchDomains).values({
    name: parsed.data.name,
    slug,
    description: parsed.data.description ?? null,
    icon: parsed.data.icon ?? null,
    featuredImageUrl: parsed.data.featuredImageUrl ?? null,
    tags: parseTags(parsed.data.tags),
    sortOrder: parsed.data.sortOrder,
  });

  revalidatePath("/admin/research-areas");
  revalidatePath("/research");
  redirect("/admin/research-areas?added=true");
}

export async function updateResearchArea(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(researchAreaSchema.shape)) {
    raw[key] = formData.get(key);
  }

  const name = (formData.get("name") as string) || "";
  const slug = (formData.get("slug") as string) || slugify(name);

  const parsed = researchAreaSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/research-areas/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  await db
    .update(researchDomains)
    .set({
      name: parsed.data.name,
      slug,
      description: parsed.data.description ?? null,
      icon: parsed.data.icon ?? null,
      featuredImageUrl: parsed.data.featuredImageUrl ?? null,
      tags: parseTags(parsed.data.tags),
      sortOrder: parsed.data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(researchDomains.id, id));

  revalidatePath("/admin/research-areas");
  revalidatePath("/research");
  redirect(`/admin/research-areas/${id}/edit?saved=true`);
}

export async function deleteResearchArea(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(researchDomains).where(eq(researchDomains.id, id));

  revalidatePath("/admin/research-areas");
  revalidatePath("/research");
  redirect("/admin/research-areas?deleted=true");
}
