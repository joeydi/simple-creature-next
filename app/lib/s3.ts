import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export interface UploadResult {
  key: string
  url: string
  bucket: string
}

/**
 * Upload a file to S3
 * @param file - Buffer containing the file data
 * @param key - S3 key (path) for the file
 * @param contentType - MIME type of the file
 * @returns Upload result with key, URL, and bucket name
 */
export async function uploadToS3(file: Buffer, key: string, contentType: string): Promise<UploadResult> {
  const bucket = process.env.AWS_S3_BUCKET!

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await s3Client.send(command)

    const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

    return {
      key,
      url,
      bucket,
    }
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Delete a file from S3
 * @param key - S3 key (path) of the file to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
  const bucket = process.env.AWS_S3_BUCKET!

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("Error deleting from S3:", error)
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Generate a unique S3 key for a file
 * @param filename - Original filename
 * @param prefix - Optional prefix (e.g., 'assets')
 * @returns Unique S3 key
 */
export function generateS3Key(filename: string, prefix: string = "assets"): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = filename.split(".").pop()
  const nameWithoutExt = filename.replace(`.${extension}`, "").replace(/[^a-zA-Z0-9-_]/g, "-")

  return `${prefix}/${timestamp}-${randomString}-${nameWithoutExt}.${extension}`
}

/**
 * Generate a presigned URL for direct browser upload to S3
 * @param key - S3 key (path) for the file
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned URL for PUT operation
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const bucket = process.env.AWS_S3_BUCKET!

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn })

  return presignedUrl
}

/**
 * Get the public URL for an S3 object
 * @param key - S3 key (path) for the file
 * @returns Public URL for the object
 */
export function getS3Url(key: string): string {
  const bucket = process.env.AWS_S3_BUCKET!
  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
