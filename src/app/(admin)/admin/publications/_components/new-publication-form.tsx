"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPublication } from "../actions";
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

export function NewPublicationForm({
  profiles,
  error,
}: {
  profiles: Profile[];
  error?: string;
}) {
  const [publishers, setPublishers] = useState<string[]>([]);
  const [authors, setAuthors] = useState<AuthorEntry[]>([]);

  return (
    <form action={createPublication} className="space-y-6">
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
                <select id="type" name="type" required className={selectClass}>
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
                  defaultValue={new Date().getFullYear()}
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
                required
                placeholder="Full title of the publication"
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
              <FormField label="Journal" name="journal" helpText="For journal articles.">
                <input id="journal" name="journal" type="text" placeholder="e.g. Nature" className={inputClass} />
              </FormField>
              <FormField label="Conference" name="conference" helpText="For conference papers.">
                <input id="conference" name="conference" type="text" placeholder="e.g. IEEE ICASSP" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Publishers" name="publisher" helpText="Type and press Enter to add. Multiple publishers supported.">
              <PublisherInput value={publishers} onChange={setPublishers} />
            </FormField>

            <FormField label="DOI" name="doi" helpText="Digital Object Identifier.">
              <input id="doi" name="doi" type="text" placeholder="10.1000/xyz123" className={inputClass} />
            </FormField>

            <FieldGrid cols={3}>
              <FormField label="Volume" name="volume">
                <input id="volume" name="volume" type="text" placeholder="e.g. 42" className={inputClass} />
              </FormField>
              <FormField label="Issue" name="issue">
                <input id="issue" name="issue" type="text" placeholder="e.g. 3" className={inputClass} />
              </FormField>
              <FormField label="Pages" name="pages">
                <input id="pages" name="pages" type="text" placeholder="e.g. 123–145" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="ISBN" name="isbn" helpText="For books.">
                <input id="isbn" name="isbn" type="text" placeholder="978-0-00-000000-0" className={inputClass} />
              </FormField>
              <FormField label="ISSN" name="issn" helpText="For journals.">
                <input id="issn" name="issn" type="text" placeholder="0000-0000" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FormField label="Patent Number" name="patentNumber" helpText="For patents.">
              <input id="patentNumber" name="patentNumber" type="text" placeholder="e.g. US 9,999,999 B2" className={inputClass} />
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
                placeholder={"Write a comprehensive abstract including:\n\n• Background & Objectives\n• Methods\n• Key Results\n• Conclusions & Recommendations"}
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
                placeholder="keyword1, keyword2, keyword3, keyword4"
                className={`${textareaClass} min-h-[80px]`}
              />
            </FormField>

            <FormField label="Research Domains" name="researchDomains" helpText="Comma-separated.">
              <input id="researchDomains" name="researchDomains" type="text" placeholder="domain1, domain2" className={inputClass} />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Repository" name="repository" helpText="e.g. arXiv, Zenodo">
                <input id="repository" name="repository" type="text" placeholder="e.g. arXiv" className={inputClass} />
              </FormField>
              <FormField label="License" name="license">
                <input id="license" name="license" type="text" placeholder="e.g. CC-BY-4.0" className={inputClass} />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Language" name="language" helpText="ISO 639-1 code.">
                <select id="language" name="language" defaultValue="en" className={selectClass}>
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
              <FormField label="Citation Count" name="citationCount">
                <input id="citationCount" name="citationCount" type="number" min={0} defaultValue={0} className={inputClass} />
              </FormField>
            </FieldGrid>

            <div className="flex items-center gap-3">
              <input
                id="openAccess"
                name="openAccess"
                type="checkbox"
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
              <UploadImage endpoint="entityImage" inputName="imageUrl" />
            </FormField>
            <FormField label="PDF document" name="pdfUrl" helpText="Uploaded to Supabase Storage with inline preview.">
              <PdfUpload inputName="pdfUrl" />
            </FormField>
          </FieldGrid>

          <FormField label="Source Data URL" name="sourceDataUrl" helpText="Link to raw data or a repository.">
            <input id="sourceDataUrl" name="sourceDataUrl" type="url" placeholder="https://..." className={inputClass} />
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
          Create Publication
        </button>
      </div>
    </form>
  );
}
