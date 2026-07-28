CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete', 'view', 'export', 'login', 'logout');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'approved', 'in_progress', 'completed', 'cancelled', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."compliance_status" AS ENUM('compliant', 'non_compliant', 'pending', 'not_applicable');--> statement-breakpoint
CREATE TYPE "public"."compliance_type" AS ENUM('glp', 'iso_17025', 'iso_9001', 'safety', 'environmental', 'data_protection');--> statement-breakpoint
CREATE TYPE "public"."equipment_category" AS ENUM('instrument', 'sensor', 'computer', 'network', 'mechanical', 'chemical', 'safety', 'office', 'other');--> statement-breakpoint
CREATE TYPE "public"."equipment_status" AS ENUM('operational', 'maintenance', 'repair', 'calibration', 'retired');--> statement-breakpoint
CREATE TYPE "public"."ethics_status" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."ethics_type" AS ENUM('human_studies', 'animal_welfare', 'biosafety', 'radiation', 'chemical_safety', 'data_privacy');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('seminar', 'workshop', 'conference', 'defense', 'meeting', 'social', 'other');--> statement-breakpoint
CREATE TYPE "public"."grant_status" AS ENUM('draft', 'submitted', 'active', 'completed', 'rejected', 'closed');--> statement-breakpoint
CREATE TYPE "public"."lab_role" AS ENUM('director', 'pi', 'researcher', 'phd_student', 'master_student', 'technician', 'visitor', 'external', 'client');--> statement-breakpoint
CREATE TYPE "public"."maintenance_type" AS ENUM('preventive', 'corrective', 'calibration', 'upgrade');--> statement-breakpoint
CREATE TYPE "public"."member_status" AS ENUM('active', 'inactive', 'alumni');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'sms', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('booking_confirmed', 'booking_cancelled', 'maintenance_due', 'calibration_due', 'inventory_low', 'collaboration_request', 'experiment_shared', 'publication_added', 'grant_deadline', 'system_alert', 'message');--> statement-breakpoint
CREATE TYPE "public"."partner_tier" AS ENUM('strategic', 'collaborative', 'affiliate');--> statement-breakpoint
CREATE TYPE "public"."partner_type" AS ENUM('university', 'research_institute', 'industry', 'government', 'ngo', 'funding_agency', 'startup');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'completed', 'on_hold', 'cancelled', 'proposed');--> statement-breakpoint
CREATE TYPE "public"."publication_type" AS ENUM('journal', 'conference', 'book', 'chapter', 'report', 'dataset', 'thesis', 'patent', 'software', 'preprint');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('collaboration', 'equipment_access', 'data_access', 'visiting_scholar', 'joint_grant');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" "audit_action" NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"user_id" uuid,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text
);
--> statement-breakpoint
CREATE TABLE "collaboration_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid,
	"project_id" uuid,
	"message" text NOT NULL,
	"request_type" "request_type" NOT NULL,
	"status" "request_status" DEFAULT 'pending',
	"responded_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid NOT NULL,
	"type" "compliance_type" NOT NULL,
	"standard" text NOT NULL,
	"status" "compliance_status" DEFAULT 'pending',
	"checklist" jsonb DEFAULT '[]'::jsonb,
	"findings" jsonb DEFAULT '[]'::jsonb,
	"corrective_actions" jsonb DEFAULT '[]'::jsonb,
	"audited_by" text,
	"audit_date" date,
	"next_audit_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faculty_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"hod_id" uuid,
	"website" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "equipment_category" DEFAULT 'instrument',
	"manufacturer" text,
	"model" text,
	"serial_number" text,
	"specifications" text,
	"specifications_json" jsonb DEFAULT '{}'::jsonb,
	"location" text,
	"image_url" text,
	"status" "equipment_status" DEFAULT 'operational',
	"acquired_date" date,
	"value" numeric,
	"currency" text DEFAULT 'XAF',
	"custodian_id" uuid,
	"is_public" boolean DEFAULT false,
	"available_for_testing" boolean DEFAULT false,
	"depreciation_schedule" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "equipment_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"purpose" text,
	"status" "booking_status" DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ethics_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"type" "ethics_type" NOT NULL,
	"committee" text NOT NULL,
	"reference_code" text,
	"status" "ethics_status" DEFAULT 'draft',
	"approval_date" date,
	"expiry_date" date,
	"documents" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"event_type" "event_type" DEFAULT 'other',
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"location" text,
	"is_online" boolean DEFAULT false,
	"meeting_url" text,
	"organizer_id" uuid,
	"image_url" text,
	"published" boolean DEFAULT false,
	"registration_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faculties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"dean_id" uuid,
	"website" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "faculties_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "grant_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grant_id" uuid NOT NULL,
	"period" text NOT NULL,
	"progress" text,
	"financials" jsonb DEFAULT '{}'::jsonb,
	"submitted_at" timestamp,
	"approved_at" timestamp,
	"file_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"agency" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'EUR',
	"start_date" date,
	"end_date" date,
	"status" "grant_status" DEFAULT 'draft',
	"reference_code" text,
	"reporting_schedule" jsonb DEFAULT '[]'::jsonb,
	"budget_lines" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lab_members" (
	"lab_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "lab_role" NOT NULL,
	"status" "member_status" DEFAULT 'active',
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	CONSTRAINT "lab_members_lab_id_user_id_pk" PRIMARY KEY("lab_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "maintenance_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"type" "maintenance_type" NOT NULL,
	"description" text NOT NULL,
	"technician_id" uuid,
	"date" timestamp DEFAULT now() NOT NULL,
	"cost" numeric,
	"parts_used" jsonb DEFAULT '[]'::jsonb,
	"next_due_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"content" text,
	"author_id" uuid,
	"image_url" text,
	"published" boolean DEFAULT false,
	"published_at" timestamp,
	"pinned" boolean DEFAULT false,
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"email_enabled" boolean DEFAULT true,
	"sms_enabled" boolean DEFAULT false,
	"push_enabled" boolean DEFAULT false,
	"in_app_enabled" boolean DEFAULT true,
	"digest_frequency" text DEFAULT 'instant',
	"quiet_hours_start" text,
	"quiet_hours_end" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"link" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo_url" text,
	"website" text,
	"partner_type" "partner_type" NOT NULL,
	"tier" "partner_tier" DEFAULT 'affiliate',
	"country" text,
	"description" text,
	"partnership_start" date,
	"partnership_end" date,
	"contact_name" text,
	"contact_email" text,
	"featured" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partners_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"avatar_url" text,
	"institution" text,
	"department" text,
	"title" text,
	"biography" text,
	"research_interests" text[] DEFAULT '{}',
	"orcid" text,
	"google_scholar" text,
	"research_gate" text,
	"linked_in" text,
	"website" text,
	"phone" text,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'active',
	"pi_id" uuid,
	"start_date" date,
	"end_date" date,
	"funding_source" text,
	"funding_amount" numeric,
	"currency" text DEFAULT 'XAF',
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"deliverables" jsonb DEFAULT '[]'::jsonb,
	"partners" jsonb DEFAULT '[]'::jsonb,
	"researcher_ids" uuid[] DEFAULT '{}',
	"research_domains" text[] DEFAULT '{}',
	"outputs" jsonb DEFAULT '[]'::jsonb,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "publication_authors" (
	"publication_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"author_order" integer NOT NULL,
	"corresponding" boolean DEFAULT false,
	"affiliation" text,
	CONSTRAINT "publication_authors_publication_id_profile_id_pk" PRIMARY KEY("publication_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "publication_type" NOT NULL,
	"title" text NOT NULL,
	"abstract" text,
	"year" integer NOT NULL,
	"doi" text,
	"journal" text,
	"conference" text,
	"publisher" text,
	"volume" text,
	"issue" text,
	"pages" text,
	"isbn" text,
	"issn" text,
	"patent_number" text,
	"repository" text,
	"citation_count" integer DEFAULT 0,
	"altmetric_score" integer DEFAULT 0,
	"pdf_url" text,
	"source_data_url" text,
	"code_url" text,
	"keywords" text[] DEFAULT '{}',
	"research_domains" text[] DEFAULT '{}',
	"language" text DEFAULT 'en',
	"license" text,
	"open_access" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "publications_doi_unique" UNIQUE("doi")
);
--> statement-breakpoint
CREATE TABLE "research_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"acronym" text NOT NULL,
	"description" text,
	"director_id" uuid,
	"website" text,
	"email" text,
	"address" text,
	"logo_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "research_centers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "research_domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lab_id" uuid,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"lead_researcher_id" uuid,
	"featured_image_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "research_domains_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD CONSTRAINT "collaboration_requests_from_user_id_profiles_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_requests" ADD CONSTRAINT "collaboration_requests_to_user_id_profiles_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_hod_id_profiles_id_fk" FOREIGN KEY ("hod_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_custodian_id_profiles_id_fk" FOREIGN KEY ("custodian_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_bookings" ADD CONSTRAINT "equipment_bookings_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_bookings" ADD CONSTRAINT "equipment_bookings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ethics_approvals" ADD CONSTRAINT "ethics_approvals_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_profiles_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_dean_id_profiles_id_fk" FOREIGN KEY ("dean_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grant_reports" ADD CONSTRAINT "grant_reports_grant_id_grants_id_fk" FOREIGN KEY ("grant_id") REFERENCES "public"."grants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grants" ADD CONSTRAINT "grants_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_members" ADD CONSTRAINT "lab_members_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lab_members" ADD CONSTRAINT "lab_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_logs" ADD CONSTRAINT "maintenance_logs_technician_id_profiles_id_fk" FOREIGN KEY ("technician_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_pi_id_profiles_id_fk" FOREIGN KEY ("pi_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_centers" ADD CONSTRAINT "research_centers_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_centers" ADD CONSTRAINT "research_centers_director_id_profiles_id_fk" FOREIGN KEY ("director_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_domains" ADD CONSTRAINT "research_domains_lab_id_research_centers_id_fk" FOREIGN KEY ("lab_id") REFERENCES "public"."research_centers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_domains" ADD CONSTRAINT "research_domains_lead_researcher_id_profiles_id_fk" FOREIGN KEY ("lead_researcher_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;