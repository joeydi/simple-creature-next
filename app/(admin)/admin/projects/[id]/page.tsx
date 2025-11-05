import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth-server"
import { ArrowLeft, Calendar } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect, notFound } from "next/navigation"
import { getProject, updateProject } from "../actions"
import { DeleteProjectButton } from "./delete-project-button"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { getCategories } from "../../categories/actions"

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
      <SiteHeader title="Edit Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </SiteHeader>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Main Form */}
          <div className="flex-1">
            <Card className="p-6">
              <form id="edit-form" action={updateProjectWithId}>
                <div className="space-y-6">
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

                  <TagsInput defaultValue={project.tags as [string, string][] | undefined} />

                  <CategorySelect categories={categories} defaultSelectedIds={project.categoryIds} />

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (JSON)</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={project.content ? JSON.stringify(project.content, null, 2) : ""}
                      placeholder='{"sections": [], "images": []}'
                      rows={8}
                    />
                    <p className="text-sm text-muted-foreground">Enter structured content as JSON</p>
                  </div>
                </div>
              </form>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="w-80">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button type="submit" form="edit-form" className="w-full">
                    Update Project
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Created
                    </div>
                    <div className="font-medium">
                      {new Date(project.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </div>
                    <div className="font-medium">
                      {new Date(project.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(project.updatedAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="grow" asChild>
                    <Link href="/admin/projects">Cancel</Link>
                  </Button>
                  <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
