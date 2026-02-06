import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FullWidthContentBlockProps } from "@/(admin)/admin/projects/blocks/full-width-content-block"
import Container from "./Container"
import Row from "./Row"
import Column from "./Column"

export function FullWidthContent({ block }: { block: FullWidthContentBlockProps }) {
  return (
    <Container className="my-(--spacing-xl)">
      <Row>
        <Column lg={10} xl={9} className="px-(--spacing-xs) [&>p]:max-w-5xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
        </Column>
      </Row>
    </Container>
  )
}
