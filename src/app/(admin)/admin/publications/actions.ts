"use server";

import { db } from "@/db";
import { publications, publicationAuthors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const publicationSchema = z.object({
  type: z.enum([
    "journal", "conference", "book", "chapter", "report",
    "dataset", "thesis", "patent", "software", "preprint",
  ]),
  title: z.string().min(1, "Title is required."),
  abstract: z.string().optional(),
  year: z.coerce.number().int().min(1900).max(2100),
  doi: z.string().optional(),
  journal: z.string().optional(),
  conference: z.string().optional(),
  publisher: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  isbn: z.string().optional(),
  issn: z.string().optional(),
  patentNumber: z.string().optional(),
  repository: z.string().optional(),
  citationCount: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  gallery: z.string().optional(),
  documents: z.string().optional(),
  sourceDataUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  keywords: z.string().optional(),
  researchDomains: z.string().optional(),
  language: z.string().optional(),
  license: z.string().optional(),
  openAccess: z.boolean().optional(),
  authorCount: z.coerce.number().int().min(0).optional(),
});

interface AuthorData {
  profileId: string;
  fullName: string;
  affiliation: string;
  corresponding: boolean;
}

function parseJsonArray(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function parseAuthors(formData: FormData, count: number): AuthorData[] {
  const authors: AuthorData[] = [];
  for (let i = 0; i < count; i++) {
    const raw = formData.get(`author_${i}`);
    if (typeof raw === "string") {
      try {
        authors.push(JSON.parse(raw));
      } catch {
        // skip malformed
      }
    }
  }
  return authors;
}

export async function createPublication(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(publicationSchema.shape)) {
    const value = formData.get(key);
    if (value !== null) raw[key] = value;
  }
  raw.openAccess = formData.get("openAccess") === "true";

  const parsed = publicationSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/publications/new?error=${encodeURIComponent(firstError)}`);
  }

  const { keywords, researchDomains, imageUrl, pdfUrl, gallery, documents, sourceDataUrl, publisher, authorCount, ...rest } = parsed.data;

  const publisherArray = publisher
    ? publisher.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const galleryArray = parseJsonArray(gallery);
  const documentsArray = parseJsonArray(documents);

  const [pub] = await db
    .insert(publications)
    .values({
      ...rest,
      imageUrl: (galleryArray[0] ?? imageUrl) || null,
      pdfUrl: (documentsArray[0] ?? pdfUrl) || null,
      gallery: galleryArray,
      documents: documentsArray,
      sourceDataUrl: sourceDataUrl || null,
      keywords: keywords ? keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
      researchDomains: researchDomains
        ? researchDomains.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      publisher: publisherArray,
    })
    .returning({ id: publications.id });

  // Insert authors
  const authors = parseAuthors(formData, authorCount ?? 0);
  if (pub && authors.length > 0) {
    await db.insert(publicationAuthors).values(
      authors.map((a, i) => ({
        publicationId: pub.id,
        profileId: a.profileId,
        authorOrder: i + 1,
        corresponding: a.corresponding,
        affiliation: a.affiliation || null,
      }))
    );
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
  revalidatePath("/");
  redirect("/admin/publications?saved=true");
}

export async function updatePublication(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(publicationSchema.shape)) {
    const value = formData.get(key);
    if (value !== null) raw[key] = value;
  }
  raw.openAccess = formData.get("openAccess") === "true";

  const parsed = publicationSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/publications/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { keywords, researchDomains, imageUrl, pdfUrl, gallery, documents, sourceDataUrl, publisher, authorCount, ...rest } = parsed.data;

  const publisherArray = publisher
    ? publisher.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const galleryArray = parseJsonArray(gallery);
  const documentsArray = parseJsonArray(documents);

  await db
    .update(publications)
    .set({
      ...rest,
      imageUrl: (galleryArray[0] ?? imageUrl) || null,
      pdfUrl: (documentsArray[0] ?? pdfUrl) || null,
      gallery: galleryArray,
      documents: documentsArray,
      sourceDataUrl: sourceDataUrl || null,
      keywords: keywords ? keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
      researchDomains: researchDomains
        ? researchDomains.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      publisher: publisherArray,
      updatedAt: new Date(),
    })
    .where(eq(publications.id, id));

  // Replace authors: delete existing, then insert new
  await db.delete(publicationAuthors).where(eq(publicationAuthors.publicationId, id));

  const authors = parseAuthors(formData, authorCount ?? 0);
  if (authors.length > 0) {
    await db.insert(publicationAuthors).values(
      authors.map((a, i) => ({
        publicationId: id,
        profileId: a.profileId,
        authorOrder: i + 1,
        corresponding: a.corresponding,
        affiliation: a.affiliation || null,
      }))
    );
  }

  revalidatePath("/admin/publications");
  revalidatePath("/publications");
  revalidatePath("/");
  revalidatePath(`/publications/${id}`);
  redirect(`/admin/publications/${id}/edit?saved=true`);
}

export async function deletePublication(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(publications).where(eq(publications.id, id));

  revalidatePath("/admin/publications");
  revalidatePath("/");
  revalidatePath("/publications");
  redirect("/admin/publications?deleted=true");
}
