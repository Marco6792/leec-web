"use server";

import { db } from "@/db";
import { news } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const newsSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  pdfUrl: z.string().optional(),
  published: z.boolean().optional(),
  publishedAt: z.string().optional(),
  pinned: z.boolean().optional(),
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

export async function createNews(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(newsSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.published = formData.get("published") === "on";
  raw.pinned = formData.get("pinned") === "on";

  const title = (formData.get("title") as string) || "";
  const slug = slugify(title);

  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/news/new?error=${encodeURIComponent(firstError)}`);
  }

  const { tags, publishedAt, pdfUrl, ...rest } = parsed.data;

  const tagsArray = tags
    ? tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db.insert(news).values({
    ...rest,
    pdfUrl: pdfUrl || null,
    slug,
    authorId: user.id,
    tags: tagsArray,
    publishedAt: publishedAt ? new Date(publishedAt) : (rest.published ? new Date() : null),
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
  redirect("/admin/news?saved=true");
}

export async function updateNews(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(newsSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.published = formData.get("published") === "on";
  raw.pinned = formData.get("pinned") === "on";

  const title = (formData.get("title") as string) || "";
  const slug = formData.get("slug") as string || slugify(title);

  const parsed = newsSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/news/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { tags, publishedAt, pdfUrl, ...rest } = parsed.data;

  const tagsArray = tags
    ? tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  await db
    .update(news)
    .set({
      ...rest,
      pdfUrl: pdfUrl || null,
      slug,
      tags: tagsArray,
      publishedAt: publishedAt ? new Date(publishedAt) : (rest.published ? new Date() : null),
      updatedAt: new Date(),
    })
    .where(eq(news.id, id));

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  redirect(`/admin/news/${id}/edit?saved=true`);
}

export async function deleteNews(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(news).where(eq(news.id, id));

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");
  redirect("/admin/news");
}
