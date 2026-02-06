import { FullWidthMediaBlockProps } from "@/(admin)/admin/projects/blocks/full-width-media-block"
import Image from "next/image"

export function FullWidthMedia({ block }: { block: FullWidthMediaBlockProps }) {
  const asset = block.asset

  if (!asset) return

  return (
    <div className="my-(--spacing-xl)">
      {asset.assetType === "image" && (
        <Image
          src={asset.s3Url}
          alt={asset.altText || ""}
          width={asset.metadata.width}
          height={asset.metadata.height}
          className="w-full"
        />
      )}
      {asset.assetType === "video" && (
        <video
          src={asset.s3Url}
          width={asset.metadata?.width}
          height={asset.metadata?.height}
          autoPlay
          loop
          muted
          playsInline
          className="w-full bg-white"
        />
      )}
    </div>
  )
}
