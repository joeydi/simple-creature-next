"use client"

import { useEffect, useState, useActionState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile, changePassword, uploadAvatar } from "./actions"
import { getUserAvatarUrl } from "@/lib/gravatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AccountPage() {
  const { data: session, refetch } = useSession()
  const router = useRouter()

  const [name, setName] = useState(session?.user?.name || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const profileFormRef = useRef<HTMLFormElement>(null)
  const passwordFormRef = useRef<HTMLFormElement>(null)
  const lastProfileStateRef = useRef<typeof profileState>(null)

  // Server Actions state
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null)
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, null)
  const lastPasswordStateRef = useRef<typeof passwordState>(null)

  // keep user state in sync when session changes
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session?.user?.name])

  // Handle profile update success - refresh and close edit mode
  useEffect(() => {
    if (profileState && profileState !== lastProfileStateRef.current) {
      lastProfileStateRef.current = profileState

      if (profileState.success) {
        toast.success(profileState.message)
        setIsEditing(false)
        refetch()
      } else {
        toast.error(profileState.message)
      }
    }
  }, [profileState, router])

  // Handle password change success - reset form
  useEffect(() => {
    if (passwordState && passwordState !== lastPasswordStateRef.current) {
      lastPasswordStateRef.current = passwordState

      if (passwordState.success) {
        toast.success(passwordState.message)
        if (passwordState.resetForm) {
          passwordFormRef.current?.reset()
        }
      } else {
        toast.error(passwordState.message)
      }
    }
  }, [passwordState])

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
      formData.append("file", file)
      const result = await uploadAvatar(formData)

      if (result.success) {
        toast.success("Profile photo updated successfully!")
        refetch()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.")
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (!session?.user) {
    return null
  }

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const avatarUrl = getUserAvatarUrl(session.user.image, session.user.email)

  return (
    <main>
      <DashboardHeader title="Account" />
      <DashboardContent>
        <div className="flex flex-col gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
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

              <form ref={profileFormRef} action={profileAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={session.user.email}
                    disabled
                    className="cursor-not-allowed opacity-50"
                  />
                  <p className="text-sm text-muted-foreground">Email changes are not currently supported</p>
                </div>

                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input value={session.user.id} disabled className="font-mono" />
                  <p className="text-sm text-muted-foreground">Your unique user identifier</p>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button type="submit" disabled={profilePending}>
                        {profilePending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          profileFormRef.current?.reset()
                        }}
                        disabled={profilePending}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsEditing(true)
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={passwordFormRef} action={passwordAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" required minLength={8} />
                  <p className="text-sm text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} />
                </div>

                <Button type="submit" disabled={passwordPending}>
                  {passwordPending ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" disabled>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </main>
  )
}
