CREATE TYPE "public"."agreement_type" AS ENUM('mou', 'contract_research', 'consulting', 'sponsored_research', 'nda', 'material_transfer');--> statement-breakpoint
CREATE TYPE "public"."assessment_type" AS ENUM('quiz', 'practical', 'project', 'certification');--> statement-breakpoint
CREATE TYPE "public"."collaboration_project_status" AS ENUM('negotiation', 'active', 'completed', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'approved', 'rejected', 'completed', 'dropped');--> statement-breakpoint
CREATE TYPE "public"."ip_status" AS ENUM('draft', 'filed', 'granted', 'licensed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."ip_type" AS ENUM('patent', 'copyright', 'know_how', 'trademark', 'design');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('pending', 'in_progress', 'completed', 'delayed');--> statement-breakpoint
CREATE TYPE "public"."training_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."training_session_status" AS ENUM('draft', 'pending_approval', 'open', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."request_type" ADD VALUE 'contract_research';--> statement-breakpoint
ALTER TYPE "public"."request_type" ADD VALUE 'consulting';--> statement-breakpoint
CREATE TABLE "collaboration_ip_disclosures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "ip_type" NOT NULL,
	"filing_status" "ip_status" DEFAULT 'draft',
	"filing_date" date,
	"grant_date" date,
	"patent_number" text,
	"inventors" uuid[] DEFAULT '{}',
	"licensee" text,
	"revenue_share" text,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaboration_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"due_date" date,
	"completed_date" date,
	"status" "milestone_status" DEFAULT 'pending',
	"deliverables" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaboration_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"lab_id" uuid NOT NULL,
	"partner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"scope" text,
	"agreement_type" "agreement_type",
	"agreement_document_url" text,
	"status" "collaboration_project_status" DEFAULT 'negotiation',
	"start_date" date,
	"end_date" date,
	"funding_amount" numeric,
	"currency" text DEFAULT 'XAF',
	"pi_id" uuid,
	"partner_contact_name" text,
	"partner_contact_email" text,
	"researcher_ids" uuid[] DEFAULT '{}',
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"ip_disclosures" jsonb DEFAULT '[]'::jsonb,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collaboration_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "training_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "assessment_type" DEFAULT 'quiz',
	"max_score" integer,
	"passing_score" integer,
	"due_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "enrollment_status" DEFAULT 'pending',
	"invited_by" uuid,
	"eligibility_notes" text,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "training_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"score" integer,
	"passed" boolean,
	"submitted_at" timestamp,
	"graded_at" timestamp,
	"grader_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"level" "training_level" DEFAULT 'beginner',
	"prerequisites" jsonb DEFAULT '[]'::jsonb,
	"linked_equipment_ids" uuid[] DEFAULT '{}',
	"curriculum" jsonb DEFAULT '[]'::jsonb,
	"max_participants" integer,
	"start_date" date,
	"end_date" date,
	"schedule" jsonb DEFAULT '[]'::jsonb,
	"status" "training_session_status" DEFAULT 'draft',
	"published" boolean DEFAULT false,
	"published_at" timestamp,
	"image_url" text,
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "training_sessions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "publications" ALTER COLUMN "publisher" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "publications" ALTER COLUMN "publisher" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "partner_id" uuid;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "organization_name" text;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "collaboration_type" text;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "intended_use" text;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "expected_timeline" text;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "estimated_budget" text;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "ip_terms_agreed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "nda_required" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD COLUMN "nda_signed_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "researcher_type" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "organization" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "speciality" text;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "collaboration_ip_disclosures" ADD CONSTRAINT "collaboration_ip_disclosures_project_id_collaboration_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."collaboration_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_milestones" ADD CONSTRAINT "collaboration_milestones_project_id_collaboration_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."collaboration_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_projects" ADD CONSTRAINT "collaboration_projects_request_id_collaboration_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."collaboration_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_projects" ADD CONSTRAINT "collaboration_projects_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_projects" ADD CONSTRAINT "collaboration_projects_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_projects" ADD CONSTRAINT "collaboration_projects_pi_id_profiles_id_fk" FOREIGN KEY ("pi_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_assessments" ADD CONSTRAINT "training_assessments_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_enrollments" ADD CONSTRAINT "training_enrollments_session_id_training_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_enrollments" ADD CONSTRAINT "training_enrollments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_enrollments" ADD CONSTRAINT "training_enrollments_invited_by_profiles_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_assessment_id_training_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."training_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_results" ADD CONSTRAINT "training_results_grader_id_profiles_id_fk" FOREIGN KEY ("grader_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_creator_id_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD CONSTRAINT "collaboration_requests_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;