import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth-server"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getProjects } from "./actions"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const { projects, total, page, totalPages } = await getProjects(currentPage, 20)

  return (
    <main>
      <SiteHeader title="Projects">
        <Button size={"sm"} asChild>
          <Link href="/admin/projects/add">
            <Plus />
            Add New Project
          </Link>
        </Button>
      </SiteHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white shadow">
          {projects.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-600">No projects yet. Create your first project!</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Short Description</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="w-[180px]">Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {project.shortDescription}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.categories.length > 0 ? (
                            project.categories.map((category) => (
                              <Badge key={category.id} variant="secondary">
                                {category.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t px-6 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} projects
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      asChild={page !== 1}
                    >
                      {page === 1 ? (
                        <span>
                          <ChevronLeft />
                          Previous
                        </span>
                      ) : (
                        <Link href={`/admin/projects?page=${page - 1}`}>
                          <ChevronLeft />
                          Previous
                        </Link>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages}
                      asChild={page !== totalPages}
                    >
                      {page === totalPages ? (
                        <span>
                          Next
                          <ChevronRight />
                        </span>
                      ) : (
                        <Link href={`/admin/projects?page=${page + 1}`}>
                          Next
                          <ChevronRight />
                        </Link>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
