"use client";

import { useState } from "react";
import { ExternalLink, FileText, X } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPublication } from "../actions";
import {
  FormField,
  FieldGrid,
} from "../../_components/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { cn, formatBytes } from "@/lib/utils";
import { PublisherInput } from "../_components/publisher-input";
import { AuthorSelector, type AuthorEntry } from "../_components/author-selector";
import { MediaUpload } from "@/components/admin/media-upload";
import { UploadProgress } from "@/components/admin/upload-progress";
import { deleteUpload } from "@/lib/upload-delete";

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
  const [sourceDataUrl, setSourceDataUrl] = useState("");
  const [sourceDataError, setSourceDataError] = useState<string | null>(null);
  const [sourceDataProgress, setSourceDataProgress] = useState<number | null>(null);
  const [sourceDataPending, setSourceDataPending] = useState<File[]>([]);
  const sourceDataPendingSize = sourceDataPending.reduce((sum, f) => sum + f.size, 0);

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
                <NativeSelect id="type" name="type" required className="w-full">
                  <option value="">Select type…</option>
                  {publicationTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>

              <FormField label="Year" name="year" required>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  defaultValue={new Date().getFullYear()}
                  min={1900}
                  max={2100}
                  required
                />
              </FormField>
            </FieldGrid>

            <FormField label="Title" name="title" required>
              <Input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Full title of the publication"
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
                <Input id="journal" name="journal" type="text" placeholder="e.g. Nature" />
              </FormField>
              <FormField label="Conference" name="conference" helpText="For conference papers.">
                <Input id="conference" name="conference" type="text" placeholder="e.g. IEEE ICASSP" />
              </FormField>
            </FieldGrid>

            <FormField label="Publishers" name="publisher" helpText="Type and press Enter to add. Multiple publishers supported.">
              <PublisherInput value={publishers} onChange={setPublishers} />
            </FormField>

            <FormField label="DOI" name="doi" helpText="Digital Object Identifier.">
              <Input id="doi" name="doi" type="text" placeholder="10.1000/xyz123" />
            </FormField>

            <FieldGrid cols={3}>
              <FormField label="Volume" name="volume">
                <Input id="volume" name="volume" type="text" placeholder="e.g. 42" />
              </FormField>
              <FormField label="Issue" name="issue">
                <Input id="issue" name="issue" type="text" placeholder="e.g. 3" />
              </FormField>
              <FormField label="Pages" name="pages">
                <Input id="pages" name="pages" type="text" placeholder="e.g. 123–145" />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="ISBN" name="isbn" helpText="For books.">
                <Input id="isbn" name="isbn" type="text" placeholder="978-0-00-000000-0" />
              </FormField>
              <FormField label="ISSN" name="issn" helpText="For journals.">
                <Input id="issn" name="issn" type="text" placeholder="0000-0000" />
              </FormField>
            </FieldGrid>

            <FormField label="Patent Number" name="patentNumber" helpText="For patents.">
              <Input id="patentNumber" name="patentNumber" type="text" placeholder="e.g. US 9,999,999 B2" />
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
              <Textarea
                id="abstract"
                name="abstract"
                rows={12}
                placeholder={"Write a comprehensive abstract including:\n\n• Background & Objectives\n• Methods\n• Key Results\n• Conclusions & Recommendations"}
                className="min-h-[200px] leading-relaxed"
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
              <Textarea
                id="keywords"
                name="keywords"
                rows={3}
                placeholder="keyword1, keyword2, keyword3, keyword4"
                className="min-h-[80px]"
              />
            </FormField>

            <FormField label="Research Domains" name="researchDomains" helpText="Comma-separated.">
              <Input id="researchDomains" name="researchDomains" type="text" placeholder="domain1, domain2" />
            </FormField>

            <FieldGrid cols={2}>
              <FormField label="Repository" name="repository" helpText="e.g. arXiv, Zenodo">
                <Input id="repository" name="repository" type="text" placeholder="e.g. arXiv" />
              </FormField>
              <FormField label="License" name="license">
                <Input id="license" name="license" type="text" placeholder="e.g. CC-BY-4.0" />
              </FormField>
            </FieldGrid>

            <FieldGrid cols={2}>
              <FormField label="Language" name="language" helpText="ISO 639-1 code.">
                <NativeSelect id="language" name="language" defaultValue="en" className="w-full">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="pt">Portuguese</option>
                  <option value="other">Other</option>
                </NativeSelect>
              </FormField>
              <FormField label="Citation Count" name="citationCount">
                <Input id="citationCount" name="citationCount" type="number" min={0} defaultValue={0} />
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
            <FormField label="Images" name="gallery" helpText="Upload one or more images. The first image is used as the cover.">
              <MediaUpload endpoint="gallery" inputName="gallery" />
            </FormField>
            <FormField label="Documents" name="documents" helpText="Upload one or more PDFs or documents. The first is shown inline on the page.">
              <MediaUpload endpoint="documents" inputName="documents" />
            </FormField>
          </FieldGrid>

          <FormField label="Source data" name="sourceDataUrl" helpText="Upload a dataset or supplementary data file (CSV, Excel, ZIP, DOCX…).">
            <input type="hidden" name="sourceDataUrl" value={sourceDataUrl} />
            {sourceDataUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <FileText className="size-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {decodeURIComponent(sourceDataUrl.split("/").pop() ?? sourceDataUrl).split("?")[0]}
                  </p>
                  <a
                    href={sourceDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Open file
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const removed = sourceDataUrl;
                    setSourceDataUrl("");
                    setSourceDataError(null);
                    if (removed) void deleteUpload(removed);
                  }}
                  aria-label="Remove file"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <UploadDropzone<OurFileRouter, "dataFile">
                endpoint="dataFile"
                config={{ mode: "manual" }}
                uploadProgressGranularity="fine"
                onChange={(files) => setSourceDataPending(files)}
                onUploadBegin={() => setSourceDataProgress(0)}
                onUploadProgress={(p) => setSourceDataProgress(p)}
                onClientUploadComplete={(res) => {
                  const file = res?.[0];
                  if (file?.url) {
                    setSourceDataUrl(file.url);
                    setSourceDataError(null);
                  }
                  setSourceDataPending([]);
                  setSourceDataProgress(null);
                }}
                onUploadError={(err) => {
                  setSourceDataError(err.message);
                  setSourceDataProgress(null);
                }}
                appearance={{
                  container: (args) =>
                    cn(
                      "cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 transition-colors",
                      "hover:border-ring hover:bg-muted/50",
                      args.isDragActive && "border-primary bg-primary/5",
                      args.isUploading && "border-primary/50 opacity-80",
                    ),
                  label: (args) =>
                    cn(
                      "text-sm font-medium text-muted-foreground",
                      args.isDragActive && "text-primary",
                      args.isUploading && "text-primary",
                    ),
                  allowedContent: "text-xs text-muted-foreground/80",
                  button: (args) =>
                    cn(
                      "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors",
                      "hover:bg-primary/90 disabled:opacity-60",
                    ),
                }}
              />
            )}
            {sourceDataPending.length > 0 && !sourceDataUrl && (
              <p className="text-xs font-medium text-muted-foreground">
                {sourceDataPending.length} file{sourceDataPending.length === 1 ? "" : "s"} selected ·{" "}
                {formatBytes(sourceDataPendingSize)}
              </p>
            )}
            {sourceDataProgress !== null && !sourceDataUrl && (
              <UploadProgress progress={sourceDataProgress} totalBytes={sourceDataPendingSize} />
            )}
            {sourceDataError && (
              <p className="text-xs text-destructive">{sourceDataError}</p>
            )}
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
