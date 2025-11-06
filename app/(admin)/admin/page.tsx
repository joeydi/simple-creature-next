import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <DashboardHeader title="Dashboard" />
      <DashboardContent>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">Dashboard coming soon...</p>
        </div>
      </DashboardContent>
    </main>
  )
}
