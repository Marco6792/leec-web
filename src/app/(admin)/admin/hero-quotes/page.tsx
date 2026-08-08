import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { heroQuotes } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { HeroQuotesView } from "./hero-quotes-view";

export const dynamic = "force-dynamic";

export default async function AdminHeroQuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string; deleted?: string }>;
}) {
  await requireAdmin();

  const sp = await searchParams;

  const data = await db
    .select({
      id: heroQuotes.id,
      text: heroQuotes.text,
      published: heroQuotes.published,
      sortOrder: heroQuotes.sortOrder,
      updatedAt: heroQuotes.updatedAt,
    })
    .from(heroQuotes)
    .orderBy(asc(heroQuotes.sortOrder));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Hero Quotes" }]} />

      {sp.added === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          Quote added — it now rotates on the homepage subtitle.
        </div>
      )}
      {sp.deleted === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          Quote deleted.
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Quotes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            The homepage subtitle crossfades between these quotes. Add, edit,
            or delete them — changes go live immediately.
          </p>
        </div>
        <Link
          href="/admin/hero-quotes/new"
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          + Add Quote
        </Link>
      </div>

      <HeroQuotesView data={data} />
    </div>
  );
}
