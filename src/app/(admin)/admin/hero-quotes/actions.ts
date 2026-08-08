"use server";

import { db } from "@/db";
import { heroQuotes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const quoteSchema = z.object({
  text: z.string().min(3, "Quote text is required."),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  published: z.boolean().optional(),
});

function parseForm(formData: FormData) {
  const raw: Record<string, unknown> = {
    text: formData.get("text"),
    sortOrder: formData.get("sortOrder"),
  };
  raw.published = formData.get("published") === "true";
  return quoteSchema.safeParse(raw);
}

export async function addQuote(formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/hero-quotes/new?error=${encodeURIComponent(firstError)}`);
  }

  await db.insert(heroQuotes).values({
    text: parsed.data.text,
    sortOrder: parsed.data.sortOrder,
    published: parsed.data.published ?? true,
  });

  revalidatePath("/");
  revalidatePath("/admin/hero-quotes");
  redirect("/admin/hero-quotes?added=true");
}

export async function updateQuote(id: string, formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/hero-quotes/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  await db
    .update(heroQuotes)
    .set({
      text: parsed.data.text,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published ?? false,
      updatedAt: new Date(),
    })
    .where(eq(heroQuotes.id, id));

  revalidatePath("/");
  revalidatePath("/admin/hero-quotes");
  redirect(`/admin/hero-quotes/${id}/edit?saved=true`);
}

export async function deleteQuote(id: string) {
  await db.delete(heroQuotes).where(eq(heroQuotes.id, id));

  revalidatePath("/");
  revalidatePath("/admin/hero-quotes");
  redirect("/admin/hero-quotes?deleted=true");
}
