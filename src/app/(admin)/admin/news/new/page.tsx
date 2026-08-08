import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../_components/submit-button";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNews } from "../actions";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditorField } from "@/components/ui/rich-text-editor-field";
import { MediaUpload } from "@/components/admin/media-upload";
import { SwitchField } from "../../_components/switch-field";

export const dynamic = "force-dynamic";

export default async function NewNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "News", href: "/admin/news" }, { label: "Create Article" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create News Article</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Write a new news article for the lab website.
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

      <form action={createNews} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Title" name="title" required>
              <Input
                id="title"
                name="title"
                type="text"
                required
                placeholder="e.g. New Research Breakthrough in Power Electronics"
              />
            </FormField>

            <FormField label="Excerpt" name="excerpt" helpText="Short summary shown in previews.">
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                placeholder="Brief summary of the article..."
              />
            </FormField>

            <FormField label="Content" name="content" helpText="Full article body. Use the toolbar to format text.">
              <RichTextEditorField
                id="content"
                name="content"
                defaultValue=""
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Published Date" name="publishedAt" helpText="Leave empty to use current date when published.">
                <Input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                />
              </FormField>

              <FormField label="Tags" name="tags" helpText="Comma-separated tags (e.g. Research, Award, Student).">
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="Research, Award, Student"
                />
              </FormField>
            </FieldGrid>

            <SwitchField
              id="published"
              name="published"
              label="Publish immediately"
            />
            <SwitchField
              id="pinned"
              name="pinned"
              label="Pin to top of news list"
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
          <Button render={<Link href="/admin/news" />} variant="outline">
            Cancel
          </Button>
          <SubmitButton pendingText="Creating…">Create Article</SubmitButton>
        </div>
      </form>
    </div>
  );
}
