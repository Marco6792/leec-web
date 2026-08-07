"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadImage } from "@/components/admin/upload-image";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../_components/form-field";

export interface LabOption {
  id: string;
  name: string;
}

export interface MemberInitial {
  userId: string;
  fullName: string;
  email: string | null;
  title: string | null;
  role: string;
  status: string | null;
  labId: string | null;
  avatarUrl: string | null;
  institution: string | null;
  department: string | null;
  biography: string | null;
  researchInterests: string[] | null;
  orcid: string | null;
  googleScholar: string | null;
  researchGate: string | null;
  linkedIn: string | null;
  website: string | null;
  phone: string | null;
  isPublic: boolean | null;
}

const roles = [
  "director", "pi", "researcher", "phd_student", "master_student",
  "technician", "visitor", "external", "client",
] as const;

const roleLabels: Record<string, string> = {
  phd_student: "PhD Student",
  master_student: "Master Student",
};

const statuses = ["active", "inactive", "alumni"] as const;

interface MemberFormProps {
  action: (formData: FormData) => void;
  labs: LabOption[];
  initial?: MemberInitial;
  error?: string;
  saved?: string;
}

export function MemberForm({ action, labs, initial, error, saved }: MemberFormProps) {
  const isEdit = Boolean(initial);

  return (
    <form action={action} className="space-y-6 max-w-4xl">
      {(saved === "true" || error) && (
        <div
          className={
            saved === "true"
              ? "flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
          }
        >
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {saved === "true" ? (
              <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </>
            ) : (
              <>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </>
            )}
          </svg>
          {saved === "true" ? "Member saved successfully." : error}
        </div>
      )}

      {/* Profile photo */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            label="Profile photo"
            name="avatarUrl"
            helpText="Uploaded via UploadThing and shown on the public /people page."
          >
            <UploadImage
              endpoint="profileImage"
              inputName="avatarUrl"
              value={initial?.avatarUrl ?? ""}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <FormField label="Full name" name="fullName" required>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                defaultValue={initial?.fullName ?? ""}
                placeholder="e.g. Prof. Pierre Tsafack"
                className={inputClass}
              />
            </FormField>
            <FormField label="Title / Position" name="title">
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={initial?.title ?? ""}
                placeholder="e.g. Full Professor, PhD Student, Technician"
                className={inputClass}
              />
            </FormField>
          </FieldGrid>

          {isEdit ? (
            <FormField label="Email" name="email" helpText="Email is managed by the auth provider and cannot be changed here.">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={initial?.email ?? ""}
                disabled
                className={`${inputClass} opacity-60`}
              />
            </FormField>
          ) : (
            <FieldGrid cols={2}>
              <FormField label="Email" name="email" required>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="member@leec.ubuea.cm"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Password" name="password" required helpText="Temporary password, min. 8 characters. The member can change it after first login.">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </FormField>
            </FieldGrid>
          )}
        </CardContent>
      </Card>

      {/* Membership */}
      <Card>
        <CardHeader>
          <CardTitle>Membership</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={3}>
            <FormField label="Role" name="role" required>
              <select
                id="role"
                name="role"
                required
                defaultValue={initial?.role ?? "researcher"}
                className={selectClass}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {roleLabels[r] ?? r.charAt(0).toUpperCase() + r.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Status" name="status">
              <select
                id="status"
                name="status"
                defaultValue={initial?.status ?? "active"}
                className={selectClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Lab / Center" name="labId" required>
              <select
                id="labId"
                name="labId"
                required
                defaultValue={initial?.labId ?? "default"}
                className={selectClass}
              >
                {initial?.labId ? null : <option value="default">LEEC (default)</option>}
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))}
              </select>
            </FormField>
          </FieldGrid>

          <FieldGrid cols={2}>
            <FormField label="Institution" name="institution">
              <input
                id="institution"
                name="institution"
                type="text"
                defaultValue={initial?.institution ?? ""}
                placeholder="University of Buea"
                className={inputClass}
              />
            </FormField>
            <FormField label="Department" name="department">
              <input
                id="department"
                name="department"
                type="text"
                defaultValue={initial?.department ?? ""}
                placeholder="Electrical and Electronic Engineering"
                className={inputClass}
              />
            </FormField>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Biography */}
      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Biography" name="biography" helpText="Short academic and research background — shown on the people page.">
            <textarea
              id="biography"
              name="biography"
              rows={4}
              defaultValue={initial?.biography ?? ""}
              placeholder="Brief academic and professional background..."
              className={textareaClass}
            />
          </FormField>

          <FormField label="Research interests" name="researchInterests" helpText="Comma-separated.">
            <input
              id="researchInterests"
              name="researchInterests"
              type="text"
              defaultValue={initial?.researchInterests?.join(", ") ?? ""}
              placeholder="Power electronics, Energy harvesting, IoT"
              className={inputClass}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Academic profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Profiles &amp; Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <FormField label="ORCID" name="orcid">
              <input
                id="orcid"
                name="orcid"
                type="text"
                defaultValue={initial?.orcid ?? ""}
                placeholder="0000-0002-..."
                className={inputClass}
              />
            </FormField>
            <FormField label="Google Scholar" name="googleScholar">
              <input
                id="googleScholar"
                name="googleScholar"
                type="url"
                defaultValue={initial?.googleScholar ?? ""}
                placeholder="https://scholar.google.com/..."
                className={inputClass}
              />
            </FormField>
            <FormField label="ResearchGate" name="researchGate">
              <input
                id="researchGate"
                name="researchGate"
                type="url"
                defaultValue={initial?.researchGate ?? ""}
                placeholder="https://researchgate.net/profile/..."
                className={inputClass}
              />
            </FormField>
            <FormField label="LinkedIn" name="linkedIn">
              <input
                id="linkedIn"
                name="linkedIn"
                type="url"
                defaultValue={initial?.linkedIn ?? ""}
                placeholder="https://linkedin.com/in/..."
                className={inputClass}
              />
            </FormField>
            <FormField label="Website" name="website">
              <input
                id="website"
                name="website"
                type="url"
                defaultValue={initial?.website ?? ""}
                placeholder="https://example.com"
                className={inputClass}
              />
            </FormField>
            <FormField label="Phone" name="phone">
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={initial?.phone ?? ""}
                placeholder="+237 6XX XXX XXX"
                className={inputClass}
              />
            </FormField>
          </FieldGrid>

          <div className="flex items-center gap-3">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              defaultChecked={initial ? (initial.isPublic ?? true) : true}
              className="size-4 rounded border-border accent-primary"
            />
            <label htmlFor="isPublic" className="text-sm">
              Show this member on the public people page
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <a
          href="/admin/lab-members"
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isEdit ? "Save Changes" : "Create Member"}
        </button>
      </div>
    </form>
  );
}
