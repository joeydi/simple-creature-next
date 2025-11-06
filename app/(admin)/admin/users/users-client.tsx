"use client"

import { UserTable } from "./user-table"
import type { User } from "./types"
import { useState } from "react"
import { deleteUser } from "./actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function UsersClient({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const router = useRouter()

  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality (open modal or navigate to edit page)
    toast.info("Edit user functionality coming soon")
    console.log("Edit user:", user)
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
      return
    }

    try {
      await deleteUser(user.id)
      setUsers(users.filter((u) => u.id !== user.id))
      toast.success("User deleted successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user")
      console.error("Error deleting user:", error)
    }
  }

  return <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
}
