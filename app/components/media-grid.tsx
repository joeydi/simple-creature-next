import { MediaGridBlockProps } from "@/(admin)/admin/projects/blocks/media-grid-block"
import Image from "next/image"
import Container from "./Container"
import { LoopingVideo } from "./LoopingVideo"
import { PlayableVideo } from "./PlayableVideo"

const columnClasses: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export function MediaGrid({ block }: { block: MediaGridBlockProps }) {
  return (
    <Container className="my-(--spacing-xl)">
      <div className={`gap-(--spacing-sm) grid ${columnClasses[block.columns]}`}>
        {block.assets.map((asset) => {
          if (asset.assetType === "image") {
            return (
              <Image
                key={asset.id}
                src={asset.s3Url}
                alt={asset.altText || ""}
                width={asset.metadata.width}
                height={asset.metadata.height}
                className="rounded-media w-full bg-white"
              />
            )
          }
          if (asset.assetType === "video") {
            const VideoComponent = (asset.metadata as { isPlayable?: boolean } | null)?.isPlayable
              ? PlayableVideo
              : LoopingVideo
            return (
              <VideoComponent
                key={asset.id}
                src={asset.s3Url}
                poster={asset.thumbnailS3Url ?? undefined}
                width={asset.metadata?.width}
                height={asset.metadata?.height}
                className="rounded-media w-full bg-white"
              />
            )
          }
        })}
      </div>
    </Container>
  )
}
