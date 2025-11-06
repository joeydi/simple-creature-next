import { DashboardContent } from "@/components/dashboard-content"
import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function NewsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <DashboardHeader title="News" />
      <DashboardContent>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">News management coming soon...</p>
        </div>
      </DashboardContent>
    </main>
  )
}
