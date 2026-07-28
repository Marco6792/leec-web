import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createEvent } from "../actions";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../_components/form-field";

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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Event</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new event to the lab calendar.
          </p>
        </div>
        <a
          href="/admin/events"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to events
        </a>
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

      <form action={createEvent} className="space-y-6">
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
                required
                placeholder="e.g. Distinguished Seminar: Advances in Power Electronics"
                className={inputClass}
              />
            </FormField>

            <FormField label="Description" name="description">
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Event description..."
                className={textareaClass}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Event Type" name="eventType">
                <select id="eventType" name="eventType" defaultValue="seminar" className={selectClass}>
                  {eventTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Location" name="location" helpText="Physical venue or 'Online'">
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Lab 201, Engineering Building"
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
                  required
                  className={inputClass}
                />
              </FormField>
              <FormField label="End Date" name="endDate">
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
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
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="isOnline" className="text-sm">
                Online event
              </label>
            </div>

            <FormField label="Meeting URL" name="meetingUrl" helpText="Zoom, Google Meet, etc.">
              <input
                id="meetingUrl"
                name="meetingUrl"
                type="url"
                placeholder="https://..."
                className={inputClass}
              />
            </FormField>

            <FormField label="Image URL" name="imageUrl">
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://..."
                className={inputClass}
              />
            </FormField>

            <FormField label="Registration URL" name="registrationUrl">
              <input
                id="registrationUrl"
                name="registrationUrl"
                type="url"
                placeholder="https://..."
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
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="published" className="text-sm">
                Publish on website
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8">
          <a
            href="/admin/events"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
