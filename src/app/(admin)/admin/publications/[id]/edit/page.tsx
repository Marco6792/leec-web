import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications, publicationAuthors, profiles } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { EditPublicationForm, type ExistingAuthor } from "../../_components/edit-publication-form";
import { ViewPublicPage } from "../../../_components/view-public-page";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";

export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const sp = await searchParams;

  const [pub] = await db
    .select()
    .from(publications)
    .where(eq(publications.id, id))
    .limit(1);

  if (!pub) redirect("/admin/publications?error=Publication+not+found");

  const authorRowsRaw = await db
    .select({
      profileId: publicationAuthors.profileId,
      fullName: profiles.fullName,
      affiliation: publicationAuthors.affiliation,
      corresponding: publicationAuthors.corresponding,
      authorOrder: publicationAuthors.authorOrder,
    })
    .from(publicationAuthors)
    .innerJoin(profiles, eq(publicationAuthors.profileId, profiles.id))
    .where(eq(publicationAuthors.publicationId, id))
    .orderBy(publicationAuthors.authorOrder);

  const authorRows: ExistingAuthor[] = authorRowsRaw.map((a) => ({
    ...a,
    corresponding: a.corresponding ?? false,
  }));

  const allProfiles = await db
    .select({ id: profiles.id, fullName: profiles.fullName, title: profiles.title, institution: profiles.institution })
    .from(profiles)
    .orderBy(profiles.fullName);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Publications", href: "/admin/publications" }, { label: "Edit Publication" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Publication</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {pub.title}
          </p>
        </div>
        <ViewPublicPage href={`/publications/${pub.id}`} />
      </div>

      <EditPublicationForm
        publication={pub}
        existingAuthors={authorRows}
        profiles={allProfiles}
        error={sp.error}
        saved={sp.saved}
      />
    </div>
  );
}
