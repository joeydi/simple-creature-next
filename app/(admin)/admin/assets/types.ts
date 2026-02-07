// Asset type discriminator
export type AssetType = "image" | "video" | "pdf"

// Metadata types for different asset types
export interface ImageMetadata {
  width: number
  height: number
  aspectRatio: number
  format: string
}

export interface VideoMetadata {
  width?: number
  height?: number
  duration?: number
}

export interface PDFMetadata {
  pageCount?: number
}

// Unified Asset interface used across all components
export interface Asset {
  id: string
  filename: string
  originalFilename: string
  mimeType: string
  fileSize: number
  s3Key: string
  s3Bucket: string
  s3Url: string
  assetType: AssetType
  metadata: ImageMetadata | VideoMetadata | PDFMetadata
  thumbnailS3Key: string | null
  thumbnailS3Url: string | null
  title: string | null
  description: string | null
  altText: string | null
  tags: unknown
  uploadedBy: string
  createdAt: Date
  updatedAt: Date
}
