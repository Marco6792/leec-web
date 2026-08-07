"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadImage } from "@/components/admin/upload-image";
import { PdfUpload } from "@/components/admin/pdf-upload";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../_components/form-field";

export interface ProfileOption {
  id: string;
  fullName: string;
}

export interface ProjectInitial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string | null;
  piId: string | null;
  startDate: string | null;
  endDate: string | null;
  fundingSource: string | null;
  fundingAmount: string | null;
  currency: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
}

const statuses = ["active", "completed", "on_hold", "cancelled", "proposed"] as const;
const currencies = ["XAF", "EUR", "USD", "GBP", "CNY"] as const;

interface ProjectFormProps {
  action: (formData: FormData) => void;
  profiles: ProfileOption[];
  initial?: ProjectInitial;
  error?: string;
  saved?: string;
}

export function ProjectForm({ action, profiles, initial, error, saved }: ProjectFormProps) {
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
          {saved === "true" ? "Project saved successfully." : error}
        </div>
      )}

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FormField label="Project title" name="title" required>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initial?.title ?? ""}
              placeholder="e.g. Smart Agriculture IoT Sensor Network"
              className={inputClass}
            />
          </FormField>

          <FieldGrid cols={2}>
            <FormField label="Status" name="status" helpText="Only projects with status 'Active' are shown on the public website.">
              <select
                id="status"
                name="status"
                defaultValue={initial?.status ?? "active"}
                className={selectClass}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "on_hold" ? "On Hold" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Principal Investigator" name="piId">
              <select
                id="piId"
                name="piId"
                defaultValue={initial?.piId ?? ""}
                className={selectClass}
              >
                <option value="">None</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                  </option>
                ))}
              </select>
            </FormField>
          </FieldGrid>

          <FormField label="Description" name="description">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initial?.description ?? ""}
              placeholder="Project objectives, scope and impact..."
              className={textareaClass}
            />
          </FormField>
        </CardContent>
      </Card>

      {/* Timeline & funding */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline &amp; Funding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <FormField label="Start date" name="startDate">
              <input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={initial?.startDate ?? ""}
                className={inputClass}
              />
            </FormField>
            <FormField label="End date" name="endDate">
              <input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={initial?.endDate ?? ""}
                className={inputClass}
              />
            </FormField>
          </FieldGrid>

          <FieldGrid cols={2}>
            <FormField label="Funding source" name="fundingSource">
              <input
                id="fundingSource"
                name="fundingSource"
                type="text"
                defaultValue={initial?.fundingSource ?? ""}
                placeholder="e.g. Agence Universitaire de la Francophonie"
                className={inputClass}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Amount" name="fundingAmount">
                <input
                  id="fundingAmount"
                  name="fundingAmount"
                  type="text"
                  inputMode="decimal"
                  defaultValue={initial?.fundingAmount ?? ""}
                  placeholder="e.g. 25000000"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Currency" name="currency">
                <select
                  id="currency"
                  name="currency"
                  defaultValue={initial?.currency ?? "XAF"}
                  className={selectClass}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </FieldGrid>

        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <FormField label="Project image" name="imageUrl" helpText="Uploaded via UploadThing.">
              <UploadImage endpoint="entityImage" inputName="imageUrl" value={initial?.imageUrl ?? ""} />
            </FormField>
            <FormField label="Project document (PDF)" name="pdfUrl" helpText="Uploaded to Supabase Storage with inline preview.">
              <PdfUpload inputName="pdfUrl" value={initial?.pdfUrl ?? ""} />
            </FormField>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <a
          href="/admin/projects"
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isEdit ? "Save Changes" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
