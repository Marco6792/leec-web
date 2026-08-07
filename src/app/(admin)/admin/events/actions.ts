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
  published: z.boolean().optional(),
  registrationUrl: z.string().url("Invalid URL.").optional().or(z.literal("")),
});

export async function createEvent(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/login");

  const raw: Record<string, unknown> = {};
  for (const key of Object.keys(eventSchema.shape)) {
    raw[key] = formData.get(key);
  }
  raw.isOnline = formData.get("isOnline") === "on";
  raw.published = formData.get("published") === "on";

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/events/new?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, meetingUrl, imageUrl, pdfUrl, registrationUrl, ...rest } = parsed.data;

  await db.insert(events).values({
    ...rest,
    pdfUrl: pdfUrl || null,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    meetingUrl: meetingUrl || null,
    imageUrl: imageUrl || null,
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
    raw[key] = formData.get(key);
  }
  raw.isOnline = formData.get("isOnline") === "on";
  raw.published = formData.get("published") === "on";

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    redirect(`/admin/events/${id}/edit?error=${encodeURIComponent(firstError)}`);
  }

  const { startDate, endDate, meetingUrl, imageUrl, pdfUrl, registrationUrl, ...rest } = parsed.data;

  await db
    .update(events)
    .set({
      ...rest,
      pdfUrl: pdfUrl || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      meetingUrl: meetingUrl || null,
      imageUrl: imageUrl || null,
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
  redirect("/admin/events");
}
