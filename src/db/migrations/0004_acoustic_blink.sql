ALTER TABLE "equipment" ADD COLUMN "usage" text;--> statement-breakpoint
ALTER TABLE "equipment" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "image_url" text;