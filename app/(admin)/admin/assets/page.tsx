import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAssets, type AssetType } from "./actions"
import { AssetsClient } from "./assets-client"
import { UploadModal } from "./upload-modal"
import { DashboardContent } from "@/components/dashboard-content"

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
      <DashboardHeader title="Assets">
        <UploadModal />
      </DashboardHeader>
      <DashboardContent>
        <AssetsClient assets={assets} currentPage={page} totalPages={totalPages} total={total} />
      </DashboardContent>
    </main>
  )
}
