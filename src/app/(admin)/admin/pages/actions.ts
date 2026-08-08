"use server";

import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required."),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required."),
  published: z.boolean().optional(),
});

const PAGE_PATHS: Record<string, string> = {
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  services: "/services",
};

export async function updatePage(id: string, formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const key of ["title", "subtitle", "content"] as const) {
    const value = formData.get(key);
    if (value !== null) raw[key] = value;
  }
  raw.published = formData.get("published") === "true";

  const parsed = pageSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/pages/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  await db
    .update(sitePages)
    .set({
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      content: parsed.data.content,
      published: parsed.data.published ?? false,
      updatedAt: new Date(),
    })
    .where(eq(sitePages.id, id));

  // Revalidate the admin list and the public page (if we know its route)
  revalidatePath("/admin/pages");
  for (const path of Object.values(PAGE_PATHS)) {
    revalidatePath(path);
  }

  redirect(`/admin/pages/${id}/edit?saved=true`);
}

export async function deletePage(id: string) {
  await db.delete(sitePages).where(eq(sitePages.id, id));

  revalidatePath("/admin/pages");
  for (const path of Object.values(PAGE_PATHS)) {
    revalidatePath(path);
  }
  redirect("/admin/pages?deleted=true");
}
