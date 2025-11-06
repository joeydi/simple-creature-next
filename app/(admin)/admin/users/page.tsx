import { DashboardContent } from "@/components/dashboard-content"
import { DashboardHeader } from "@/components/dashboard-header"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getUsers } from "./actions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCircle } from "lucide-react"
import Image from "next/image"
import type { User } from "./types"
import { Card } from "@/components/ui/card"

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

  const renderAvatar = (user: User) => {
    if (user.image) {
      return (
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
          <Image src={user.image} alt={user.name} fill className="object-cover" sizes="48px" />
        </div>
      )
    }

    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <UserCircle className="h-6 w-6 text-muted-foreground" />
      </div>
    )
  }

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
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{renderAvatar(user)}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.emailVerified
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/users/${user.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </DashboardContent>
    </main>
  )
}
