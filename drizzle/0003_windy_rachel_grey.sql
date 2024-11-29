ALTER TABLE "comments" RENAME COLUMN "post" TO "postId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "author" TO "authorId";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "date" date DEFAULT now() NOT NULL;