"use server"

import { db } from "@/db"
import { project, projectCategory, category, asset } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { desc, count, eq, inArray, or, ilike } from "drizzle-orm"
import { Asset } from "../assets/types"
import { projectContentSchema } from "@/lib/schemas/project-content"
import { ZodError } from "zod"
import { Project } from "./types"

// Helper function to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "") // Trim hyphens from start and end
}

// Validate if a slug is in the correct format
function isValidSlugFormat(slug: string): boolean {
  if (!slug || slug.trim() === "") return false
  // Must be lowercase alphanumeric with hyphens only
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

// Helper function to ensure slug is unique
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await db.select({ id: project.id }).from(project).where(eq(project.slug, slug)).limit(1)

    // If no existing project or the existing one is the one we're updating, slug is unique
    if (existing.length === 0 || (excludeId && existing[0].id === excludeId)) {
      return slug
    }

    // Otherwise, append a number and try again
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function createProject(formData: FormData) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get form data
  const title = formData.get("title") as string
  const slugInput = formData.get("slug") as string | null
  const shortDescription = formData.get("shortDescription") as string
  const longDescription = formData.get("longDescription") as string
  const url = formData.get("url") as string
  const thumbnailId = formData.get("thumbnailId") as string | null
  const tagsInput = formData.get("tags") as string
  const contentInput = formData.get("content") as string
  const categoriesInput = formData.get("categories") as string

  // Validate required fields
  if (!title || !shortDescription) {
    throw new Error("Title and short description are required")
  }

  // Parse JSON fields
  let tags = null
  if (tagsInput) {
    try {
      tags = JSON.parse(tagsInput)
    } catch (e) {
      throw new Error("Tags must be valid JSON")
    }
  }

  let content = null
  if (contentInput) {
    try {
      const parsedContent = JSON.parse(contentInput)
      // Validate with Zod schema
      const validatedContent = projectContentSchema.parse(parsedContent)
      content = validatedContent
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessages = e.issues.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
        throw new Error(`Invalid content structure: ${errorMessages}`)
      }
      throw new Error("Content must be valid JSON")
    }
  }

  let categoryIds: string[] = []
  if (categoriesInput) {
    try {
      categoryIds = JSON.parse(categoriesInput)
    } catch (e) {
      throw new Error("Categories must be valid JSON")
    }
  }

  // Handle slug: use provided slug if valid, otherwise generate from title
  let slug: string
  if (slugInput && slugInput.trim() !== "") {
    // Validate the provided slug format
    if (!isValidSlugFormat(slugInput)) {
      throw new Error("Slug must be lowercase, alphanumeric, and hyphens only (e.g., 'my-project-name')")
    }
    // Ensure it's unique
    slug = await ensureUniqueSlug(slugInput)
  } else {
    // Auto-generate from title
    const baseSlug = generateSlug(title)
    slug = await ensureUniqueSlug(baseSlug)
  }

  // Insert project
  const projectId = nanoid()
  await db.insert(project).values({
    id: projectId,
    title,
    slug,
    shortDescription,
    longDescription: longDescription || null,
    url: url || null,
    thumbnailId: thumbnailId || null,
    tags,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Insert project-category associations
  if (categoryIds.length > 0) {
    await db.insert(projectCategory).values(
      categoryIds.map((categoryId) => ({
        projectId,
        categoryId,
      })),
    )
  }

  // Revalidate frontend pages
  revalidatePath("/work")
  revalidatePath("/")

  redirect("/admin/projects")
}

export async function getProjectCount() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const [{ total }] = await db.select({ total: count() }).from(project)

  return total
}

