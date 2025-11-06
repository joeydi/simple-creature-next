import { DashboardHeader } from "@/components/dashboard-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getCategories } from "./actions"
import { CategoryModal } from "./category-modal"
import { DeleteCategoryButton } from "./delete-category-button"
import { DashboardContent } from "@/components/dashboard-content"

export default async function CategoriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <main>
      <DashboardHeader title="Categories">
        <CategoryModal mode="create" />
      </DashboardHeader>
      <DashboardContent>
        <div className="rounded-lg bg-white shadow">
          {categories.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-600">No categories yet. Create your first category!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="max-w-md truncate">{category.description || "—"}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <CategoryModal mode="edit" category={category} />
                        <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DashboardContent>
    </main>
  )
}
