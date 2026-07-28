import { requireAdmin } from "@/lib/auth/admin";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { NewPublicationForm } from "../_components/new-publication-form";

export const dynamic = "force-dynamic";

export default async function NewPublicationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();

  const params = await searchParams;

  const allProfiles = await db
    .select({ id: profiles.id, fullName: profiles.fullName, title: profiles.title, institution: profiles.institution })
    .from(profiles)
    .orderBy(profiles.fullName);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Publication</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new publication to the lab repository.
          </p>
        </div>
        <a
          href="/admin/publications"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to publications
        </a>
      </div>

      <NewPublicationForm profiles={allProfiles} error={params.error} />
    </div>
  );
}
