import { FullWidthMediaBlockProps } from "@/(admin)/admin/projects/blocks/full-width-media-block"
import Image from "next/image"

export function FullWidthMedia({ block }: { block: FullWidthMediaBlockProps }) {
  const asset = block.asset

  if (!asset) return

  return (
    <div>
      <Image src={asset.s3Url} alt={asset.altText || ""} width={asset.metadata.width} height={asset.metadata.height} />
    </div>
  )
}