export async function getProjects(page: number = 1, pageSize: number = 20, search?: string) {
  // Check authentication
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // })

  // if (!session) {
  //   throw new Error("Unauthorized")
  // }

  const offset = (page - 1) * pageSize

  // Build where clause for search
  const whereClause = search
    ? or(ilike(project.title, `%${search}%`), ilike(project.shortDescription, `%${search}%`))
    : undefined

  // Get total count
  const [{ total }] = await db.select({ total: count() }).from(project).where(whereClause)

  // Get paginated projects with thumbnail
  const projects = (await db
    .select({
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      thumbnailId: project.thumbnailId,
      thumbnailUrl: asset.s3Url,
      thumbnailAlt: asset.altText,
      tags: project.tags,
      content: project.content,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(asset, eq(project.thumbnailId, asset.id))
    .where(whereClause)
    .orderBy(desc(project.createdAt))
    .limit(pageSize)
    .offset(offset)) as Project[]

  // Get categories for all projects
  const projectIds = projects.map((p) => p.id)
  const categoriesData =
    projectIds.length > 0
      ? await db
          .select({
            projectId: projectCategory.projectId,
            categoryId: category.id,
            categoryName: category.name,
          })
          .from(projectCategory)
          .innerJoin(category, eq(projectCategory.categoryId, category.id))
          .where(inArray(projectCategory.projectId, projectIds))
      : []

  // Map categories to projects
  const projectsWithCategories = projects.map((p) => ({
    ...p,
    categories: categoriesData
      .filter((c) => c.projectId === p.id)
      .map((c) => ({ id: c.categoryId, name: c.categoryName })),
  })) as Project[]

  return {
    projects: projectsWithCategories,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  if (ids.length === 0) return []

  const rows = (await db
    .select({
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      thumbnailId: project.thumbnailId,
      thumbnailUrl: asset.s3Url,
      thumbnailAlt: asset.altText,
      tags: project.tags,
      content: project.content,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(asset, eq(project.thumbnailId, asset.id))
    .where(inArray(project.id, ids))) as Project[]

  const categoriesData = await db
    .select({
      projectId: projectCategory.projectId,
      categoryId: category.id,
      categoryName: category.name,
    })
    .from(projectCategory)
    .innerJoin(category, eq(projectCategory.categoryId, category.id))
    .where(inArray(projectCategory.projectId, ids))

  const byId = new Map(
    rows.map((p) => [
      p.id,
      {
        ...p,
        categories: categoriesData
          .filter((c) => c.projectId === p.id)
          .map((c) => ({ id: c.categoryId, name: c.categoryName })),
      } as Project,
    ]),
  )

  return ids.map((id) => byId.get(id)).filter((p): p is Project => p !== undefined)
}

export async function getProject(id: string) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const [projectData] = await db.select().from(project).where(eq(project.id, id))

  // Get project categories
  const projectCategories = await db
    .select({ categoryId: projectCategory.categoryId })
    .from(projectCategory)
    .where(eq(projectCategory.projectId, id))

  return {
    ...projectData,
    categoryIds: projectCategories.map((pc) => pc.categoryId),
  }
}

export async function getProjectBySlug(slug: string) {
  const [projectData] = await db.select().from(project).where(eq(project.slug, slug))

  // Get project categories
  const projectCategories = await db
    .select({ categoryId: projectCategory.categoryId })
    .from(projectCategory)
    .where(eq(projectCategory.projectId, projectData.id))

  return {
    ...projectData,
    categoryIds: projectCategories.map((pc) => pc.categoryId),
  }
}

export async function updateProject(id: string, formData: FormData) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get form data
  const title = formData.get("title") as string
  const slugInput = formData.get("slug") as string | null
  const shortDescription = formData.get("shortDescription") as string
  const longDescription = formData.get("longDescription") as string
  const url = formData.get("url") as string
  const thumbnailId = formData.get("thumbnailId") as string | null
  const tagsInput = formData.get("tags") as string
  const contentInput = formData.get("content") as string
  const categoriesInput = formData.get("categories") as string

  // Validate required fields
  if (!title || !shortDescription) {
    throw new Error("Title and short description are required")
  }

  // Parse JSON fields
  let tags = null
  if (tagsInput) {
    try {
      tags = JSON.parse(tagsInput)
    } catch (e) {
      throw new Error("Tags must be valid JSON")
    }
  }

  let content = null
  if (contentInput) {
    try {
      const parsedContent = JSON.parse(contentInput)
      // Validate with Zod schema
      const validatedContent = projectContentSchema.parse(parsedContent)
      content = validatedContent
    } catch (e) {
      if (e instanceof ZodError) {
        const errorMessages = e.issues.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
        throw new Error(`Invalid content structure: ${errorMessages}`)
      }
      throw new Error("Content must be valid JSON")
    }
  }

  let categoryIds: string[] = []
  if (categoriesInput) {
    try {
      categoryIds = JSON.parse(categoriesInput)
    } catch (e) {
      throw new Error("Categories must be valid JSON")
    }
  }

  // Get current project
  const currentProject = await db.select().from(project).where(eq(project.id, id)).limit(1)

  // Handle slug: use provided slug if valid and different, otherwise keep current
  let slug: string
  if (slugInput && slugInput.trim() !== "") {
    // Validate the provided slug format
    if (!isValidSlugFormat(slugInput)) {
      throw new Error("Slug must be lowercase, alphanumeric, and hyphens only (e.g., 'my-project-name')")
    }
    // Ensure it's unique (excluding current project)
    slug = await ensureUniqueSlug(slugInput, id)
  } else {
    // Keep existing slug or generate from title if somehow missing
    slug = currentProject[0]?.slug || (await ensureUniqueSlug(generateSlug(title), id))
  }

  // Update project
  await db
    .update(project)
    .set({
      title,
      slug,
      shortDescription,
      longDescription: longDescription || null,
      url: url || null,
      thumbnailId: thumbnailId || null,
      tags,
      content,
      updatedAt: new Date(),
    })
    .where(eq(project.id, id))

  // Update project-category associations
  // Delete existing associations
  await db.delete(projectCategory).where(eq(projectCategory.projectId, id))

  // Insert new associations
  if (categoryIds.length > 0) {
    await db.insert(projectCategory).values(
      categoryIds.map((categoryId) => ({
        projectId: id,
        categoryId,
      })),
    )
  }

  // Revalidate frontend pages
  revalidatePath(`/work/${slug}`)
  revalidatePath("/work")
  revalidatePath("/")
}

export async function deleteProject(id: string) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Delete project
  await db.delete(project).where(eq(project.id, id))

  // Revalidate frontend pages
  revalidatePath("/work")
  revalidatePath("/")

  redirect("/admin/projects")
}

export async function getImageAssets() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get all image assets (full asset data) ordered by creation date
  const assets = (await db
    .select()
    .from(asset)
    .where(eq(asset.assetType, "image"))
    .orderBy(desc(asset.createdAt))) as Asset[]

  return assets
}

export async function getMediaAssets() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get all image and video assets (full asset data) ordered by creation date
  const assets = (await db
    .select()
    .from(asset)
    .where(or(eq(asset.assetType, "image"), eq(asset.assetType, "video")))
    .orderBy(desc(asset.createdAt))) as Asset[]

  return assets
}
