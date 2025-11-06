import { db } from "@/db"
import { project } from "@/db/schema"
import { sql } from "drizzle-orm"

async function addProjectSlugs() {
  console.log("Adding slug column to projects...")

  try {
    // Add slug column as nullable first
    await db.execute(sql`ALTER TABLE "project" ADD COLUMN IF NOT EXISTS "slug" text`)
    console.log("✓ Added slug column")

    // Generate slugs for existing projects based on their titles
    await db.execute(
      sql`UPDATE "project" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("title", '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g')) WHERE "slug" IS NULL`,
    )
    console.log("✓ Generated slugs from titles")

    // Handle potential duplicates by appending the first 8 chars of id
    await db.execute(sql`
      UPDATE "project" AS p1
      SET "slug" = p1."slug" || '-' || SUBSTRING(p1."id", 1, 8)
      WHERE EXISTS (
        SELECT 1 FROM "project" AS p2
        WHERE p2."slug" = p1."slug" AND p2."id" < p1."id"
      )
    `)
    console.log("✓ Resolved duplicate slugs")

    // Now make it NOT NULL
    await db.execute(sql`ALTER TABLE "project" ALTER COLUMN "slug" SET NOT NULL`)
    console.log("✓ Set slug as NOT NULL")

    // Add unique constraint (check if it exists first)
    try {
      await db.execute(sql`ALTER TABLE "project" ADD CONSTRAINT "project_slug_unique" UNIQUE("slug")`)
      console.log("✓ Added unique constraint")
    } catch (error: any) {
      if (error.cause?.code === "42P07") {
        console.log("✓ Unique constraint already exists")
      } else {
        throw error
      }
    }

    // Show the results
    const projects = await db.select({ id: project.id, title: project.title, slug: project.slug }).from(project)
    console.log("\nProject slugs:")
    projects.forEach((p) => {
      console.log(`  ${p.title} → ${p.slug}`)
    })

    console.log("\n✅ Migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

addProjectSlugs()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
