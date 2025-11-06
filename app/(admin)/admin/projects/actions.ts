"use server"

import { db } from "@/db"
import { project, projectCategory, category, asset } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"
import { desc, count, eq, inArray, or, ilike } from "drizzle-orm"

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
  const shortDescription = formData.get("shortDescription") as string
  const longDescription = formData.get("longDescription") as string
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
      content = JSON.parse(contentInput)
    } catch (e) {
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

  // Insert project
  const projectId = nanoid()
  await db.insert(project).values({
    id: projectId,
    title,
    shortDescription,
    longDescription: longDescription || null,
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
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const offset = (page - 1) * pageSize

  // Build where clause for search
  const whereClause = search
    ? or(ilike(project.title, `%${search}%`), ilike(project.shortDescription, `%${search}%`))
    : undefined

  // Get total count
  const [{ total }] = await db.select({ total: count() }).from(project).where(whereClause)

  // Get paginated projects with thumbnail
  const projects = await db
    .select({
      id: project.id,
      title: project.title,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      thumbnailId: project.thumbnailId,
      thumbnailUrl: asset.s3Url,
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
    .offset(offset)

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
  }))

  return {
    projects: projectsWithCategories,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
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
  const shortDescription = formData.get("shortDescription") as string
  const longDescription = formData.get("longDescription") as string
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
      content = JSON.parse(contentInput)
    } catch (e) {
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

  // Update project
  await db
    .update(project)
    .set({
      title,
      shortDescription,
      longDescription: longDescription || null,
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

  redirect("/admin/projects")
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

  // Get all image assets ordered by creation date
  const assets = await db
    .select({
      id: asset.id,
      filename: asset.filename,
      title: asset.title,
      s3Url: asset.s3Url,
      fileSize: asset.fileSize,
      createdAt: asset.createdAt,
    })
    .from(asset)
    .where(eq(asset.assetType, "image"))
    .orderBy(desc(asset.createdAt))

  return assets
}
