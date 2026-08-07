import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEvent, deleteEvent } from "../../actions";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../../_components/form-field";
import { UploadImage } from "@/components/admin/upload-image";
import { PdfUpload } from "@/components/admin/pdf-upload";
import { ViewPublicPage } from "../../../_components/view-public-page";

export const dynamic = "force-dynamic";

const eventTypes = [
  "seminar", "workshop", "conference", "defense", "meeting", "social", "other",
] as const;

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const sp = await searchParams;

  const [item] = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  if (!item) redirect("/admin/events?error=Event+not+found");

  const boundAction = updateEvent.bind(null, id);
  const boundDelete = deleteEvent.bind(null, id);

  const startDateStr = item.startDate
    ? new Date(item.startDate).toISOString().split("T")[0]
    : "";
  const endDateStr = item.endDate
    ? new Date(item.endDate).toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewPublicPage href={`/events/${item.id}`} />
          <Link
            href="/admin/events"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to events
          </Link>
        </div>
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Event saved successfully.
        </div>
      )}

      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {sp.error}
        </div>
      )}

      <form action={boundAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Title" name="title" required>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={item.title}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Description" name="description">
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={item.description ?? ""}
                className={textareaClass}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Event Type" name="eventType">
                <select id="eventType" name="eventType" defaultValue={item.eventType ?? "seminar"} className={selectClass}>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Location" name="location">
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={item.location ?? ""}
                  className={inputClass}
                />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date &amp; Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Start Date" name="startDate" required>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={startDateStr}
                  required
                  className={inputClass}
                />
              </FormField>
              <FormField label="End Date" name="endDate">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={endDateStr}
                  className={inputClass}
                />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online &amp; Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <input
                id="isOnline"
                name="isOnline"
                type="checkbox"
                defaultChecked={item.isOnline ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="isOnline" className="text-sm">
                Online event
              </label>
            </div>

            <FormField label="Meeting URL" name="meetingUrl">
              <input
                id="meetingUrl"
                name="meetingUrl"
                type="url"
                defaultValue={item.meetingUrl ?? ""}
                className={inputClass}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Cover image" name="imageUrl" helpText="Uploaded via UploadThing.">
                <UploadImage endpoint="entityImage" inputName="imageUrl" value={item.imageUrl ?? ""} />
              </FormField>
              <FormField label="PDF document" name="pdfUrl" helpText="Uploaded to Supabase Storage with inline preview.">
                <PdfUpload inputName="pdfUrl" value={item.pdfUrl ?? ""} />
              </FormField>
            </FieldGrid>

            <FormField label="Registration URL" name="registrationUrl">
              <input
                id="registrationUrl"
                name="registrationUrl"
                type="url"
                defaultValue={item.registrationUrl ?? ""}
                className={inputClass}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={item.published ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="published" className="text-sm">
                Published on website
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3 pb-8">
          <form action={boundDelete}>
            <button
              type="submit"
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              Delete Event
            </button>
          </form>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/events"
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
