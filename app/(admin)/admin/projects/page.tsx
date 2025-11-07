import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { Plus, ChevronLeft, ChevronRight, FileImage } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getProjects } from "./actions"
import { SearchInput } from "./search-input"
import { Card } from "@/components/ui/card"
import { DashboardContent } from "@/components/dashboard-content"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const pageSize = 20
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const search = params.search
  const { projects, total, page, totalPages } = await getProjects(currentPage, pageSize, search)

  return (
    <main>
      <DashboardHeader title="Projects">
        <Button size={"sm"} asChild>
          <Link href="/admin/projects/add">
            <Plus />
            Add Project
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <div className="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row">
          <SearchInput />
          <div className="flex w-full items-center justify-between gap-4 lg:justify-end">
            <div className="text-sm">
              Showing {(page - 1) * pageSize + 1}&ndash;{Math.min(page * pageSize, total)} of {total} projects
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} asChild={page !== 1}>
                  {page === 1 ? (
                    <>
                      <ChevronLeft />
                      Previous
                    </>
                  ) : (
                    <Link
                      href={`/admin/projects?page=${page - 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    >
                      <ChevronLeft />
                      Previous
                    </Link>
                  )}
                </Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} asChild={page !== totalPages}>
                  {page === totalPages ? (
                    <>
                      Next
                      <ChevronRight />
                    </>
                  ) : (
                    <Link
                      href={`/admin/projects?page=${page + 1}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
                    >
                      Next
                      <ChevronRight />
                    </Link>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          {projects.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-600">
                {search ? `No projects found matching "${search}"` : "No projects yet. Create your first project!"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="w-[60px]">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Short Description</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="w-[180px]">Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.thumbnailUrl ? (
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="relative block aspect-video w-24 overflow-hidden rounded bg-muted"
                        >
                          <Image
                            src={project.thumbnailUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </Link>
                      ) : (
                        <div className="flex aspect-video w-24 items-center justify-center rounded bg-muted">
                          <FileImage className="size-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{project.slug}</TableCell>
                    <TableCell className="max-w-md truncate">{project.shortDescription}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.categories && project.categories.length > 0 ? (
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
                    <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </DashboardContent>
    </main>
  )
}
