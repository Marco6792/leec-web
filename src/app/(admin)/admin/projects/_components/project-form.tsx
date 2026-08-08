"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadImage } from "@/components/admin/upload-image";
import { PdfUpload } from "@/components/admin/pdf-upload";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "../../_components/submit-button";
import { Input } from "@/components/ui/input";
import { RichTextEditorField } from "@/components/ui/rich-text-editor-field";
import { NativeSelect } from "@/components/ui/native-select";

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
    <form action={action} className="grid gap-6 lg:grid-cols-2">
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
            <Input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={initial?.title ?? ""}
              placeholder="e.g. Smart Agriculture IoT Sensor Network"
            />
          </FormField>

          <FieldGrid cols={2}>
            <FormField label="Status" name="status" helpText="Only projects with status 'Active' are shown on the public website.">
              <NativeSelect
                id="status"
                name="status"
                defaultValue={initial?.status ?? "active"}
                className="w-full"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "on_hold" ? "On Hold" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
            <FormField label="Principal Investigator" name="piId">
              <NativeSelect
                id="piId"
                name="piId"
                defaultValue={initial?.piId ?? ""}
                className="w-full"
              >
                <option value="">None</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.fullName}
                  </option>
                ))}
              </NativeSelect>
            </FormField>
          </FieldGrid>

          <FormField label="Description" name="description" helpText="Project objectives, scope and impact. Use the toolbar for formatting.">
            <RichTextEditorField
              id="description"
              name="description"
              defaultValue={initial?.description ?? ""}
              placeholder="Project objectives, scope and impact..."
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
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={initial?.startDate ?? ""}
              />
            </FormField>
            <FormField label="End date" name="endDate">
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={initial?.endDate ?? ""}
              />
            </FormField>
          </FieldGrid>

          <FieldGrid cols={2}>
            <FormField label="Funding source" name="fundingSource">
              <Input
                id="fundingSource"
                name="fundingSource"
                type="text"
                defaultValue={initial?.fundingSource ?? ""}
                placeholder="e.g. Agence Universitaire de la Francophonie"
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Amount" name="fundingAmount">
                <Input
                  id="fundingAmount"
                  name="fundingAmount"
                  type="text"
                  inputMode="decimal"
                  defaultValue={initial?.fundingAmount ?? ""}
                  placeholder="e.g. 25000000"
                />
              </FormField>
              <FormField label="Currency" name="currency">
                <NativeSelect
                  id="currency"
                  name="currency"
                  defaultValue={initial?.currency ?? "XAF"}
                  className="w-full"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </NativeSelect>
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
            <FormField label="Project document (PDF)" name="pdfUrl" helpText="Uploaded via UploadThing with inline preview.">
              <PdfUpload inputName="pdfUrl" value={initial?.pdfUrl ?? ""} />
            </FormField>
          </FieldGrid>
        </CardContent>
      </Card>

      {/* Submit */}
            <div className="flex items-center justify-end gap-3 pb-8 lg:col-span-2">
        <Button render={<Link href="/admin/projects" />} variant="outline">
          Cancel
        </Button>
        <SubmitButton pendingText="Saving…">
          {isEdit ? "Save Changes" : "Create Project"}
        </SubmitButton>
      </div>
    </form>
  );
}
