import type { VideoMetadata } from "./types"

// Extract video metadata using HTML5 video element
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const video = document.createElement("video")
    video.preload = "metadata"

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      resolve({}) // Return empty metadata on error
    }

    video.src = URL.createObjectURL(file)
  })
}
