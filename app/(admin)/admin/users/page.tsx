import { DashboardContent } from "@/components/dashboard-content"
import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function UsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <main>
      <DashboardHeader title="Users" />
      <DashboardContent>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">User management coming soon...</p>
        </div>
      </DashboardContent>
    </main>
  )
}
