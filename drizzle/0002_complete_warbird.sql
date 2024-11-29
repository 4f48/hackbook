CREATE TABLE IF NOT EXISTS "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post" uuid NOT NULL,
	"author" uuid NOT NULL,
	"content" text NOT NULL
);
