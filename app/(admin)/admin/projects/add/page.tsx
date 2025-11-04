import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { auth } from "@/lib/auth-server"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createProject } from "../actions"

export default async function AddProjectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <SiteHeader title="Add New Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </SiteHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <form action={createProject} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Project title"
              />
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

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (JSON)</Label>
              <Textarea
                id="tags"
                name="tags"
                placeholder='["design", "web", "featured"]'
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Enter tags as a JSON array. Example: ["design", "web", "featured"]
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <Textarea
                id="content"
                name="content"
                placeholder='{"sections": [], "images": []}'
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                Enter structured content as JSON
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit">Create Project</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/projects">Cancel</Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
