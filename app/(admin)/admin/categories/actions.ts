"use server"

import { db } from "@/db"
import { category } from "@/db/schema"
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export async function getCategories() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  return await db.select().from(category).orderBy(category.name)
}

export async function createCategory(formData: FormData) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    throw new Error("Category name is required")
  }

  const slug = slugify(name)

  await db.insert(category).values({
    id: nanoid(),
    name,
    slug,
    description: description || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  revalidatePath("/admin/categories")
}

export async function getCategory(id: string) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const [categoryData] = await db
    .select()
    .from(category)
    .where(eq(category.id, id))

  return categoryData
}

export async function updateCategory(id: string, formData: FormData) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) {
    throw new Error("Category name is required")
  }

  const slug = slugify(name)

  await db
    .update(category)
    .set({
      name,
      slug,
      description: description || null,
      updatedAt: new Date(),
    })
    .where(eq(category.id, id))

  revalidatePath("/admin/categories")
}

export async function deleteCategory(id: string) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Delete category (cascade will remove projectCategory associations)
  await db.delete(category).where(eq(category.id, id))

  redirect("/admin/categories")
}
