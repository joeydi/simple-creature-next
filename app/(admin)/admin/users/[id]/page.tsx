"use client"

import { useEffect, useState, useActionState, useRef, startTransition } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateUser, uploadUserAvatar, getUser } from "../actions"
import { getUserAvatarUrl } from "@/lib/gravatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"
import { Loader2, ChevronLeft } from "lucide-react"
import { toast } from "sonner"
import type { User } from "../types"
import Link from "next/link"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const lastStateRef = useRef<typeof state>(null)

  // Server Action state
  const [state, formAction, pending] = useActionState(updateUser, null)

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser(userId)
        setUser(userData)
        setName(userData.name)
        setEmail(userData.email)
        setAvatarUrl(userData.image)
      } catch (error) {
        toast.error("Failed to load user")
        router.push("/admin/users")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [userId, router])

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

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (2MB)
    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      toast.error("Image must be less than 2MB")
      return
    }

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append("id", userId)
      formData.append("file", file)
      const result = await uploadUserAvatar(formData)

      if (result.success && result.imageUrl) {
        toast.success("Avatar uploaded successfully!")
        setAvatarUrl(result.imageUrl)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to upload avatar. Please try again.")
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (isLoading) {
    return (
      <main>
        <DashboardHeader title="Edit User">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ChevronLeft />
              Back
            </Link>
          </Button>
        </DashboardHeader>
        <DashboardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DashboardContent>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const displayAvatarUrl = getUserAvatarUrl(avatarUrl, email)

  return (
    <main>
      <DashboardHeader title="Edit User">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/users">
            <ChevronLeft />
            Back
          </Link>
        </Button>
      </DashboardHeader>
      <DashboardContent>
        <div className="flex flex-col gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update user account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={displayAvatarUrl} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={isUploadingAvatar}
                  />
                  <Button variant="outline" size="sm" asChild disabled={isUploadingAvatar}>
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Change Photo"
                      )}
                    </label>
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <Separator />

              <form ref={formRef} action={formAction} className="space-y-4">
                <input type="hidden" name="id" value={userId} />
                <input type="hidden" name="image" value={avatarUrl || ""} />

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={email} disabled required />
                </div>

                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input value={userId} disabled className="font-mono" />
                  <p className="text-sm text-muted-foreground">The unique user identifier</p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving..." : "Save Changes"}
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
