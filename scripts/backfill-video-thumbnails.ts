import { config } from "dotenv"

// Load environment variables from .env.local BEFORE importing db
config({ path: ".env.local" })

// Dynamic imports after env is loaded
async function main() {
  const { db } = await import("@/db")
  const { asset } = await import("@/db/schema")
  const { eq, and, isNull } = await import("drizzle-orm")
  const { generateAndUploadThumbnail } = await import("@/lib/video-thumbnails")

  async function getVideosNeedingThumbnails() {
    // Find videos where thumbnailS3Key is null
    const videos = await db
      .select()
      .from(asset)
      .where(and(eq(asset.assetType, "video"), isNull(asset.thumbnailS3Key)))

    return videos
  }

  async function updateAssetThumbnail(id: string, thumbnailS3Key: string, thumbnailS3Url: string) {
    await db
      .update(asset)
      .set({
        thumbnailS3Key,
        thumbnailS3Url,
        updatedAt: new Date(),
      })
      .where(eq(asset.id, id))
  }

  console.log("Starting video thumbnail backfill...")
  console.log("")

  const videos = await getVideosNeedingThumbnails()
  console.log(`Found ${videos.length} videos needing thumbnails`)
  console.log("")

  if (videos.length === 0) {
    console.log("No videos to process. Exiting.")
    return { processed: 0, succeeded: 0, failed: 0, errors: [] }
  }

  let processed = 0
  let succeeded = 0
  let failed = 0
  const errors: Array<{ id: string; filename: string; error: string }> = []

  for (const video of videos) {
    processed++
    const progress = `[${processed}/${videos.length}]`

    try {
      console.log(`${progress} Processing: ${video.filename}`)

      const thumbnail = await generateAndUploadThumbnail(video.s3Url)

      if (thumbnail) {
        await updateAssetThumbnail(video.id, thumbnail.key, thumbnail.url)
        console.log(`  ✓ Thumbnail generated: ${thumbnail.url}`)
        succeeded++
      } else {
        throw new Error("Thumbnail generation returned null")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.log(`  ✗ Failed: ${errorMessage}`)
      errors.push({
        id: video.id,
        filename: video.filename,
        error: errorMessage,
      })
      failed++
    }
  }

  return { processed, succeeded, failed, errors }
}

main()
  .then((result) => {
    console.log("")
    console.log("=".repeat(50))
    console.log("Backfill complete!")
    console.log(`  Processed: ${result.processed}`)
    console.log(`  Succeeded: ${result.succeeded}`)
    console.log(`  Failed: ${result.failed}`)

    if (result.errors && result.errors.length > 0) {
      console.log("")
      console.log("Failed videos:")
      result.errors.forEach((e) => {
        console.log(`  - ${e.filename} (${e.id}): ${e.error}`)
      })
    }

    process.exit(result.failed > 0 ? 1 : 0)
  })
  .catch((error) => {
    console.error("Fatal error:", error)
    process.exit(1)
  })
