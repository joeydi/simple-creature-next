import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createProject } from "../actions"
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { getCategories } from "../../categories/actions"
import { DashboardContent } from "@/components/dashboard-content"

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
        <div className="flex gap-6">
          {/* Main Form */}
          <div className="flex-1">
            <Card className="p-6">
              <form id="add-form" action={createProject}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" name="title" type="text" required placeholder="Project title" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Textarea
                      id="shortDescription"
                      name="shortDescription"
                      required
                      placeholder="A brief description of the project"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">Long Description</Label>
                    <Textarea
                      id="longDescription"
                      name="longDescription"
                      placeholder="Detailed description of the project"
                      rows={8}
                    />
                  </div>

                  <TagsInput />

                  <CategorySelect categories={categories} />

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (JSON)</Label>
                    <Textarea id="content" name="content" placeholder='{"sections": [], "images": []}' rows={8} />
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
                  <Button type="submit" form="add-form" className="w-full">
                    Create Project
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>Fill out the form to create a new project. All fields except long description are required.</p>
                  <p>Tags and categories can be added to help organize and categorize your project.</p>
                </div>

                <Separator />

                <Button type="button" variant="outline" className="w-full" asChild>
                  <Link href="/admin/projects">Cancel</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardContent>
    </main>
  )
}
