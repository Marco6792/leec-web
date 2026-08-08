ALTER TABLE "research_domains" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "research_domains" ALTER COLUMN "tags" SET DEFAULT '{}';