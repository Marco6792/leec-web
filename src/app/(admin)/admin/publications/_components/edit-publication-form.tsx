"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePublication } from "../actions";
import {
  FormField,
  FieldGrid,
  inputClass,
  selectClass,
  textareaClass,
} from "../../_components/form-field";
import { PublisherInput } from "../_components/publisher-input";
import { AuthorSelector, type AuthorEntry } from "../_components/author-selector";
import { UploadImage } from "@/components/admin/upload-image";
import { PdfUpload } from "@/components/admin/pdf-upload";

const publicationTypes = [
  "journal", "conference", "book", "chapter", "report",
  "dataset", "thesis", "patent", "software", "preprint",
] as const;

interface Profile {
  id: string;
  fullName: string;
  title: string | null;
  institution: string | null;
}

interface Publication {
  id: string;
  type: string;
  title: string;
  abstract: string | null;
  year: number;
  doi: string | null;
  journal: string | null;
  conference: string | null;
  publisher: string[] | null;
  volume: string | null;
  issue: string | null;
  pages: string | null;
  isbn: string | null;
  issn: string | null;
  patentNumber: string | null;
  repository: string | null;
  citationCount: number | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  sourceDataUrl: string | null;
  keywords: string[] | null;
  researchDomains: string[] | null;
  language: string | null;
  license: string | null;
  openAccess: boolean | null;
}

export interface ExistingAuthor {
  profileId: string;
  fullName: string;
  affiliation: string | null;
  corresponding: boolean;
  authorOrder: number;
}

export function EditPublicationForm({
  publication,
  existingAuthors,
  profiles,
  error,
  saved,
}: {
  publication: Publication;
  existingAuthors: ExistingAuthor[];
  profiles: Profile[];
  error?: string;
  saved?: string;
}) {
  const [publishers, setPublishers] = useState<string[]>(publication.publisher ?? []);
  const [authors, setAuthors] = useState<AuthorEntry[]>(
    existingAuthors
      .sort((a, b) => a.authorOrder - b.authorOrder)
      .map((a) => ({
        profileId: a.profileId,
        fullName: a.fullName,
        affiliation: a.affiliation ?? "",
        corresponding: a.corresponding,
      }))
  );

  const boundAction = updatePublication.bind(null, publication.id);

  return (
    <form action={boundAction} className="space-y-6">
      {saved === "true" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Publication saved successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Row 1: Basic Info + Venue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Publication Type" name="type" required>
                <select id="type" name="type" defaultValue={publication.type} required className={selectClass}>
                  <option value="">Select type…</option>
                  {publicationTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Year" name="year" required>
                <input
                  id="year"
                  name="year"
                  type="number"
                  defaultValue={publication.year}
                  min={1900}
                  max={2100}
                  required
                  className={inputClass}
                />
              </FormField>
            </FieldGrid>

            <FormField label="Title" name="title" required>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={publication.title}
                required
                className={inputClass}
              />
            </FormField>

            <FormField label="Authors" name="authors" helpText="Search and add lab members as authors. Drag to reorder.">
              <AuthorSelector profiles={profiles} value={authors} onChange={setAuthors} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Venue &amp; Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FieldGrid cols={2}>
              <FormField label="Journal" name="journal">
                <input id="journal" name="journal" type="text" defaultValue={publication.journal ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Conference" name="conference">
                <input id="conference" name="conference" type="text" defaultValue={publication.conference ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Publishers" name="publisher" helpText="Type and press Enter to add. Multiple publishers supported.">
              <PublisherInput value={publishers} onChange={setPublishers} />
            </FormField>

            <FormField label="DOI" name="doi" helpText="Digital Object Identifier.">
              <input id="doi" name="doi" type="text" defaultValue={publication.doi ?? ""} placeholder="10.1000/xyz123" className={inputClass} />
            </FormField>

            <FieldGrid cols={3}>
              <FormField label="Volume" name="volume">
                <input id="volume" name="volume" type="text" defaultValue={publication.volume ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Issue" name="issue">
                <input id="issue" name="issue" type="text" defaultValue={publication.issue ?? ""} className={inputClass} />
              </FormField>
              <FormField label="Pages" name="pages">
                <input id="pages" name="pages" type="text" defaultValue={publication.pages ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="ISBN" name="isbn">
                <input id="isbn" name="isbn" type="text" defaultValue={publication.isbn ?? ""} className={inputClass} />
              </FormField>
              <FormField label="ISSN" name="issn">
                <input id="issn" name="issn" type="text" defaultValue={publication.issn ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Patent Number" name="patentNumber">
              <input id="patentNumber" name="patentNumber" type="text" defaultValue={publication.patentNumber ?? ""} className={inputClass} />
            </FormField>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Abstract + Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Abstract &amp; Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Abstract" name="abstract" helpText="A brief summary: goals, methods, key findings, and conclusions.">
              <textarea
                id="abstract"
                name="abstract"
                rows={12}
                defaultValue={publication.abstract ?? ""}
                className={`${textareaClass} min-h-[200px] leading-relaxed`}
              />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Keywords &amp; Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField label="Keywords" name="keywords" helpText="Comma-separated. 4–8 searchable terms.">
              <textarea
                id="keywords"
                name="keywords"
                rows={3}
                defaultValue={(publication.keywords ?? []).join(", ")}
                className={`${textareaClass} min-h-[80px]`}
              />
            </FormField>

            <FormField label="Research Domains" name="researchDomains" helpText="Comma-separated.">
              <input id="researchDomains" name="researchDomains" type="text" defaultValue={(publication.researchDomains ?? []).join(", ")} className={inputClass} />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Repository" name="repository">
                <input id="repository" name="repository" type="text" defaultValue={publication.repository ?? ""} className={inputClass} />
              </FormField>
              <FormField label="License" name="license">
                <input id="license" name="license" type="text" defaultValue={publication.license ?? ""} className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Language" name="language" helpText="ISO 639-1 code.">
                <select id="language" name="language" defaultValue={publication.language ?? "en"} className={selectClass}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
              <FormField label="Citation Count" name="citationCount">
                <input id="citationCount" name="citationCount" type="number" min={0} defaultValue={publication.citationCount ?? 0} className={inputClass} />
              </FormField>
            </FieldGrid>

            <div className="flex items-center gap-3">
              <input
                id="openAccess"
                name="openAccess"
                type="checkbox"
                defaultChecked={publication.openAccess ?? false}
                className="size-4 rounded border-border accent-primary"
              />
              <label htmlFor="openAccess" className="text-sm">
                Open Access
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Media & Links */}
      <Card>
        <CardHeader>
          <CardTitle>Media &amp; Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <FieldGrid cols={2}>
            <FormField label="Cover image" name="imageUrl" helpText="Uploaded via UploadThing.">
              <UploadImage endpoint="entityImage" inputName="imageUrl" value={publication.imageUrl ?? ""} />
            </FormField>
            <FormField label="PDF document" name="pdfUrl" helpText="Uploaded to Supabase Storage with inline preview.">
              <PdfUpload inputName="pdfUrl" value={publication.pdfUrl ?? ""} />
            </FormField>
          </FieldGrid>

          <FormField label="Source Data URL" name="sourceDataUrl" helpText="Link to raw data or a repository.">
            <input id="sourceDataUrl" name="sourceDataUrl" type="url" defaultValue={publication.sourceDataUrl ?? ""} className={inputClass} />
          </FormField>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <a
          href="/admin/publications"
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
