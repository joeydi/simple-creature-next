import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getCategories } from "../../categories/actions"
import { DashboardContent } from "@/components/dashboard-content"
import { AddProjectForm } from "./add-project-form"

export default async function AddProjectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const categories = await getCategories()

  return (
    <main>
      <DashboardHeader title="Add New Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <AddProjectForm categories={categories} />
      </DashboardContent>
    </main>
  )
}
