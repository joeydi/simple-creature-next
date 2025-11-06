"use client"

import { UserTable } from "./user-table"
import type { User } from "./types"
import { useRouter } from "next/navigation"

export function UsersClient({ users }: { users: User[] }) {
  const router = useRouter()

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}`)
  }

  return <UserTable users={users} onEdit={handleEdit} />
}
