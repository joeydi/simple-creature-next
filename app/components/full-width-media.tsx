import { FullWidthMediaBlockProps } from "@/(admin)/admin/projects/blocks/full-width-media-block"
import Image from "next/image"
import { LoopingVideo } from "./LoopingVideo"
import { PlayableVideo } from "./PlayableVideo"

export function FullWidthMedia({ block }: { block: FullWidthMediaBlockProps }) {
  const asset = block.asset

  if (!asset) return

  const VideoComponent = (asset.metadata as { isPlayable?: boolean } | null)?.isPlayable ? PlayableVideo : LoopingVideo

  return (
    <div className="my-(--spacing-xl)">
      {asset.assetType === "image" && (
        <Image
          src={asset.s3Url}
          alt={asset.altText || ""}
          width={asset.metadata.width}
          height={asset.metadata.height}
          className="w-full bg-white"
        />
      )}
      {asset.assetType === "video" && (
        <VideoComponent
          src={asset.s3Url}
          poster={asset.thumbnailS3Url ?? undefined}
          width={asset.metadata?.width}
          height={asset.metadata?.height}
          className="w-full bg-white"
        />
      )}
    </div>
  )
}
