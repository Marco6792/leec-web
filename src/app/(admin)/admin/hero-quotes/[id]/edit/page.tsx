import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { heroQuotes } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SwitchField } from "../../../_components/switch-field";
import { Textarea } from "@/components/ui/textarea";
import { updateQuote, deleteQuote } from "../../actions";
import {
  FormField,
  FieldGrid,
} from "../../../_components/form-field";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function EditHeroQuotePage({
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
    .from(heroQuotes)
    .where(eq(heroQuotes.id, id))
    .limit(1);

  if (!item) redirect("/admin/hero-quotes?error=Quote+not+found");

  const boundUpdate = updateQuote.bind(null, id);
  const boundDelete = deleteQuote.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <AdminBreadcrumbs
        items={[
          { label: "Hero Quotes", href: "/admin/hero-quotes" },
          { label: "Edit Quote" },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Hero Quote</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Changes go live on the homepage immediately.
        </p>
      </div>

      {sp.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          Quote saved — it now rotates on the homepage subtitle.
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
                defaultValue={item.text}
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
                  defaultValue={item.sortOrder}
                />
              </FormField>

              <SwitchField
                id="published"
                name="published"
                label="Live — rotate on the homepage"
                defaultChecked={item.published}
              />
            </FieldGrid>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" formAction={boundDelete} variant="outline" className="text-xs text-destructive hover:text-destructive border-rose-200 text-rose-700 dark:border-rose-900/50 dark:text-rose-400">
            Delete Quote
          </Button>
          <div className="flex items-center gap-3">
            <Button render={<Link href="/admin/hero-quotes" />} variant="outline">
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
