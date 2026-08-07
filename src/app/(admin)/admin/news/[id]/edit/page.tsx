import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { news } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateNews, deleteNews } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaUpload } from "@/components/admin/media-upload";
import { ViewPublicPage } from "../../../_components/view-public-page";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
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
    .from(news)
    .where(eq(news.id, id))
    .limit(1);

  if (!item) redirect("/admin/news?error=News+article+not+found");

  const boundAction = updateNews.bind(null, id);
  const boundDelete = deleteNews.bind(null, id);

  const dateStr = item.publishedAt
    ? new Date(item.publishedAt).toISOString().split("T")[0]
    : "";

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit News Article</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.title}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewPublicPage href={`/news/${item.slug}`} />
          <Link
            href="/admin/news"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to news
          </Link>
        </div>
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          News article saved successfully.
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
        <input type="hidden" name="slug" value={item.slug} />

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
                defaultValue={item.title}
                required
              />
            </FormField>

            <FormField label="Excerpt" name="excerpt">
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                defaultValue={item.excerpt ?? ""}
              />
            </FormField>

            <FormField label="Content" name="content">
              <Textarea
                id="content"
                name="content"
                rows={12}
                defaultValue={item.content ?? ""}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media &amp; Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
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

            <FieldGrid cols={2}>
              <FormField label="Published Date" name="publishedAt">
                <Input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  defaultValue={dateStr}
                />
              </FormField>

              <FormField label="Tags" name="tags" helpText="Comma-separated tags.">
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  defaultValue={item.tags?.join(", ") ?? ""}
                  placeholder="Research, Award, Student"
                />
              </FormField>
            </FieldGrid>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={item.published ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="published" className="text-sm">
                Published
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="pinned"
                name="pinned"
                type="checkbox"
                defaultChecked={item.pinned ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="pinned" className="text-sm">
                Pinned to top
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3 pb-8 lg:col-span-2">
          <form action={boundDelete}>
            <button
              type="submit"
              className="rounded-lg border border-rose-200 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50 transition-colors dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/30"
            >
              Delete Article
            </button>
          </form>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/news"
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
