import ffmpeg from "fluent-ffmpeg"
import ffprobeInstaller from "@ffprobe-installer/ffprobe"
import sharp from "sharp"
import { uploadToS3, generateS3Key, getS3Url } from "@/lib/s3"
import { Readable } from "stream"

// Configure ffprobe path
ffmpeg.setFfprobePath(ffprobeInstaller.path)

/**
 * Extract a frame from a video at the specified timestamp
 * @param s3Url - Public URL of the video on S3
 * @param timestamp - Timestamp in seconds (default: 0)
 * @returns Buffer containing the extracted frame as PNG
 */
export async function generateVideoThumbnail(s3Url: string, timestamp: number = 0): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const timeoutMs = 8000 // 8 second timeout

    // Create timeout handler
    const timeoutId = setTimeout(() => {
      reject(new Error(`Thumbnail generation timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    try {
      ffmpeg(s3Url)
        .screenshots({
          timestamps: [timestamp],
          filename: "thumbnail.png",
          size: "?x?", // Maintain original dimensions
        })
        .on("error", (err) => {
          clearTimeout(timeoutId)
          reject(new Error(`FFmpeg error: ${err.message}`))
        })
        .on("end", () => {
          clearTimeout(timeoutId)
          // This event fires but the file is written to disk
          // We need a different approach - stream to buffer
        })
        // Use pipe to capture output as buffer
        .pipe()
        .on("data", (chunk: Buffer) => {
          chunks.push(chunk)
        })
        .on("end", () => {
          clearTimeout(timeoutId)
          resolve(Buffer.concat(chunks))
        })
        .on("error", (err: Error) => {
          clearTimeout(timeoutId)
          reject(err)
        })
    } catch (error) {
      clearTimeout(timeoutId)
      reject(error)
    }
  })
}

/**
 * Alternative implementation using output format
 */
export async function extractVideoFrame(s3Url: string, timestamp: number = 0): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const timeoutMs = 8000

    const timeoutId = setTimeout(() => {
      reject(new Error(`Thumbnail generation timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    try {
      const stream = ffmpeg(s3Url)
        .seekInput(timestamp)
        .frames(1)
        .outputFormat("image2pipe")
        .outputOptions("-vcodec", "png")
        .on("error", (err) => {
          clearTimeout(timeoutId)
          reject(new Error(`FFmpeg error: ${err.message}`))
        })
        .pipe() as Readable

      stream.on("data", (chunk: Buffer) => {
        chunks.push(chunk)
      })

      stream.on("end", () => {
        clearTimeout(timeoutId)
        if (chunks.length === 0) {
          reject(new Error("No data received from FFmpeg"))
        } else {
          resolve(Buffer.concat(chunks))
        }
      })

      stream.on("error", (err: Error) => {
        clearTimeout(timeoutId)
        reject(err)
      })
    } catch (error) {
      clearTimeout(timeoutId)
      reject(error)
    }
  })
}

/**
 * Optimize thumbnail image - convert to JPEG with compression
 * Maintains original dimensions (no resize)
 * @param buffer - Buffer containing the image data
 * @returns Optimized JPEG buffer
 */
export async function optimizeThumbnail(buffer: Buffer): Promise<Buffer> {
  try {
    const optimized = await sharp(buffer)
      .jpeg({
        quality: 85,
        mozjpeg: true, // Use mozjpeg for better compression
      })
      .toBuffer()

    return optimized
  } catch (error) {
    throw new Error(`Thumbnail optimization error: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Generate a video thumbnail and upload it to S3
 * Orchestrates frame extraction, optimization, and S3 upload
 * @param videoS3Url - Public URL of the video on S3
 * @returns Object with S3 key and URL, or null if generation fails
 */
export async function generateAndUploadThumbnail(
  videoS3Url: string,
): Promise<{ key: string; url: string } | null> {
  try {
    console.log(`Generating thumbnail for video: ${videoS3Url}`)

    // Step 1: Extract frame from video at 0 seconds
    const frameBuffer = await extractVideoFrame(videoS3Url, 0)
    console.log(`Frame extracted, size: ${frameBuffer.length} bytes`)

    // Step 2: Optimize the thumbnail
    const optimizedBuffer = await optimizeThumbnail(frameBuffer)
    console.log(`Thumbnail optimized, size: ${optimizedBuffer.length} bytes`)

    // Step 3: Generate S3 key and upload
    const thumbnailKey = generateS3Key("thumbnail.jpg", "thumbnails")
    const uploadResult = await uploadToS3(optimizedBuffer, thumbnailKey, "image/jpeg")

    console.log(`Thumbnail uploaded successfully: ${uploadResult.url}`)

    return {
      key: uploadResult.key,
      url: uploadResult.url,
    }
  } catch (error) {
    console.error("Thumbnail generation failed:", error)
    // Return null on failure - graceful degradation
    return null
  }
}
