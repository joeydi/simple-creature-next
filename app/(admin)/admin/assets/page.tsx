import { SiteHeader } from "@/components/site-header"
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAssets, type AssetType } from "./actions"
import { AssetsClient } from "./assets-client"
import { UploadDropzone } from "./upload-dropzone"

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const page = parseInt(params.page || "1", 10)
  const search = params.search
  const typeFilter = params.type as AssetType | undefined

  const { assets, total, totalPages } = await getAssets(page, 20, search, typeFilter)

  return (
    <main>
      <SiteHeader title="Assets" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <UploadDropzone />
          <AssetsClient assets={assets} currentPage={page} totalPages={totalPages} total={total} />
        </div>
      </div>
    </main>
  )
}
