import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../../_components/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SwitchField } from "../../../_components/switch-field";
import { updatePage, deletePage } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { RichTextEditorField } from "@/components/ui/rich-text-editor-field";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";
import { ViewPublicPage } from "../../../_components/view-public-page";

export const dynamic = "force-dynamic";

const PUBLIC_PATHS: Record<string, string> = {
  about: "/about",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  services: "/services",
};

export default async function EditPagePage({
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
    .from(sitePages)
    .where(eq(sitePages.id, id))
    .limit(1);

  if (!item) redirect("/admin/pages?error=Page+not+found");

  const boundAction = updatePage.bind(null, id);
  const boundDelete = deletePage.bind(null, id);
  const publicPath = PUBLIC_PATHS[item.slug];

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Pages", href: "/admin/pages" }, { label: "Edit Page" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Page</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.title} <span className="text-xs">(/{item.slug})</span>
          </p>
        </div>
        {publicPath && <ViewPublicPage href={publicPath} />}
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Page saved successfully. Changes are live on the public site.
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
            <CardTitle>Page Details</CardTitle>
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

            <FormField
              label="Subtitle"
              name="subtitle"
              helpText="Short tagline shown under the page title."
            >
              <Textarea
                id="subtitle"
                name="subtitle"
                rows={3}
                defaultValue={item.subtitle ?? ""}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <SwitchField
              id="published"
              name="published"
              label="Published — visible on the public site"
              defaultChecked={item.published}
            />

            <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
              <p className="font-medium text-foreground">Formatting tips</p>
              <p>• <code className="text-[11px]">## Heading</code> — section heading</p>
              <p>• <code className="text-[11px]">- item</code> — bullet list</p>
              <p>• <code className="text-[11px]">1. item</code> — numbered list</p>
              <p>• Blank lines separate paragraphs.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              label="Body"
              name="content"
              required
              helpText="The main page content. Use the toolbar to format text."
            >
              <RichTextEditorField
                id="content"
                name="content"
                defaultValue={item.content}
              />
            </FormField>
          </CardContent>
        </Card>

                <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <Button render={<Link href="/admin/pages" />} variant="outline">
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
            Delete Page
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
