import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, Images, Newspaper, PencilRuler, Users } from "lucide-react"
import { getProjectCount, getProjects } from "./projects/actions"
import Image from "next/image"
import { format } from "timeago.js"
import { getAssetCount, getAssets } from "./assets/actions"
import Link from "next/link"
import { getUserCount } from "./users/actions"

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const projectCount = getProjectCount()
  const assetCount = getAssetCount()
  const userCount = getUserCount()

  const { projects } = await getProjects(1, 10)
  const { assets } = await getAssets(1, 10)

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <DashboardContent>
        <div className="mb-6 flex rounded-md border border-muted bg-muted/40">
          <div className="w-[25%] border-r border-muted p-6">
            <div className="mb-2 flex items-center gap-2">
              <PencilRuler className="size-4 text-slate-400" />
              <span className="font-semibold">Projects</span>
            </div>
            <span className="block text-4xl font-semibold">{projectCount}</span>
          </div>
          <div className="w-[25%] border-r border-muted p-6">
            <div className="mb-2 flex items-center gap-2">
              <Newspaper className="size-4 text-slate-400" />
              <span className="font-semibold">Posts</span>
            </div>
            <span className="block text-4xl font-semibold">20</span>
          </div>
          <div className="w-[25%] border-r border-muted p-6">
            <div className="mb-2 flex items-center gap-2">
              <Images className="size-4 text-slate-400" />
              <span className="font-semibold">Assets</span>
            </div>
            <span className="block text-4xl font-semibold">{assetCount}</span>
          </div>
          <div className="w-[25%] p-6">
            <div className="mb-2 flex items-center gap-2">
              <Users className="size-4 text-slate-400" />
              <span className="font-semibold">Users</span>
            </div>
            <span className="block text-4xl font-semibold">{userCount}</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <Card className="w-[50%] p-0 pt-6">
            <CardHeader>
              <CardTitle>Recently Updated Projects</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  className="flex items-center gap-4 border-t px-6 py-3 transition hover:bg-muted/50"
                  href={`/admin/projects/${project.id}`}
                >
                  {project.thumbnailUrl ? (
                    <div className="relative aspect-video w-24 overflow-hidden rounded bg-muted">
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-20 items-center justify-center rounded bg-muted">
                      <FileImage className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="grow">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-sm text-slate-500">{`Updated ${format(project.updatedAt)}`}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card className="w-[50%] p-0 pt-6">
            <CardHeader>
              <CardTitle>Recently Uploaded Assets</CardTitle>
              <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 border-t px-6 py-3">
                  {asset.s3Url ? (
                    <div className="relative aspect-video w-24 overflow-hidden rounded bg-muted">
                      <Image src={asset.s3Url} alt={asset.altText || ""} fill className="object-cover" sizes="96px" />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-20 items-center justify-center rounded bg-muted">
                      <FileImage className="size-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="grow">
                    <p className="font-semibold">{asset.title || asset.filename}</p>
                    <p className="text-sm text-slate-500">{`Uploaded ${format(asset.createdAt)}`}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </>
  )
}
