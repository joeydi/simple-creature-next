import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { Plus } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getProjects } from "./actions"
import { SearchInput } from "./search-input"
import { SortableProjectsTable } from "./sortable-projects-table"
import { Card } from "@/components/ui/card"
import { DashboardContent } from "@/components/dashboard-content"

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const search = params.search
  // Load every project on one page (~20-30 max) so the list is fully draggable
  const { projects, total } = await getProjects(1, 1000, search)

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
          <div className="text-sm">
            {total} {total === 1 ? "project" : "projects"}
            {search ? " found" : ""}
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
            <SortableProjectsTable projects={projects} sortable={!search} />
          )}
        </Card>
      </DashboardContent>
    </main>
  )
}
