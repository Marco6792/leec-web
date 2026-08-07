import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * UploadThing file router.
 *
 * Endpoints:
 *  - profileImage : avatar photos for lab members (added via /admin/lab-members)
 *  - entityImage  : cover/featured images for publications, events, news,
 *                   equipment and projects (stored in each table's image_url)
 *  - pdf          : PDF documents (datasheets, papers, brochures) stored in
 *                   each table's pdf_url column
 *  - dataFile     : source data / supplementary files (CSV, Excel, ZIP, DOCX)
 *                   stored in a URL column (e.g. publications.source_data_url)
 *  - gallery      : multiple images for news/events/publications (jsonb gallery)
 *  - documents    : multiple PDFs/docs for news/events/publications (jsonb documents)
 */
export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),

  entityImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),

  pdf: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),

  dataFile: f({ blob: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),

  gallery: f({ image: { maxFileSize: "8MB", maxFileCount: 12 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),

  documents: f({ blob: { maxFileSize: "32MB", maxFileCount: 12 } })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(({ file }) => ({ url: file.url })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
