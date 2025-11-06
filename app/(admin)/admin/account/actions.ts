"use server"

import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long"),
  confirmPassword: z.string(),
})

type ActionState = {
  success: boolean
  message: string
  resetForm?: boolean
} | null

// Server Action: Update user profile
export async function updateProfile(prevState: ActionState, formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in again.",
      }
    }

    // Validate input
    const rawData = {
      name: formData.get("name") as string,
    }

    const validatedData = profileSchema.parse(rawData)

    // Update user via better-auth
    await auth.api.updateUser({
      body: {
        name: validatedData.name,
      },
      headers: await headers(),
    })

    // Revalidate the account page to show updated data
    revalidatePath("/account")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Profile updated successfully!",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    console.error("Profile update error:", error)
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    }
  }
}

// Server Action: Change password
export async function changePassword(prevState: ActionState, formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized. Please log in again.",
      }
    }

    // Validate input
    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validatedData = passwordSchema.parse(rawData)

    // Check if passwords match
    if (validatedData.newPassword !== validatedData.confirmPassword) {
      return {
        success: false,
        message: "New passwords do not match",
      }
    }

    // Change password via better-auth
    await auth.api.changePassword({
      body: {
        currentPassword: validatedData.currentPassword,
        newPassword: validatedData.newPassword,
        revokeOtherSessions: true, // Sign out from other devices
      },
      headers: await headers(),
    })

    // Revalidate the account page
    revalidatePath("/account")

    return {
      success: true,
      message: "Password changed successfully! Other sessions have been signed out.",
      resetForm: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    console.error("Password change error:", error)

    // Better-auth returns specific error messages
    const errorMessage = error instanceof Error ? error.message : "Failed to change password"

    return {
      success: false,
      message: errorMessage.includes("password")
        ? "Current password is incorrect"
        : "Failed to change password. Please try again.",
    }
  }
}
