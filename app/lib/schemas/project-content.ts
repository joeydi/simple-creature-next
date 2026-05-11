import { z } from "zod"

// Asset metadata schemas
const imageMetadataSchema = z.object({
  width: z.number(),
  height: z.number(),
  aspectRatio: z.number(),
  format: z.string(),
})

const videoMetadataSchema = z.object({
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
})

const pdfMetadataSchema = z.object({
  pageCount: z.number().optional(),
})

// Asset schema matching the database Asset type
// More lenient validation - allows missing fields that may not be present
export const assetSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  fileSize: z.number(),
  s3Key: z.string(),
  s3Bucket: z.string(),
  s3Url: z.string(),
  assetType: z.string(),
  metadata: z.any(),
  thumbnailS3Key: z.string().nullable().optional(),
  thumbnailS3Url: z.string().nullable().optional(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  altText: z.string().nullable(),
  tags: z.unknown(),
  uploadedBy: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
})

// Block schemas
export const fullWidthMediaBlockSchema = z.object({
  id: z.string(),
  type: z.literal("full-width-media"),
  asset: assetSchema.nullable(),
})

export const fullWidthContentBlockSchema = z.object({
  id: z.string(),
  type: z.literal("full-width-content"),
  content: z.string(),
})

export const contentWithMediaBlockSchema = z.object({
  id: z.string(),
  type: z.literal("content-with-media"),
  content: z.string(),
  assets: z.array(assetSchema),
  align: z.enum(["left", "right"]),
  width: z.enum(["small", "medium", "large"]),
})

export const mediaGridBlockSchema = z.object({
  id: z.string(),
  type: z.literal("media-grid"),
  assets: z.array(assetSchema),
  columns: z.enum(["1", "2", "3", "4"]),
})

// Union of all block types
export const blockSchema = z.discriminatedUnion("type", [
  fullWidthMediaBlockSchema,
  fullWidthContentBlockSchema,
  contentWithMediaBlockSchema,
  mediaGridBlockSchema,
])

// Main project content schema
export const projectContentSchema = z.object({
  blocks: z.array(blockSchema),
})

// TypeScript types
export type Asset = z.infer<typeof assetSchema>
export type FullWidthMediaBlock = z.infer<typeof fullWidthMediaBlockSchema>
export type FullWidthContentBlock = z.infer<typeof fullWidthContentBlockSchema>
export type ContentWithMediaBlock = z.infer<typeof contentWithMediaBlockSchema>
export type MediaGridBlock = z.infer<typeof mediaGridBlockSchema>
export type Block = z.infer<typeof blockSchema>
export type ProjectContent = z.infer<typeof projectContentSchema>
