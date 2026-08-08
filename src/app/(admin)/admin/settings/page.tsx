import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminBreadcrumbs } from "../_components/breadcrumbs";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SwitchField } from "../_components/switch-field";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "./actions";
import { SubmitButton } from "../_components/submit-button";

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
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Settings" }]} />
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
      <form action={updateProfile} className="grid gap-6 lg:grid-cols-2">
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
              <Input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={profile.fullName}
                required
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Title / Position
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                defaultValue={profile.title ?? ""}
                placeholder="e.g. Professor, PhD Student, Lab Technician"
              />
            </div>

            {/* Institution + Department */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium mb-1.5">
                  Institution
                </label>
                <Input
                  id="institution"
                  name="institution"
                  type="text"
                  defaultValue={profile.institution ?? ""}
                  placeholder="University of Buea"
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-1.5">
                  Department
                </label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  defaultValue={profile.department ?? ""}
                  placeholder="Electrical and Electronic Engineering"
                />
              </div>
            </div>

            {/* Biography */}
            <div>
              <label htmlFor="biography" className="block text-sm font-medium mb-1.5">
                Biography
              </label>
              <Textarea
                id="biography"
                name="biography"
                rows={4}
                defaultValue={profile.biography ?? ""}
                placeholder="Brief academic and professional background..."
              />
            </div>

            {/* Research Interests */}
            <div>
              <label htmlFor="researchInterests" className="block text-sm font-medium mb-1.5">
                Research Interests
              </label>
              <Input
                id="researchInterests"
                name="researchInterests"
                type="text"
                defaultValue={profile.researchInterests?.join(", ") ?? ""}
                placeholder="Comma-separated: Magnetic materials, NDT, Energy harvesting"
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
                <Input
                  id="orcid"
                  name="orcid"
                  type="text"
                  defaultValue={profile.orcid ?? ""}
                  placeholder="0000-0002-..."
                />
              </div>
              <div>
                <label htmlFor="googleScholar" className="block text-sm font-medium mb-1.5">
                  Google Scholar
                </label>
                <Input
                  id="googleScholar"
                  name="googleScholar"
                  type="url"
                  defaultValue={profile.googleScholar ?? ""}
                  placeholder="https://scholar.google.com/..."
                />
              </div>
              <div>
                <label htmlFor="researchGate" className="block text-sm font-medium mb-1.5">
                  ResearchGate
                </label>
                <Input
                  id="researchGate"
                  name="researchGate"
                  type="url"
                  defaultValue={profile.researchGate ?? ""}
                  placeholder="https://researchgate.net/profile/..."
                />
              </div>
              <div>
                <label htmlFor="linkedIn" className="block text-sm font-medium mb-1.5">
                  LinkedIn
                </label>
                <Input
                  id="linkedIn"
                  name="linkedIn"
                  type="url"
                  defaultValue={profile.linkedIn ?? ""}
                  placeholder="https://linkedin.com/in/..."
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
                <Input
                  id="website"
                  name="website"
                  type="url"
                  defaultValue={profile.website ?? ""}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={profile.phone ?? ""}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
            </div>

            {/* Public profile toggle */}
            <SwitchField
              id="isPublic"
              name="isPublic"
              label="Show my profile on the public website"
              defaultChecked={profile.isPublic ?? true}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
          <SubmitButton pendingText="Saving…">Save Changes</SubmitButton>
        </div>
      </form>
    </div>
  );
}
