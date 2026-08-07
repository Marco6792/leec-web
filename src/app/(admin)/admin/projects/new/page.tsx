import Link from "next/link";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { ProjectForm } from "../_components/project-form";
import { createProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  const allProfiles = await db
    .select({ id: profiles.id, fullName: profiles.fullName })
    .from(profiles)
    .orderBy(profiles.fullName);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Project</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new research project to the lab.
          </p>
        </div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to projects
        </Link>
      </div>

      <ProjectForm action={createProject} profiles={allProfiles} error={params.error} />
    </div>
  );
}
