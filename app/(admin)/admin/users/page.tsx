import { DashboardContent } from "@/components/dashboard-content"
import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getUsers } from "./actions"
import { UsersClient } from "./users-client"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
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

  const { users } = await getUsers(page, 20, search)

  return (
    <main>
      <DashboardHeader title="Users">
        <Button size={"sm"} asChild>
          <Link href="/admin/users/add">
            <Plus />
            Add User
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <UsersClient users={users} />
      </DashboardContent>
    </main>
  )
}
