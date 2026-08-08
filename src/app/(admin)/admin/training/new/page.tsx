import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../_components/submit-button";
import { requireAdmin } from "@/lib/auth/admin";
import { SwitchField } from "../../_components/switch-field";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTrainingSession } from "../actions";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";

export const dynamic = "force-dynamic";

const levels = ["beginner", "intermediate", "advanced"] as const;

export default async function NewTrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Training", href: "/admin/training" }, { label: "Create Session" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Training Session</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new training session for lab researchers.
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

      <form action={createTrainingSession} className="grid gap-6 lg:grid-cols-2">
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
                required
                placeholder="e.g. Quantum Machine Operation 101"
              />
            </FormField>

            <FieldGrid cols={3}>
              <FormField label="Level" name="level">
                <NativeSelect id="level" name="level" defaultValue="beginner" className="w-full">
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
              <FormField label="Status" name="status">
                <NativeSelect id="status" name="status" className="w-full">
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="open">Open</option>
                </NativeSelect>
              </FormField>
              <FormField label="Max Participants" name="maxParticipants">
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min={1}
                  placeholder="e.g. 12"
                />
              </FormField>
            </FieldGrid>

            <FormField label="Description" name="description" helpText="Describe the session content and objectives.">
              <Textarea
                id="description"
                name="description"
                rows={3}
                placeholder="What will participants learn? Any prerequisites?"
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
                <Input id="startDate" name="startDate" type="date" />
              </FormField>
              <FormField label="End Date" name="endDate">
                <Input id="endDate" name="endDate" type="date" />
              </FormField>
            </FieldGrid>
            <FormField label="Schedule" name="schedule" helpText="e.g. Mondays & Wednesdays, 14:00–16:00">
              <Input
                id="schedule"
                name="schedule"
                type="text"
                placeholder="e.g. Mondays & Wednesdays, 14:00–16:00"
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media &amp; Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Image URL" name="imageUrl" helpText="URL to a promotional image.">
              <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." />
            </FormField>
            <FormField label="Tags" name="tags" helpText="Comma-separated. e.g. quantum, measurement, beginner">
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="quantum, measurement, beginner"
              />
            </FormField>
            <SwitchField
              id="published"
              name="published"
              label="Publish immediately (visible on public site)"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/training" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Creating…">Create Session</SubmitButton>
        </div>
      </form>
    </div>
  );
}
