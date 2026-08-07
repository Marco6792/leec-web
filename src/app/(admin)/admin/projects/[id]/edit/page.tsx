import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects, profiles } from "@/db/schema";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { ProjectForm, type ProjectInitial } from "../../_components/project-form";
import { updateProject, deleteProject } from "../../actions";
import { DeleteButton } from "../../../_components/delete-button";
import { AdminBreadcrumbs } from "../../../_components/breadcrumbs";
import { ViewPublicPage } from "../../../_components/view-public-page";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
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
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!item) redirect("/admin/projects?error=Project+not+found");

  const allProfiles = await db
    .select({ id: profiles.id, fullName: profiles.fullName })
    .from(profiles)
    .orderBy(profiles.fullName);

  const initial: ProjectInitial = {
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    status: item.status,
    piId: item.piId,
    startDate: item.startDate,
    endDate: item.endDate,
    fundingSource: item.fundingSource,
    fundingAmount: item.fundingAmount,
    currency: item.currency,
    imageUrl: item.imageUrl,
    pdfUrl: item.pdfUrl,
  };

  const boundAction = updateProject.bind(null, id);
  const boundDelete = deleteProject.bind(null, id);

  return (
    <div className="space-y-6">
      <AdminBreadcrumbs
        items={[{ label: "Projects", href: "/admin/projects" }, { label: "Edit Project" }]}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Editing: {item.title}
          </p>
        </div>
        <ViewPublicPage href={`/projects/${item.slug}`} />
      </div>

      <ProjectForm
        action={boundAction}
        profiles={allProfiles}
        initial={initial}
        error={sp.error}
        saved={sp.saved}
      />

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6 pb-8">
        <DeleteButton action={boundDelete} label="Delete Project" />
      </div>
    </div>
  );
}
