CREATE TABLE "asset" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"originalFilename" text NOT NULL,
	"mimeType" text NOT NULL,
	"fileSize" integer NOT NULL,
	"s3Key" text NOT NULL,
	"s3Bucket" text NOT NULL,
	"s3Url" text NOT NULL,
	"assetType" text NOT NULL,
	"metadata" jsonb,
	"title" text,
	"description" text,
	"altText" text,
	"tags" jsonb,
	"uploadedBy" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "asset_s3Key_unique" UNIQUE("s3Key")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name"),
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projectCategory" (
	"projectId" text NOT NULL,
	"categoryId" text NOT NULL,
	CONSTRAINT "projectCategory_projectId_categoryId_pk" PRIMARY KEY("projectId","categoryId")
);
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "longDescription" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "asset_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectCategory" ADD CONSTRAINT "projectCategory_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectCategory" ADD CONSTRAINT "projectCategory_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;