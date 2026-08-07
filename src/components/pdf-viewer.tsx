import { FileText, Maximize2, Download } from "lucide-react";

/**
 * Embedded PDF viewer with a toolbar (open in new tab / download) and an
 * inline iframe preview. Used on public detail pages for documents uploaded
 * to Supabase Storage (publications, news, events, equipment, projects).
 */
export function PdfViewer({ url, title }: { url: string; title?: string }) {
  const fileName = url.split("/").pop() ?? "document.pdf";

  return (
    <div className="rounded-2xl border overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 border-b flex-wrap">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title ?? "Document"}</p>
          <p className="text-xs text-muted-foreground truncate">{fileName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted transition-colors"
          >
            <Maximize2 className="size-3.5" /> Open in New Tab
          </a>
          <a
            href={url}
            download
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download className="size-3.5" /> Download PDF
          </a>
        </div>
      </div>

      {/* Embedded PDF */}
      <div className="bg-muted/20">
        <iframe
          src={url}
          title={fileName}
          className="w-full h-[520px] sm:h-[640px] border-0 bg-white"
        />
      </div>
    </div>
  );
}
