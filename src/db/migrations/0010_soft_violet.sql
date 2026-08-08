CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_address" text,
	"contact_email" text,
	"contact_phone" text,
	"collaboration_text" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

INSERT INTO "settings" ("contact_address", "contact_email", "contact_phone", "collaboration_text")
VALUES (
  'Faculty of Engineering and Technology
University of Buea
P.O. Box 63, Buea, Cameroon',
  'leec01.ub@gmail.com',
  '+237 235 656 456',
  'We welcome collaboration proposals, visiting researchers, and student exchange requests from institutions around the world.'
);
