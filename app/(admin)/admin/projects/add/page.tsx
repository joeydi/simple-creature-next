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
import { TagsInput } from "../tags-input"
import { CategorySelect } from "../category-select"
import { getCategories } from "../../categories/actions"

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
      <SiteHeader title="Add New Project">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/projects">
            <ArrowLeft />
            Back to Projects
          </Link>
        </Button>
      </SiteHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form action={createProject} className="space-y-6">
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
            <p className="text-muted-foreground text-sm">Enter structured content as JSON</p>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Create Project</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/projects">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
