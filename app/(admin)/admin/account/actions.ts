"use server"

import { auth } from "@/lib/auth-server"
import { headers } from "next/headers"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { uploadToS3, generateS3Key, deleteFromS3 } from "@/lib/s3"
import sharp from "sharp"

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

// Server Action: Upload avatar
export async function uploadAvatar(formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const file = formData.get("file") as File

    if (!file) {
      throw new Error("No file provided")
    }

    // Validate file type (only images)
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed")
    }

    // Validate file size (max 2MB)
    const MAX_SIZE = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_SIZE) {
      throw new Error("Image must be less than 2MB")
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process image with sharp - resize and optimize
    const processedBuffer = await sharp(buffer)
      .resize(500, 500, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 90 })
      .toBuffer()

    // Delete old avatar from S3 if it exists and is not a gravatar
    if (session.user.image && session.user.image.includes("s3.amazonaws.com")) {
      try {
        // Extract S3 key from URL
        const urlParts = session.user.image.split("/")
        const oldKey = urlParts.slice(-2).join("/") // Get users/filename part
        await deleteFromS3(oldKey)
      } catch (error) {
        console.error("Error deleting old avatar:", error)
        // Continue with upload even if delete fails
      }
    }

    // Generate S3 key and upload to /users directory
    const s3Key = generateS3Key(file.name, "users")
    const uploadResult = await uploadToS3(processedBuffer, s3Key, "image/jpeg")

    // Update user image URL via better-auth
    await auth.api.updateUser({
      body: {
        image: uploadResult.url,
      },
      headers: await headers(),
    })

    // Revalidate pages where avatar appears
    revalidatePath("/admin/account")
    revalidatePath("/admin")
    revalidatePath("/", "layout") // Revalidate root layout to update avatar in navigation/header

    return {
      success: true,
      message: "Profile photo updated successfully!",
      imageUrl: uploadResult.url,
    }
  } catch (error) {
    console.error("Avatar upload error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload photo. Please try again.",
    }
  }
}
