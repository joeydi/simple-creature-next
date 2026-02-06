"use server"

import { db } from "@/db"
import { category, projectCategory } from "@/db/schema"
import { sql, eq } from "drizzle-orm"

export interface CategoryWithCount {
  id: string
  name: string
  slug: string
  projectCount: number
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const result = await db
    .select({
      id: category.id,
      name: category.name,
      slug: category.slug,
      projectCount: sql<number>`count(${projectCategory.projectId})`.mapWith(Number),
    })
    .from(category)
    .leftJoin(projectCategory, eq(category.id, projectCategory.categoryId))
    .groupBy(category.id, category.name, category.slug)
    .orderBy(category.name)

  return result.filter((c) => c.projectCount > 0)
}
