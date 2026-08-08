import { FileText, Maximize2, Download } from "lucide-react";
import { PdfViewer } from "@/components/pdf-viewer";

/** Best-effort PDF detection — works with .pdf suffixes and query-strings. */
export function isPdfUrl(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".pdf") || clean.includes(".pdf");
}

export function fileNameFromUrl(url: string): string {
  return decodeURIComponent(url.split("?")[0].split("/").pop() ?? url);
}

/**
 * Renders an uploaded document on the public site.
 *
 * - PDFs get an inline embedded preview (`PdfViewer`) with open/download.
 * - Any other file type (docs, spreadsheets, zips, data files…) gets a
 *   clean attachment card with open/download buttons.
 */
export function DocumentPreview({ url, title }: { url: string; title?: string }) {
  if (isPdfUrl(url)) {
    return <PdfViewer url={url} title={title} />;
  }

  const fileName = fileNameFromUrl(url);

  return (
    <div className="flex items-center gap-3 rounded-2xl border p-4">
      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{title ?? fileName}</p>
        <p className="text-xs text-muted-foreground truncate">{fileName}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
        >
          <Maximize2 className="size-3.5" /> Open
        </a>
        <a
          href={url}
          download
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <Download className="size-3.5" /> Download
        </a>
      </div>
    </div>
  );
}
