import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../_components/submit-button";
import { requireAdmin } from "@/lib/auth/admin";
import { SwitchField } from "../../_components/switch-field";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent } from "../actions";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import { Input } from "@/components/ui/input";
import { RichTextEditorField } from "@/components/ui/rich-text-editor-field";
import { NativeSelect } from "@/components/ui/native-select";
import { MediaUpload } from "@/components/admin/media-upload";

export const dynamic = "force-dynamic";

const eventTypes = [
  "seminar", "workshop", "conference", "defense", "meeting", "social", "other",
] as const;

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Events", href: "/admin/events" }, { label: "Create Event" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new event to the lab calendar.
          </p>
        </div>
      </div>

      {params.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {params.error}
        </div>
      )}

      <form action={createEvent} className="grid gap-6 lg:grid-cols-2">
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
                required
                placeholder="e.g. Distinguished Seminar: Advances in Power Electronics"
              />
            </FormField>

            <FormField label="Description" name="description" helpText="Event description. Use the toolbar for formatting.">
              <RichTextEditorField
                id="description"
                name="description"
                defaultValue=""
                placeholder="Event description..."
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Event Type" name="eventType">
                <NativeSelect id="eventType" name="eventType" defaultValue="seminar" className="w-full">
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Location" name="location" helpText="Physical venue or 'Online'">
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Lab 201, Engineering Building"
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
                  required
                />
              </FormField>
              <FormField label="End Date" name="endDate">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                />
              </FormField>
            </FieldGrid>

            <SwitchField
              id="isOnline"
              name="isOnline"
              label="Online event"
            />

            <FormField label="Meeting URL" name="meetingUrl" helpText="Zoom, Google Meet, etc.">
              <Input
                id="meetingUrl"
                name="meetingUrl"
                type="url"
                placeholder="https://..."
              />
            </FormField>

            <FormField label="Registration URL" name="registrationUrl">
              <Input
                id="registrationUrl"
                name="registrationUrl"
                type="url"
                placeholder="https://..."
              />
            </FormField>

            <SwitchField
              id="published"
              name="published"
              label="Publish on website"
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
                <MediaUpload endpoint="gallery" inputName="gallery" />
              </FormField>
              <FormField label="Documents" name="documents" helpText="Upload one or more PDFs or documents. The first is shown inline on the page.">
                <MediaUpload endpoint="documents" inputName="documents" />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/events" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Creating…">Create Event</SubmitButton>
        </div>
      </form>
    </div>
  );
}
