import { ContentWithMediaBlockProps } from "@/(admin)/admin/projects/blocks/content-with-media-block"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Row from "./Row"
import Column from "./Column"

export function ContentWithMedia({ block }: { block: ContentWithMediaBlockProps }) {
  const widthMap = {
    small: 4,
    medium: 5,
    large: 6,
  }

  return (
    <div className="my-64 flex flex-col gap-8 lg:flex-row">
      <Row>
        <Column lg={widthMap[block.width]}>
          <div className="sticky top-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
          </div>
        </Column>
        <Column lg={12 - widthMap[block.width]}>
          <div className="flex flex-col gap-8">
            {block.assets.map((asset, index) => {
              return (
                <Image
                  key={asset.id || index}
                  src={asset.s3Url}
                  alt={asset.altText || ""}
                  width={asset.metadata?.width || 800}
                  height={asset.metadata?.height || 600}
                />
              )
            })}
          </div>
        </Column>
      </Row>
    </div>
  )
}
