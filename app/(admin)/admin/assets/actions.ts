"use server"

import { db } from "@/db"
import { asset } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, desc, or, ilike, and, count, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { uploadToS3, deleteFromS3, generateS3Key, getPresignedUploadUrl, getS3Url } from "@/lib/s3"
import { MAX_FILE_SIZE } from "@/lib/constants"
import { nanoid } from "nanoid"
import sharp from "sharp"
import type { AssetType, ImageMetadata, VideoMetadata, PDFMetadata, Asset } from "./types"
import OpenAI from "openai"

// Re-export types for convenience
export type { AssetType, ImageMetadata, VideoMetadata, PDFMetadata } from "./types"

// Helper function to determine asset type from mime type
function getAssetType(mimeType: string): AssetType {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType === "application/pdf") return "pdf"
  throw new Error(`Unsupported file type: ${mimeType}`)
}

// Helper function to extract metadata based on file type
async function extractMetadata(
  buffer: Buffer,
  mimeType: string,
): Promise<ImageMetadata | VideoMetadata | PDFMetadata | null> {
  const assetType = getAssetType(mimeType)

  if (assetType === "image") {
    try {
      const metadata = await sharp(buffer).metadata()
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        aspectRatio: metadata.width && metadata.height ? metadata.width / metadata.height : 0,
        format: metadata.format || "unknown",
      } as ImageMetadata
    } catch (error) {
      console.error("Error extracting image metadata:", error)
      return null
    }
  }

  // For video and PDF, return basic metadata (can be enhanced later)
  if (assetType === "video") {
    return {} as VideoMetadata
  }

  if (assetType === "pdf") {
    return {} as PDFMetadata
  }

  return null
}

// Upload asset
export async function uploadAsset(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const file = formData.get("file") as File

  if (!file) {
    throw new Error("No file provided")
  }

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate file type
    const assetType = getAssetType(file.type)

    // Extract metadata
    const metadata = await extractMetadata(buffer, file.type)

    // Generate S3 key and upload
    const s3Key = generateS3Key(file.name)
    const uploadResult = await uploadToS3(buffer, s3Key, file.type)

    // Insert into database
    const newAsset = (await db
      .insert(asset)
      .values({
        id: nanoid(),
        filename: file.name,
        originalFilename: file.name,
        mimeType: file.type,
        fileSize: file.size,
        s3Key: uploadResult.key,
        s3Bucket: uploadResult.bucket,
        s3Url: uploadResult.url,
        assetType,
        metadata: metadata as any,
        uploadedBy: session.user.id,
      })
      .returning()) as Asset[]

    revalidatePath("/admin/assets")
    return newAsset[0]
  } catch (error) {
    console.error("Error uploading asset:", error)
    throw error
  }
}

// Get presigned URL for direct browser upload to S3
export async function getUploadUrl(filename: string, contentType: string, fileSize: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Validate file size
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate file type
  const isImage = contentType.startsWith("image/")
  const isVideo = contentType.startsWith("video/")
  const isPDF = contentType === "application/pdf"

  if (!isImage && !isVideo && !isPDF) {
    throw new Error("Only images, videos, and PDFs are allowed")
  }

  try {
    const s3Key = generateS3Key(filename)
    const presignedUrl = await getPresignedUploadUrl(s3Key, contentType)
    const s3Url = getS3Url(s3Key)

    return {
      presignedUrl,
      s3Key,
      s3Url,
      bucket: process.env.AWS_S3_BUCKET!,
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error)
    throw new Error("Failed to prepare upload. Please try again.")
  }
}

// Complete asset upload after successful S3 upload
export async function completeAssetUpload(data: {
  s3Key: string
  s3Url: string
  filename: string
  mimeType: string
  fileSize: number
  videoMetadata?: VideoMetadata
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  try {
    const assetType = getAssetType(data.mimeType)

    // Extract or use provided metadata
    let metadata: ImageMetadata | VideoMetadata | PDFMetadata | null = null
    if (assetType === "image") {
      try {
        const response = await fetch(data.s3Url)
        const buffer = Buffer.from(await response.arrayBuffer())
        metadata = await extractMetadata(buffer, data.mimeType)
      } catch (err) {
        console.error("Error extracting image metadata:", err)
        // Continue without metadata - not a fatal error
      }
    } else if (assetType === "video" && data.videoMetadata) {
      metadata = data.videoMetadata
    }

    const newAsset = (await db
      .insert(asset)
      .values({
        id: nanoid(),
        filename: data.filename,
        originalFilename: data.filename,
        mimeType: data.mimeType,
        fileSize: data.fileSize,
        s3Key: data.s3Key,
        s3Bucket: process.env.AWS_S3_BUCKET!,
        s3Url: data.s3Url,
        assetType,
        metadata: metadata as any,
        uploadedBy: session.user.id,
      })
      .returning()) as Asset[]

    revalidatePath("/admin/assets")
    return newAsset[0]
  } catch (error) {
    console.error("Error completing asset upload:", error)
    throw new Error("Failed to save asset. The file was uploaded but metadata could not be saved.")
  }
}

// Get asset count
export async function getAssetCount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const [{ total }] = await db.select({ total: count() }).from(asset)

  return total
}

