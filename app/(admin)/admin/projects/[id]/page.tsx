import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { getProject, updateProject } from "../actions"
import { getCategories } from "../../categories/actions"
import { DashboardContent } from "@/components/dashboard-content"
import { EditProjectForm } from "./edit-project-form"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  const categories = await getCategories()
  const updateProjectWithId = updateProject.bind(null, id)

  return (
    <main>
      <DashboardHeader title="Edit Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <EditProjectForm project={project} categories={categories} updateProjectAction={updateProjectWithId} />
      </DashboardContent>
    </main>
  )
}
