"use server"

import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { desc, or, ilike, and, eq, count } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { uploadToS3, generateS3Key, deleteFromS3 } from "@/lib/s3"
import sharp from "sharp"

// Get user count
export async function getUserCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const [{ total }] = await db.select({ total: count() }).from(user)

  return total
}

// Get users with pagination and search
export async function getUsers(page: number = 1, pageSize: number = 20, search?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const offset = (page - 1) * pageSize

  // Build where clause for search
  const conditions = []

  if (search) {
    conditions.push(or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`)))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Get users
  const users = await db
    .select()
    .from(user)
    .where(whereClause)
    .orderBy(desc(user.createdAt))
    .limit(pageSize)
    .offset(offset)

  // Get total count
  const totalResult = await db.select({ count: user.id }).from(user).where(whereClause)

  const total = totalResult.length

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// Delete user
export async function deleteUser(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Prevent users from deleting themselves
  if (session.user.id === id) {
    throw new Error("You cannot delete your own account")
  }

  await db.delete(user).where(eq(user.id, id))

  revalidatePath("/admin/users")
}

// Generate a secure random password
function generateSecurePassword(length: number = 16): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const allChars = lowercase + uppercase + numbers + symbols

  // Ensure at least one character from each category
  let password = ""
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password to randomize character positions
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
})

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  image: z.string().optional(),
})

type ActionState = {
  success: boolean
  message: string
  password?: string
} | null

// Get single user
export async function getUser(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const result = await db.select().from(user).where(eq(user.id, id))

  if (result.length === 0) {
    throw new Error("User not found")
  }

  return result[0]
}

// Create user
export async function createUser(prevState: ActionState, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    // Validate input
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    }

    const validatedData = createUserSchema.parse(rawData)

    // Check if email already exists
    const existingUser = await db.select().from(user).where(eq(user.email, validatedData.email))

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "A user with this email already exists",
      }
    }

    // Generate a secure random password
    const generatedPassword = generateSecurePassword(16)

    // Create user via better-auth createUser
    const result = await auth.api.createUser({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: generatedPassword,
      },
      headers: await headers(),
    })

    if (!result) {
      return {
        success: false,
        message: "Failed to create user",
      }
    }

    revalidatePath("/admin/users")

    return {
      success: true,
      message: `User created successfully! Temporary password: ${generatedPassword}`,
      password: generatedPassword,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    console.error("Create user error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create user. Please try again.",
    }
  }
}

// Update user
export async function updateUser(prevState: ActionState, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      }
    }

    // Validate input
    const rawData = {
      id: formData.get("id") as string,
      name: formData.get("name") as string,
      image: formData.get("image") as string | undefined,
    }

    const validatedData = updateUserSchema.parse(rawData)

    // Update user
    await db
      .update(user)
      .set({
        name: validatedData.name,
        image: validatedData.image || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, validatedData.id))

    revalidatePath("/admin/users")

    return {
      success: true,
      message: "User updated successfully!",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      }
    }

    console.error("Update user error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user. Please try again.",
    }
  }
}

export async function uploadUserAvatar(formData: FormData) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const id = formData.get("id") as string
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

    // Update user
    await db
      .update(user)
      .set({
        image: uploadResult.url,
      })
      .where(eq(user.id, id))

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
