import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SwitchField } from "../../_components/switch-field";
import { Textarea } from "@/components/ui/textarea";
import { addQuote } from "../actions";
import { FormField, FieldGrid } from "../../_components/form-field";
import { AdminBreadcrumbs } from "../../_components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function NewHeroQuotePage({
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
          { label: "Hero Quotes", href: "/admin/hero-quotes" },
          { label: "Add Quote" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Hero Quote</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This quote will join the rotation on the homepage subtitle.
        </p>
      </div>

      {sp.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          {sp.error}
        </div>
      )}

      <form action={addQuote} className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              label="Quote text"
              name="text"
              required
              helpText="Shown as the homepage subtitle. Keep it to one or two sentences."
            >
              <Textarea
                id="text"
                name="text"
                rows={4}
                required
                minLength={3}
                placeholder="e.g. Advancing African engineering through cutting-edge research…"
              />
            </FormField>

            <FieldGrid cols={2}>
              <FormField
                label="Sort order"
                name="sortOrder"
                helpText="Lower numbers appear first in the rotation."
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

              <SwitchField
                id="published"
                name="published"
                label="Live — rotate on the homepage"
              />
            </FieldGrid>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/hero-quotes"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
          <Button type="submit">
            Add Quote
          </Button>
        </div>
      </form>
    </div>
  );
}
