import { desc } from "drizzle-orm";
import { db } from "@/db";
import { sitePages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { PagesView } from "./pages-view";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  await requireAdmin();

  const data = await db
    .select({
      id: sitePages.id,
      slug: sitePages.slug,
      title: sitePages.title,
      published: sitePages.published,
      updatedAt: sitePages.updatedAt,
    })
    .from(sitePages)
    .orderBy(desc(sitePages.updatedAt));

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Pages" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Pages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the static pages shown on the public site — About, Contact,
          Privacy, Terms, and Services. Changes go live immediately.
        </p>
      </div>

      <PagesView data={data} />
    </div>
  );
}
