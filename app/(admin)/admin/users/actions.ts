"use server"

import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { desc, or, ilike, and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Get users with pagination and search
export async function getUsers(page: number = 1, pageSize: number = 20, search?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const offset = (page - 1) * pageSize

  // Build where clause for search
  const conditions = []

  if (search) {
    conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Get users
  const users = await db
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(pageSize)
    .offset(offset)

  // Get total count
  const totalResult = await db.select({ count: user.id }).from(user).where(whereClause)

  const total = totalResult.length

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// Delete user
export async function deleteUser(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Prevent users from deleting themselves
  if (session.user.id === id) {
    throw new Error("You cannot delete your own account")
  }

  await db.delete(user).where(eq(user.id, id))

  revalidatePath("/admin/users")
}
