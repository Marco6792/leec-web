import { eq } from "drizzle-orm";
import { db } from "@/db";
import { trainingSessions } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTrainingSession } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";

export const dynamic = "force-dynamic";

const levels = ["beginner", "intermediate", "advanced"] as const;
const statuses = ["draft", "pending_approval", "open", "in_progress", "completed", "cancelled"] as const;

export default async function EditTrainingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const sp = await searchParams;

  const [session] = await db
    .select()
    .from(trainingSessions)
    .where(eq(trainingSessions.id, id))
    .limit(1);

  if (!session) redirect("/admin/training?error=Session+not+found");

  const boundAction = updateTrainingSession.bind(null, id);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Training Session</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {session.title}
          </p>
        </div>
        <a
          href="/admin/training"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to training
        </a>
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Training session saved successfully.
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
        <input type="hidden" name="slug" value={session.slug} />

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Session Title" name="title" required>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={session.title}
                required
              />
            </FormField>

            <FieldGrid cols={3}>
              <FormField label="Level" name="level">
                <NativeSelect id="level" name="level" defaultValue={session.level ?? "beginner"} className="w-full">
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
              <FormField label="Status" name="status">
                <NativeSelect id="status" name="status" defaultValue={session.status ?? "draft"} className="w-full">
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
              <FormField label="Max Participants" name="maxParticipants">
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min={1}
                  defaultValue={session.maxParticipants ?? ""}
                />
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description">
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={session.description ?? ""}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule &amp; Logistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Start Date" name="startDate">
                <Input id="startDate" name="startDate" type="date" defaultValue={session.startDate ?? ""} />
              </FormField>
              <FormField label="End Date" name="endDate">
                <Input id="endDate" name="endDate" type="date" defaultValue={session.endDate ?? ""} />
              </FormField>
            </FieldGrid>
            <FormField label="Schedule" name="schedule">
              <Input
                id="schedule"
                name="schedule"
                type="text"
                defaultValue={Array.isArray(session.schedule) ? (session.schedule as any[])?.[0]?.description ?? "" : ""}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media &amp; Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Image URL" name="imageUrl">
              <Input id="imageUrl" name="imageUrl" type="url" defaultValue={session.imageUrl ?? ""} />
            </FormField>
            <FormField label="Tags" name="tags" helpText="Comma-separated.">
              <Input
                id="tags"
                name="tags"
                type="text"
                defaultValue={session.tags?.join(", ") ?? ""}
              />
            </FormField>
            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={session.published ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="published" className="text-sm">
                Published on public site
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <a
            href="/admin/training"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
