"use server"

import { db } from "@/db"
import { project } from "@/db/schema"
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"
import { desc, count, eq } from "drizzle-orm"

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
  const tagsInput = formData.get("tags") as string
  const contentInput = formData.get("content") as string

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

  // Insert project
  await db.insert(project).values({
    id: nanoid(),
    title,
    shortDescription,
    longDescription: longDescription || null,
    tags,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  redirect("/admin/projects")
}

export async function getProjects(page: number = 1, pageSize: number = 20) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const offset = (page - 1) * pageSize

  // Get total count
  const [{ total }] = await db
    .select({ total: count() })
    .from(project)

  // Get paginated projects
  const projects = await db
    .select()
    .from(project)
    .orderBy(desc(project.createdAt))
    .limit(pageSize)
    .offset(offset)

  return {
    projects,
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

  const [projectData] = await db
    .select()
    .from(project)
    .where(eq(project.id, id))

  return projectData
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
  const tagsInput = formData.get("tags") as string
  const contentInput = formData.get("content") as string

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

  // Update project
  await db
    .update(project)
    .set({
      title,
      shortDescription,
      longDescription: longDescription || null,
      tags,
      content,
      updatedAt: new Date(),
    })
    .where(eq(project.id, id))

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
