"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), {
  ssr: false,
})

interface FullWidthContentBlockProps {
  content: string
  onChange: (content: string) => void
}

export function FullWidthContentBlock({ content, onChange }: FullWidthContentBlockProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Content</label>
      <div data-color-mode="light">
        <MDEditor
          value={content}
          onChange={(value) => onChange(value || "")}
          preview="edit"
          height={300}
          visibleDragbar={false}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Use Markdown syntax to format your content. Preview will be shown when published.
      </p>
    </div>
  )
}
