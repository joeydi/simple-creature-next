import { SiteHeader } from "@/components/site-header"
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AssetsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <SiteHeader title="Assets" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">Asset management coming soon...</p>
        </div>
      </div>
    </main>
  )
}
