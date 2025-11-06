"use client"

import { useEffect, useState, useActionState, useRef, startTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser } from "../actions"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AddUserPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const lastStateRef = useRef<typeof state>(null)

  // Server Action state
  const [state, formAction, pending] = useActionState(createUser, null)

  // Handle form submission success
  useEffect(() => {
    if (state && state !== lastStateRef.current) {
      lastStateRef.current = state

      if (state.success) {
        toast.success(state.message)

        startTransition(() => {
          router.push("/admin/users")
        })
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router])

  return (
    <main>
      <DashboardHeader title="Add User">
        <Button size={"sm"} variant={"outline"} asChild>
          <Link href="/admin/users">
            <ArrowLeft />
            Back to Users
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <div className="flex flex-col gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Create a new user account. A secure password will be generated automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form ref={formRef} action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Creating..." : "Create User"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/users")}
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </main>
  )
}
