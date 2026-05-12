import { ContentWithMediaBlockProps } from "@/(admin)/admin/projects/blocks/content-with-media-block"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Row from "./Row"
import Column from "./Column"
import Container from "./Container"
import Sticky from "./Sticky"
import { LoopingVideo } from "./LoopingVideo"
import { PlayableVideo } from "./PlayableVideo"

export function ContentWithMedia({ block }: { block: ContentWithMediaBlockProps }) {
  const widthMap = {
    small: 6,
    medium: 7,
    large: 8,
  }

  return (
    <Container className="my-(--spacing-xl)">
      <Row className={block.align === "left" ? "flex-row-reverse" : ""}>
        <Column lg={12 - widthMap[block.width]}>
          <Sticky>
            <div className="markdown-content p-4 lg:p-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
            </div>
          </Sticky>
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
        </Column>
      </Row>
    </Container>
  )
}
