"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  eventType: z
    .enum(["seminar", "workshop", "conference", "defense", "meeting", "social", "other"])
    .optional(),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().optional(),
  location: z.string().optional(),
  isOnline: z.boolean().optional(),
  meetingUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
  pdfUrl: z.string().optional(),
  gallery: z.string().optional(),
  documents: z.string().optional(),
  published: z.boolean().optional(),
  registrationUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
});

function parseJsonArray(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function createEvent(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(eventSchema.shape)) {
    const value = formData.get(key);
    if (value !== null) raw[key] = value;
  }
  raw.isOnline = formData.get("isOnline") === "true";
  raw.published = formData.get("published") === "true";

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/events/new?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, meetingUrl, imageUrl, pdfUrl, gallery, documents, registrationUrl, ...rest } = parsed.data;

  const galleryArray = parseJsonArray(gallery);
  const documentsArray = parseJsonArray(documents);

  await db.insert(events).values({
    ...rest,
    pdfUrl: (documentsArray[0] ?? pdfUrl) || null,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    meetingUrl: meetingUrl || null,
    imageUrl: (galleryArray[0] ?? imageUrl) || null,
    gallery: galleryArray,
    documents: documentsArray,
    registrationUrl: registrationUrl || null,
    organizerId: user.id,
  });

  revalidatePath("/admin/events");
  revalidatePath("/");
  redirect("/admin/events?saved=true");
}

export async function updateEvent(id: string, formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(eventSchema.shape)) {
    const value = formData.get(key);
    if (value !== null) raw[key] = value;
  }
  raw.isOnline = formData.get("isOnline") === "true";
  raw.published = formData.get("published") === "true";

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/events/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, meetingUrl, imageUrl, pdfUrl, gallery, documents, registrationUrl, ...rest } = parsed.data;

  const galleryArray = parseJsonArray(gallery);
  const documentsArray = parseJsonArray(documents);

  await db
    .update(events)
    .set({
      ...rest,
      pdfUrl: (documentsArray[0] ?? pdfUrl) || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      meetingUrl: meetingUrl || null,
      imageUrl: (galleryArray[0] ?? imageUrl) || null,
      gallery: galleryArray,
      documents: documentsArray,
      registrationUrl: registrationUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  redirect(`/admin/events/${id}/edit?saved=true`);
}

export async function deleteEvent(id: string) {
  const user = await getUser();
  if (!user) redirect("/login");

  await db.delete(events).where(eq(events.id, id));

  revalidatePath("/admin/events");
  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events?deleted=true");
}
