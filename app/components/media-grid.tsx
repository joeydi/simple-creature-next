import { MediaGridBlockProps } from "@/(admin)/admin/projects/blocks/media-grid-block"
import Image from "next/image"
import Container from "./Container"

const columnClasses: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export function MediaGrid({ block }: { block: MediaGridBlockProps }) {
  return (
    <Container className="my-(--spacing-xl)">
      <div className={`grid gap-(--spacing-sm) ${columnClasses[block.columns]}`}>
        {block.assets.map((asset) => {
          if (asset.assetType === "image") {
            return (
              <Image
                key={asset.id}
                src={asset.s3Url}
                alt={asset.altText || ""}
                width={asset.metadata.width}
                height={asset.metadata.height}
                className="w-full rounded-media"
              />
            )
          }
          if (asset.assetType === "video") {
            return (
              <video key={asset.id} src={asset.s3Url} autoPlay loop muted playsInline className="rounded-media" />
            )
          }
        })}
      </div>
    </Container>
  )
}
