import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../../_components/submit-button";
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
} from "../../../_components/form-field";
import { Input } from "@/components/ui/input";
import { RichTextEditorField } from "@/components/ui/rich-text-editor-field";
import { NativeSelect } from "@/components/ui/native-select";
import { MediaUpload } from "@/components/admin/media-upload";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";
import { ViewPublicPage } from "../../../_components/view-public-page";
import { SwitchField } from "../../../_components/switch-field";

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
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Events", href: "/admin/events" }, { label: "Edit Event" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.title}
          </p>
        </div>
        <ViewPublicPage href={`/events/${item.id}`} />
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

      <form action={boundAction} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Title" name="title" required>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={item.title}
                required
              />
            </FormField>

            <FormField label="Description" name="description">
              <RichTextEditorField
                id="description"
                name="description"
                defaultValue={item.description ?? ""}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Event Type" name="eventType">
                <NativeSelect id="eventType" name="eventType" defaultValue={item.eventType ?? "seminar"} className="w-full">
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Location" name="location">
                <Input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={item.location ?? ""}
                />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date, Time &amp; Online</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Start Date" name="startDate" required>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={startDateStr}
                  required
                />
              </FormField>
              <FormField label="End Date" name="endDate">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={endDateStr}
                />
              </FormField>
            </FieldGrid>

            <SwitchField
              id="isOnline"
              name="isOnline"
              label="Online event"
              defaultChecked={item.isOnline ?? false}
            />

            <FormField label="Meeting URL" name="meetingUrl">
              <Input
                id="meetingUrl"
                name="meetingUrl"
                type="url"
                defaultValue={item.meetingUrl ?? ""}
              />
            </FormField>

            <FormField label="Registration URL" name="registrationUrl">
              <Input
                id="registrationUrl"
                name="registrationUrl"
                type="url"
                defaultValue={item.registrationUrl ?? ""}
              />
            </FormField>

            <SwitchField
              id="published"
              name="published"
              label="Published on website"
              defaultChecked={item.published ?? false}
            />
          </CardContent>
        </Card>

        {/* Media — full width so the uploads aren't cramped */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Photos &amp; Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGrid cols={2}>
              <FormField label="Images" name="gallery" helpText="Upload one or more images. The first image is used as the cover.">
                <MediaUpload
                  endpoint="gallery"
                  inputName="gallery"
                  value={item.gallery?.length ? item.gallery : item.imageUrl ? [item.imageUrl] : []}
                />
              </FormField>
              <FormField label="Documents" name="documents" helpText="Upload one or more PDFs or documents. The first is shown inline on the page.">
                <MediaUpload
                  endpoint="documents"
                  inputName="documents"
                  value={item.documents?.length ? item.documents : item.pdfUrl ? [item.pdfUrl] : []}
                />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/events" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Saving…">Save Changes</SubmitButton>
        </div>
      </form>

      {/* Delete (outside the main form to keep HTML valid) */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6 pb-8">
        <form action={boundDelete}>
          <SubmitButton
            variant="outline"
            className="text-xs text-destructive hover:text-destructive"
            pendingText="Deleting…"
          >
            Delete Event
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
