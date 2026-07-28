import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { role, user } = await requireAdmin();

  const params = await searchParams;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  if (!profile) redirect("/login");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile and account settings.
        </p>
      </div>

      {/* Feedback banners */}
      {params.saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Profile saved successfully.
        </div>
      )}
      {params.error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {params.error.replace(/\+/g, " ")}
        </div>
      )}

      {/* Profile Form */}
      <form action={updateProfile} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile.fullName}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Title / Position
              </label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={profile.title ?? ""}
                placeholder="e.g. Professor, PhD Student, Lab Technician"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>

            {/* Institution + Department */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium mb-1.5">
                  Institution
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  defaultValue={profile.institution ?? ""}
                  placeholder="University of Buea"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1.5">
                  Department
                </label>
                <input
                  id="department"
                  name="department"
                  type="text"
                  defaultValue={profile.department ?? ""}
                  placeholder="Electrical and Electronic Engineering"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>

            {/* Biography */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium mb-1.5">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows={4}
                defaultValue={profile.biography ?? ""}
                placeholder="Brief academic and professional background..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50 resize-y min-h-[100px]"
              />
            </div>

            {/* Research Interests */}
            <div>
              <label htmlFor="researchInterests" className="block text-sm font-medium mb-1.5">
                Research Interests
              </label>
              <input
                id="researchInterests"
                name="researchInterests"
                type="text"
                defaultValue={profile.researchInterests?.join(", ") ?? ""}
                placeholder="Comma-separated: Magnetic materials, NDT, Energy harvesting"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate each interest with a comma.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Profiles */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="orcid" className="block text-sm font-medium mb-1.5">
                  ORCID
                </label>
                <input
                  id="orcid"
                  name="orcid"
                  type="text"
                  defaultValue={profile.orcid ?? ""}
                  placeholder="0000-0002-..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label htmlFor="googleScholar" className="block text-sm font-medium mb-1.5">
                  Google Scholar
                </label>
                <input
                  id="googleScholar"
                  name="googleScholar"
                  type="url"
                  defaultValue={profile.googleScholar ?? ""}
                  placeholder="https://scholar.google.com/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label htmlFor="researchGate" className="block text-sm font-medium mb-1.5">
                  ResearchGate
                </label>
                <input
                  id="researchGate"
                  name="researchGate"
                  type="url"
                  defaultValue={profile.researchGate ?? ""}
                  placeholder="https://researchgate.net/profile/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label htmlFor="linkedIn" className="block text-sm font-medium mb-1.5">
                  LinkedIn
                </label>
                <input
                  id="linkedIn"
                  name="linkedIn"
                  type="url"
                  defaultValue={profile.linkedIn ?? ""}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Visibility */}
        <Card>
          <CardHeader>
            <CardTitle>Contact &amp; Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-1.5">
                  Personal Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={profile.website ?? ""}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone ?? ""}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>

            {/* Public profile toggle */}
            <div className="flex items-center gap-3">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                defaultChecked={profile.isPublic ?? true}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="isPublic" className="text-sm">
                Show my profile on the public website
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
