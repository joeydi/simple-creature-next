-- Add slug column as nullable first
ALTER TABLE "project" ADD COLUMN "slug" text;--> statement-breakpoint

-- Generate slugs for existing projects based on their titles
UPDATE "project" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("title", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) WHERE "slug" IS NULL;--> statement-breakpoint

-- Handle potential duplicates by appending the first 8 chars of id
UPDATE "project" AS p1
SET "slug" = p1."slug" || '-' || SUBSTRING(p1."id", 1, 8)
WHERE EXISTS (
  SELECT 1 FROM "project" AS p2
  WHERE p2."slug" = p1."slug" AND p2."id" < p1."id"
);--> statement-breakpoint

-- Now make it NOT NULL and add unique constraint
ALTER TABLE "project" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_slug_unique" UNIQUE("slug");