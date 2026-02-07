"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface AssetPreviewProps {
  asset: {
    assetType: string
    s3Url: string
    altText?: string | null
    filename: string
    thumbnailS3Url?: string | null
  }
  className?: string
  fill?: boolean
  showControls?: boolean
}

/**
 * Renders an image or video preview for an asset
 */
export function AssetPreview({ asset, className, fill = true, showControls = false }: AssetPreviewProps) {
  if (asset.assetType === "image") {
    return (
      <Image
        src={asset.s3Url}
        alt={asset.altText || asset.filename}
        fill={fill}
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      />
    )
  }

  if (asset.assetType === "video") {
    return (
      <video
        src={asset.s3Url}
        poster={asset.thumbnailS3Url || undefined}
        controls={showControls}
        className={cn("h-full w-full object-cover", className)}
      >
        <track kind="captions" />
      </video>
    )
  }

  return null
}
