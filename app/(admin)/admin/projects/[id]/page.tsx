import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { auth } from "@/lib/auth-server"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { getProject, updateProject } from "../actions"
import { DeleteProjectButton } from "./delete-project-button"

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

  const updateProjectWithId = updateProject.bind(null, id)

  return (
    <main>
      <SiteHeader title="Edit Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </SiteHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <form action={updateProjectWithId} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={project.title}
                placeholder="Project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                name="shortDescription"
                required
                defaultValue={project.shortDescription}
                placeholder="A brief description of the project"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                defaultValue={project.longDescription || ""}
                placeholder="Detailed description of the project"
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (JSON)</Label>
              <Textarea
                id="tags"
                name="tags"
                defaultValue={project.tags ? JSON.stringify(project.tags, null, 2) : ""}
                placeholder='["design", "web", "featured"]'
                rows={3}
              />
              <p className="text-muted-foreground text-sm">
                Enter tags as a JSON array. Example: ["design", "web", "featured"]
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={project.content ? JSON.stringify(project.content, null, 2) : ""}
                placeholder='{"sections": [], "images": []}'
                rows={8}
              />
              <p className="text-muted-foreground text-sm">Enter structured content as JSON</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button type="submit">Update Project</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/projects">Cancel</Link>
                </Button>
              </div>
              <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
