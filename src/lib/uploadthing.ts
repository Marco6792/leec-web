import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * UploadThing file router.
 *
 * Endpoints:
 *  - profileImage : avatar photos for lab members (added via /admin/lab-members)
 *  - entityImage  : cover/featured images for publications, events, news,
 *                   equipment and projects (stored in each table's image_url)
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
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
