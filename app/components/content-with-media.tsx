import { ContentWithMediaBlockProps } from "@/(admin)/admin/projects/blocks/content-with-media-block"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Row from "./Row"
import Column from "./Column"
import Container from "./Container"

export function ContentWithMedia({ block }: { block: ContentWithMediaBlockProps }) {
  const widthMap = {
    small: 6,
    medium: 7,
    large: 8,
  }

  return (
    <Container className="my-(--spacing-xl) flex flex-col gap-8 lg:flex-row">
      <Row className={block.align === "left" ? "flex-row-reverse" : ""}>
        <Column lg={12 - widthMap[block.width]}>
          <div className="sticky top-0 p-4 lg:p-8 [&>h3]:text-gray-500">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
          </div>
        </Column>
        <Column lg={widthMap[block.width]}>
          <div className="gap-(--spacing-sm) flex flex-col">
            {block.assets.map((asset) => {
              if (asset.assetType === "image") {
                return (
                  <Image
                    key={asset.id}
                    src={asset.s3Url}
                    alt={asset.altText || ""}
                    width={asset.metadata.width}
                    height={asset.metadata.height}
                    className="rounded-media"
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
        </Column>
      </Row>
    </Container>
  )
}
