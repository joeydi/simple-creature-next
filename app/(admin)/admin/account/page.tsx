"use client"

import { useEffect, useState, useActionState, useRef, startTransition } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile, changePassword } from "./actions"
// import { getUserAvatarUrl } from "@/lib/gravatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardContent } from "@/components/dashboard-content"

export default function AccountPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const profileFormRef = useRef<HTMLFormElement>(null)
  const passwordFormRef = useRef<HTMLFormElement>(null)
  const lastProfileStateRef = useRef<typeof profileState>(null)

  // Server Actions state
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, null)
  const [passwordState, passwordAction, passwordPending] = useActionState(changePassword, null)

  // Handle profile update success - refresh and close edit mode
  useEffect(() => {
    if (profileState?.success && profileState !== lastProfileStateRef.current) {
      lastProfileStateRef.current = profileState
      startTransition(() => {
        if (isEditing) {
          setIsEditing(false)
        }
        router.refresh() // Refresh to get updated session data
      })
    }
  }, [profileState, isEditing, router])

  // Handle password change success - reset form
  useEffect(() => {
    if (passwordState?.success && passwordState?.resetForm) {
      passwordFormRef.current?.reset()
    }
  }, [passwordState])

  if (!session?.user) {
    return null
  }

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  // const avatarUrl = getUserAvatarUrl(session.user.image, session.user.email)
  const avatarUrl = null

  // Combined message from both actions
  const message = profileState?.message || passwordState?.message
  const messageType = profileState?.success || passwordState?.success ? "success" : "error"

  return (
    <main>
      <DashboardHeader title="Account" />
      <DashboardContent>
        <div className="flex flex-col gap-4 md:gap-6">
          {message && (
            <div
              className={`rounded-md p-4 ${
                messageType === "success"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {message}
            </div>
          )}

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
                  <Button variant="outline" size="sm" disabled>
                    Change Photo
                  </Button>
                  <p className="mt-2 text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
              </div>

              <Separator />

              <form ref={profileFormRef} action={profileAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={session.user.name} disabled={!isEditing} required />
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