// Get assets with pagination and filters
export async function getAssets(page: number = 1, pageSize: number = 20, search?: string, typeFilter?: AssetType[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const offset = (page - 1) * pageSize

  // Build where clause
  const conditions = []

  if (search) {
    conditions.push(or(ilike(asset.filename, `%${search}%`), ilike(asset.title, `%${search}%`)))
  }

  if (typeFilter) {
    conditions.push(or(...typeFilter.map((type) => eq(asset.assetType, type))))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Get assets
  const assets = (await db
    .select()
    .from(asset)
    .where(whereClause)
    .orderBy(desc(asset.createdAt))
    .limit(pageSize)
    .offset(offset)) as Asset[]

  // Get total count
  const totalResult = await db.select({ count: asset.id }).from(asset).where(whereClause)

  const total = totalResult.length

  return {
    assets,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// Get single asset
export async function getAsset(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const result = await db.select().from(asset).where(eq(asset.id, id))

  if (result.length === 0) {
    throw new Error("Asset not found")
  }

  return result[0]
}

// Get multiple assets by IDs
export async function getAssetsByIds(ids: string[]): Promise<Asset[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (ids.length === 0) {
    return []
  }

  const assets = (await db.select().from(asset).where(inArray(asset.id, ids))) as Asset[]

  return assets
}

// Update asset metadata
export async function updateAsset(id: string, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string | null
  const description = formData.get("description") as string | null
  const altText = formData.get("altText") as string | null
  const tagsStr = formData.get("tags") as string | null
  const tags = tagsStr ? JSON.parse(tagsStr) : null

  await db
    .update(asset)
    .set({
      title: title || null,
      description: description || null,
      altText: altText || null,
      tags,
      updatedAt: new Date(),
    })
    .where(eq(asset.id, id))

  revalidatePath("/admin/assets")
}

// Delete asset
export async function deleteAsset(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get asset to retrieve S3 key
  const assetToDelete = await getAsset(id)

  if (!assetToDelete) {
    throw new Error("Asset not found")
  }

  // Delete from S3
  await deleteFromS3(assetToDelete.s3Key)

  // Delete from database
  await db.delete(asset).where(eq(asset.id, id))

  revalidatePath("/admin/assets")
  redirect("/admin/assets")
}

// Replace asset file
export async function replaceAsset(
  id: string,
  data: {
    s3Key: string
    s3Url: string
    filename: string
    mimeType: string
    fileSize: number
    videoMetadata?: VideoMetadata
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  // Get existing asset to verify type match and get old S3 key
  const existingAsset = await getAsset(id)
  if (!existingAsset) {
    throw new Error("Asset not found")
  }

  // Validate new file type matches original asset type
  const newAssetType = getAssetType(data.mimeType)
  if (newAssetType !== existingAsset.assetType) {
    throw new Error(`Cannot replace ${existingAsset.assetType} with ${newAssetType}. File types must match.`)
  }

  const oldS3Key = existingAsset.s3Key

  // Extract or use provided metadata for the new file
  let metadata: ImageMetadata | VideoMetadata | PDFMetadata | null = null
  if (newAssetType === "image") {
    try {
      const response = await fetch(data.s3Url)
      const buffer = Buffer.from(await response.arrayBuffer())
      metadata = await extractMetadata(buffer, data.mimeType)
    } catch (err) {
      console.error("Error extracting image metadata:", err)
      // Continue without metadata - not a fatal error
    }
  } else if (newAssetType === "video" && data.videoMetadata) {
    metadata = data.videoMetadata
  }

  // Update database record with new file info (preserves title, description, altText, tags)
  await db
    .update(asset)
    .set({
      filename: data.filename,
      originalFilename: data.filename,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      s3Key: data.s3Key,
      s3Url: data.s3Url,
      metadata: metadata as any,
      updatedAt: new Date(),
    })
    .where(eq(asset.id, id))

  // Delete old file from S3
  try {
    await deleteFromS3(oldS3Key)
  } catch (err) {
    console.error("Error deleting old S3 file:", err)
    // Don't throw - the replacement succeeded, old file cleanup is non-critical
  }

  // Get updated asset to return
  const updatedAsset = await getAsset(id)

  revalidatePath("/admin/assets")
  return updatedAsset
}

// Generate alt text using OpenAI Vision API
export async function generateAltText(imageUrl: string, keywords?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  })

  const prompt = `Generate alt text for the following image.

Write in one clear sentence, 125 characters or fewer.

Prioritize accessibility: accurately describe the main subject, action, and relevant context so a visually impaired user understands the image.

Prioritize SEO: naturally include 1–2 high-value keywords related to the subject of the image without keyword stuffing.

Do not start with "Image of" or "Picture of."

Avoid overly artistic interpretation or assumptions that can't be confirmed from the image.

If text is visible in the image, include it briefly.

${keywords ? `Keywords: ${keywords}` : ""}`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    const altText = response.choices[0]?.message?.content?.trim()

    if (!altText) {
      throw new Error("No alt text generated")
    }

    return altText
  } catch (error: any) {
    console.error("Error generating alt text:", error)

    // Provide user-friendly error messages
    if (error.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.")
    } else if (error.status === 401) {
      throw new Error("Invalid API key. Please contact support.")
    } else if (error.message?.includes("image")) {
      throw new Error("Unable to analyze this image. Please try a different image.")
    } else if (error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      throw new Error("Unable to connect to AI service. Check your connection.")
    } else {
      throw new Error("Failed to generate alt text. Please try again.")
    }
  }
}
