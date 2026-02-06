import { config } from "dotenv"

// Load environment variables from .env.local BEFORE importing db
config({ path: ".env.local" })

// Dynamic imports after env is loaded
async function main() {
  const { db } = await import("@/db")
  const { asset } = await import("@/db/schema")
  const { eq, and, isNull, or, sql } = await import("drizzle-orm")
  const ffmpeg = (await import("fluent-ffmpeg")).default
  const ffprobeInstaller = (await import("@ffprobe-installer/ffprobe")).default

  interface VideoMetadata {
    width?: number
    height?: number
    duration?: number
  }

  // Configure ffprobe path
  ffmpeg.setFfprobePath(ffprobeInstaller.path)

  async function getVideosNeedingMetadata() {
    // Find videos where metadata is null, empty {}, or missing required fields
    const videos = await db
      .select()
      .from(asset)
      .where(
        and(
          eq(asset.assetType, "video"),
          or(
            isNull(asset.metadata),
            sql`${asset.metadata}::text = '{}'`,
            sql`NOT (${asset.metadata} ? 'width' AND ${asset.metadata} ? 'height' AND ${asset.metadata} ? 'duration')`
          )
        )
      )

    return videos
  }

  function extractVideoMetadataFromUrl(url: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(url, (err, metadata) => {
        if (err) {
          reject(err)
          return
        }

        const videoStream = metadata.streams.find((s) => s.codec_type === "video")

        resolve({
          width: videoStream?.width,
          height: videoStream?.height,
          duration: metadata.format.duration,
        })
      })
    })
  }

  async function updateAssetMetadata(id: string, metadata: VideoMetadata) {
    await db
      .update(asset)
      .set({
        metadata: metadata,
        updatedAt: new Date(),
      })
      .where(eq(asset.id, id))
  }

  console.log("Starting video metadata backfill...")
  console.log("")

  const videos = await getVideosNeedingMetadata()
  console.log(`Found ${videos.length} videos needing metadata`)
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

      const metadata = await extractVideoMetadataFromUrl(video.s3Url)

      await updateAssetMetadata(video.id, metadata)

      console.log(`  ✓ ${metadata.width}x${metadata.height}, ${metadata.duration?.toFixed(2)}s`)
      succeeded++
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
