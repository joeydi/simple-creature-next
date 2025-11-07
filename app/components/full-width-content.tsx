import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { FullWidthContentBlockProps } from "@/(admin)/admin/projects/blocks/full-width-content-block"

export function FullWidthContent({ block }: { block: FullWidthContentBlockProps }) {
  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
    </div>
  )
}
