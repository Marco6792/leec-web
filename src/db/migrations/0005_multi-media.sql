ALTER TABLE "events" ADD COLUMN "gallery" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "documents" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "gallery" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "news" ADD COLUMN "documents" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "gallery" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "documents" jsonb DEFAULT '[]'::jsonb;