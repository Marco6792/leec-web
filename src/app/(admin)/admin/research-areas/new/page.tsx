import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createResearchArea } from "../actions";
import { FormField, FieldGrid } from "../../_components/form-field";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function NewResearchAreaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: "Research Areas", href: "/admin/research-areas" },
          { label: "Add Area" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Research Area</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This will appear as a card on the public research page.
        </p>
      </div>

      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {sp.error}
        </div>
      )}

      <form action={createResearchArea} className="space-y-5">
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
                placeholder="e.g. Power Electronics & Energy Management"
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
                placeholder="e.g. power-electronics"
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
                placeholder="Brief description of this research area…"
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
                  placeholder="Cpu"
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
                  defaultValue={0}
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
                placeholder="/research/example.jpg"
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
                placeholder="Solar PV, Battery Management, Power Grids"
              />
            </FormField>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/research-areas"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <Button type="submit">
            Add Area
          </Button>
        </div>
      </form>
    </div>
  );
}
