import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { researchDomains } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateResearchArea, deleteResearchArea } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function EditResearchAreaPage({
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
    .from(researchDomains)
    .where(eq(researchDomains.id, id))
    .limit(1);

  if (!item) redirect("/admin/research-areas?error=Research+area+not+found");

  const boundUpdate = updateResearchArea.bind(null, id);
  const boundDelete = deleteResearchArea.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: "Research Areas", href: "/admin/research-areas" },
          { label: "Edit Area" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Research Area</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Changes appear on the public research page immediately.
        </p>
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          Research area saved.
        </div>
      )}
      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {sp.error}
        </div>
      )}

      <form action={boundUpdate} className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Area Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              label="Name"
              name="name"
              required
              helpText="Displayed as the card title."
            >
              <Input
                id="name"
                name="name"
                required
                defaultValue={item.name}
              />
            </FormField>

            <FormField
              label="Slug"
              name="slug"
              helpText="URL segment. Auto-generated from name if left blank."
            >
              <Input
                id="slug"
                name="slug"
                defaultValue={item.slug}
              />
            </FormField>

            <FormField
              label="Description"
              name="description"
              helpText="Shown below the title on the public card."
            >
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={item.description ?? ""}
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField
                label="Icon name"
                name="icon"
                helpText="Lucide icon name, e.g. Cpu, Zap, Waves."
              >
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={item.icon ?? ""}
                />
              </FormField>

              <FormField
                label="Sort order"
                name="sortOrder"
                helpText="Lower numbers appear first."
              >
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={item.sortOrder ?? ""}
                />
              </FormField>
            </FieldGrid>

            <FormField
              label="Featured image URL"
              name="featuredImageUrl"
              helpText="Path or URL for the card hero image."
            >
              <Input
                id="featuredImageUrl"
                name="featuredImageUrl"
                defaultValue={item.featuredImageUrl ?? ""}
              />
            </FormField>

            <FormField
              label="Tags"
              name="tags"
              helpText="Comma-separated tags shown on the card."
            >
              <Input
                id="tags"
                name="tags"
                  defaultValue={Array.isArray(item.tags) ? item.tags.join(", ") : ""}
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" formAction={boundDelete} variant="outline" className="text-xs text-destructive hover:text-destructive border-rose-200 text-rose-700 dark:border-rose-900/50 dark:text-rose-400">
            Delete Area
          </Button>
          <div className="flex items-center gap-3">
            <Button render={<Link href="/admin/research-areas" />} variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
